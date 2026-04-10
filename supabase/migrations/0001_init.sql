-- ============================================================
-- Estación Snack — Schema inicial
-- Migración: 0001_init.sql
-- ============================================================

-- Extensión para UUIDs
create extension if not exists "pgcrypto";

-- ============================================================
-- PRODUCTS
-- ============================================================
create table products (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  category      text not null,           -- 'frutos' | 'dulces'
  price         int  not null,           -- CLP, precio por kg
  unit          text not null default 'kg',
  stock_kg      numeric(10,3) not null default 0,
  low_threshold numeric(10,3) not null default 1,
  -- status es columna generada
  status text generated always as (
    case
      when stock_kg = 0             then 'agotado'
      when stock_kg <= 1            then 'ultimo_kg'
      when stock_kg <= low_threshold then 'pocas'
      else                               'disponible'
    end
  ) stored,
  image_url      text,
  image_webp_url text,
  image_400_url  text,
  copy           text,
  badge          text,
  color          text not null default 'orange',
  sort_order     int  not null default 99,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index idx_products_status     on products(status);
create index idx_products_sort_order on products(sort_order);

-- Auto-update updated_at
create or replace function fn_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_products_updated_at
  before update on products
  for each row execute function fn_set_updated_at();

-- ============================================================
-- CUSTOMERS
-- ============================================================
create table customers (
  id              uuid primary key default gen_random_uuid(),
  phone           text unique not null,
  name            text,
  first_order_at  timestamptz,
  last_order_at   timestamptz,
  total_orders    int not null default 0,
  total_spent     int not null default 0,
  tags            text[] not null default '{}',
  created_at      timestamptz not null default now()
);

create index idx_customers_phone on customers(phone);

-- ============================================================
-- ORDERS
-- ============================================================
create table orders (
  id               uuid primary key default gen_random_uuid(),
  customer_id      uuid references customers(id) on delete set null,
  status           text not null default 'pending_whatsapp'
                   check (status in ('pending_whatsapp','confirmed','preparing','delivered','cancelled')),
  total            int not null default 0,
  subtotal         int not null default 0,
  shipping         int not null default 0,
  notes            text,
  customer_name    text,       -- snapshot al crear
  customer_phone   text,       -- snapshot al crear
  whatsapp_sent_at timestamptz,
  confirmed_at     timestamptz,
  created_at       timestamptz not null default now()
);

create index idx_orders_status     on orders(status);
create index idx_orders_created_at on orders(created_at desc);
create index idx_orders_customer   on orders(customer_id);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders(id) on delete cascade,
  product_id   uuid references products(id) on delete set null,
  product_name text not null,   -- snapshot
  qty          numeric(10,3) not null,
  unit_price   int not null,
  subtotal     int not null
);

create index idx_order_items_order on order_items(order_id);

-- ============================================================
-- STOCK RESERVATIONS (TTL 15 min)
-- ============================================================
create table stock_reservations (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  qty        numeric(10,3) not null,
  session_id text not null,
  expires_at timestamptz not null default (now() + interval '15 minutes'),
  created_at timestamptz not null default now()
);

create index idx_reservations_session    on stock_reservations(session_id);
create index idx_reservations_product    on stock_reservations(product_id);
create index idx_reservations_expires_at on stock_reservations(expires_at);

-- ============================================================
-- RLS
-- ============================================================
alter table products           enable row level security;
alter table customers          enable row level security;
alter table orders             enable row level security;
alter table order_items        enable row level security;
alter table stock_reservations enable row level security;

-- Lectura pública de productos (catálogo)
create policy "products_public_read"
  on products for select
  using (true);

-- Reservations: lectura y escritura por session_id (anon)
create policy "reservations_insert_anon"
  on stock_reservations for insert
  with check (true);

create policy "reservations_select_session"
  on stock_reservations for select
  using (true);

create policy "reservations_delete_session"
  on stock_reservations for delete
  using (true);

-- Orders: insertar como anon (server action usa service role en la transacción)
-- El resto solo accesible por service role (admin panel)

-- ============================================================
-- fn_reserve_stock
-- Inserta o actualiza una reserva para (session_id, product_id).
-- Devuelve true si hay stock suficiente, false si no.
-- ============================================================
create or replace function fn_reserve_stock(
  p_session_id text,
  p_product_id uuid,
  p_qty        numeric
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_stock         numeric;
  v_reserved_other numeric;
  v_available     numeric;
begin
  -- Lock the product row
  select stock_kg into v_stock
  from products
  where id = p_product_id
  for update;

  -- Stock reserved by OTHER sessions (active, not expired)
  select coalesce(sum(qty), 0) into v_reserved_other
  from stock_reservations
  where product_id = p_product_id
    and session_id <> p_session_id
    and expires_at > now();

  v_available := v_stock - v_reserved_other;

  if v_available < p_qty then
    return false;
  end if;

  -- Upsert reservation for this session
  delete from stock_reservations
  where product_id = p_product_id and session_id = p_session_id;

  if p_qty > 0 then
    insert into stock_reservations (product_id, session_id, qty, expires_at)
    values (p_product_id, p_session_id, p_qty, now() + interval '15 minutes');
  end if;

  return true;
end;
$$;

-- ============================================================
-- fn_release_expired_reservations
-- Llamar periódicamente (o desde un cron edge function).
-- ============================================================
create or replace function fn_release_expired_reservations()
returns int
language plpgsql
security definer
as $$
declare
  v_count int;
begin
  delete from stock_reservations
  where expires_at <= now();

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- ============================================================
-- fn_place_order
-- Flujo transaccional completo:
--   1. Libera reservas expiradas
--   2. Valida stock disponible para cada item
--   3. Descuenta stock
--   4. Crea order + order_items
--   5. Libera reservas de esta sesión
--   6. Upsert customer
-- Devuelve order_id o lanza excepción.
-- ============================================================
create or replace function fn_place_order(
  p_session_id    text,
  p_customer_name text,
  p_customer_phone text,
  p_items         jsonb,   -- [{product_id, qty}]
  p_notes         text default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_order_id     uuid;
  v_customer_id  uuid;
  v_subtotal     int := 0;
  v_item         jsonb;
  v_product_id   uuid;
  v_qty          numeric;
  v_price        int;
  v_name         text;
  v_stock        numeric;
  v_reserved_other numeric;
  v_available    numeric;
  v_item_sub     int;
begin
  -- Limpiar reservas expiradas
  delete from stock_reservations where expires_at <= now();

  -- Validar y descontar stock por cada item
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty        := (v_item->>'qty')::numeric;

    select stock_kg, price, name
      into v_stock, v_price, v_name
    from products
    where id = v_product_id
    for update;

    if not found then
      raise exception 'Producto no encontrado: %', v_product_id;
    end if;

    -- Stock real disponible (excluyendo reservas de OTRAS sesiones)
    select coalesce(sum(qty), 0) into v_reserved_other
    from stock_reservations
    where product_id = v_product_id
      and session_id <> p_session_id
      and expires_at > now();

    v_available := v_stock - v_reserved_other;

    if v_available < v_qty then
      raise exception 'Stock insuficiente para %: disponible %, pedido %',
        v_name, v_available, v_qty;
    end if;

    -- Descontar
    update products set stock_kg = stock_kg - v_qty where id = v_product_id;

    v_item_sub := (v_price * v_qty)::int;
    v_subtotal := v_subtotal + v_item_sub;
  end loop;

  -- Upsert customer
  insert into customers (phone, name, first_order_at, last_order_at, total_orders)
  values (p_customer_phone, p_customer_name, now(), now(), 1)
  on conflict (phone) do update
    set name          = excluded.name,
        last_order_at = now(),
        total_orders  = customers.total_orders + 1,
        total_spent   = customers.total_spent + v_subtotal
  returning id into v_customer_id;

  -- Crear order
  insert into orders (customer_id, customer_name, customer_phone, status,
                      subtotal, shipping, total, notes, whatsapp_sent_at)
  values (v_customer_id, p_customer_name, p_customer_phone,
          'pending_whatsapp', v_subtotal, 0, v_subtotal, p_notes, now())
  returning id into v_order_id;

  -- Crear order_items
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty        := (v_item->>'qty')::numeric;

    select price, name into v_price, v_name
    from products where id = v_product_id;

    insert into order_items (order_id, product_id, product_name, qty, unit_price, subtotal)
    values (v_order_id, v_product_id, v_name, v_qty, v_price, (v_price * v_qty)::int);
  end loop;

  -- Liberar reservas de esta sesión
  delete from stock_reservations where session_id = p_session_id;

  return v_order_id;
end;
$$;

-- ============================================================
-- SEED — 6 productos actuales
-- ============================================================
insert into products (slug, name, category, price, unit, stock_kg, low_threshold, image_url, image_webp_url, image_400_url, copy, badge, color, sort_order) values
  ('mix-europeo',            'Mix Europeo',            'frutos', 13000, 'kg', 5, 2,
   '/img/mix-europeo-x-kilo.jpg', '/img/mix-europeo-x-kilo.webp', '/img/mix-europeo-x-kilo-400.webp',
   'Maní sin sal, almendras, nueces y avellanas. La mezcla que desaparece primero de la mesa.',
   'Top ventas', 'orange', 1),

  ('mani-confitado-tropical', 'Maní Confitado Tropical', 'dulces', 5990, 'kg', 5, 2,
   '/img/mani-confitado-tropical-x-kilo.jpg', '/img/mani-confitado-tropical-x-kilo.webp', '/img/mani-confitado-tropical-x-kilo-400.webp',
   'Maní envuelto en azúcar de colores. Crujiente, dulce, imposible parar.',
   null, 'green', 2),

  ('mani-confitado-rojo',    'Maní Confitado Rojo',    'dulces', 5990, 'kg', 5, 2,
   '/img/mani-confitado-natural-rojo-x-kilo.jpg', '/img/mani-confitado-natural-rojo-x-kilo.webp', '/img/mani-confitado-natural-rojo-x-kilo-400.webp',
   'El confitado clásico. Rojo oscuro, crujiente por fuera, maní tostado por dentro.',
   null, 'red', 3),

  ('chuby-bardu',            'Chuby Bardú',            'dulces', 9990, 'kg', 5, 2,
   '/img/chuby-bardu-x-kilo-.jpg', '/img/chuby-bardu-x-kilo-.webp', '/img/chuby-bardu-x-kilo--400.webp',
   'Confites de chocolate en todos los colores. Los que desaparecen del bowl sin que nadie confiese.',
   'Popular', 'purple', 4),

  ('gomita-osito-docile',    'Gomita Osito Docile',    'dulces', 8500, 'kg', 5, 2,
   '/img/gomita-osito-docile-x-kg.jpg', '/img/gomita-osito-docile-x-kg.webp', '/img/gomita-osito-docile-x-kg-400.webp',
   'Ositos de goma suaves. Los comes de a uno y cuando cachái se acabaron.',
   null, 'yellow', 5),

  ('almendra-entera',        'Almendra Entera',        'frutos', 16000, 'kg', 1, 2,
   '/img/saco-almendra-enteras-x-10-kilos.jpg', '/img/saco-almendra-enteras-x-10-kilos.webp', '/img/saco-almendra-enteras-x-10-kilos-400.webp',
   'Almendra natural con piel. Crujiente, nutritiva, de primera. Solo queda un kilo.',
   'Último kg', 'sand', 6);
