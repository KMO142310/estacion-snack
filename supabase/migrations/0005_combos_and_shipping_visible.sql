-- ============================================================
-- Estación Snack — Migración 0005
-- Tabla combos + combo_items + is_visible en shipping_zones
-- ============================================================

-- ============================================================
-- COMBOS
-- Los packs armados son combinaciones sugeridas de 2 SKUs base.
-- El precio aquí es la suma exacta de los SKUs; no hay descuento.
-- Ver nota legal en components/Combos.tsx y FL-3 en SECURITY_AUDIT.md.
-- ============================================================
create table combos (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  description    text not null default '',
  tag            text not null default '',
  price          int not null,           -- CLP, suma exacta de SKUs base
  image_url      text,
  image_webp_url text,
  bg_color       text not null default 'var(--orange-soft)',
  is_active      boolean not null default true,
  sort_order     int not null default 99,
  created_at     timestamptz not null default now()
);

-- ============================================================
-- COMBO ITEMS
-- Qué SKUs componen cada combo y en qué cantidad.
-- qty_g: gramos (500g = 1 kg × 0.5)
-- ============================================================
create table combo_items (
  id         uuid primary key default gen_random_uuid(),
  combo_id   uuid not null references combos(id) on delete cascade,
  product_id text not null,   -- referencias a products.id (text en schema actual)
  qty_g      int not null     -- cantidad en gramos que se agrega al carrito
);

-- RLS: lectura pública, escritura solo service role
alter table combos      enable row level security;
alter table combo_items enable row level security;

create policy "combos_public_read"
  on combos for select
  using (is_active = true);

create policy "combo_items_public_read"
  on combo_items for select
  using (true);

-- ============================================================
-- SEED — 3 packs iniciales
-- ============================================================
do $$
declare
  v_pica     uuid;
  v_dulce    uuid;
  v_proteina uuid;
begin
  -- Pack Pica
  insert into combos (slug, name, description, tag, price, image_url, image_webp_url, bg_color, sort_order)
  values (
    'pack-pica',
    'Pack Pica',
    'Para la mesa de la oficina o la junta con amigos. Salado + dulce.',
    '🏢 Oficina',
    18990,
    '/img/pack-pica.jpg',
    '/img/pack-pica.webp',
    'var(--orange-soft)',
    1
  ) returning id into v_pica;

  insert into combo_items (combo_id, product_id, qty_g)
  select v_pica, id, 500 from products where slug = 'mix-europeo'        limit 1;
  insert into combo_items (combo_id, product_id, qty_g)
  select v_pica, id, 500 from products where slug = 'mani-confitado-tropical' limit 1;

  -- Pack Dulce
  insert into combos (slug, name, description, tag, price, image_url, image_webp_url, bg_color, sort_order)
  values (
    'pack-dulce',
    'Pack Dulce',
    'Para las sesiones de estudio o las tardes de Netflix con los amigos.',
    '📚 Estudio',
    18490,
    '/img/pack-dulce.jpg',
    '/img/pack-dulce.webp',
    'var(--purple-soft)',
    2
  ) returning id into v_dulce;

  insert into combo_items (combo_id, product_id, qty_g)
  select v_dulce, id, 500 from products where slug = 'chuby-bardu'        limit 1;
  insert into combo_items (combo_id, product_id, qty_g)
  select v_dulce, id, 500 from products where slug = 'gomita-osito-docile' limit 1;

  -- Pack Proteína
  insert into combos (slug, name, description, tag, price, image_url, image_webp_url, bg_color, sort_order)
  values (
    'pack-proteina',
    'Pack Proteína',
    'Snack natural para antes o después de entrenar. Energía pura.',
    '💪 Gimnasio',
    29000,
    '/img/pack-proteina.jpg',
    '/img/pack-proteina.webp',
    'var(--green-soft)',
    3
  ) returning id into v_proteina;

  insert into combo_items (combo_id, product_id, qty_g)
  select v_proteina, id, 500 from products where slug = 'mix-europeo'    limit 1;
  insert into combo_items (combo_id, product_id, qty_g)
  select v_proteina, id, 500 from products where slug = 'almendra-entera' limit 1;
end;
$$;

-- ============================================================
-- SHIPPING ZONES — agregar is_visible para expansión gradual
-- ============================================================
alter table shipping_zones
  add column if not exists is_visible boolean not null default true;

-- Ocultar todas las zonas excepto Santa Cruz
-- (la restricción de scope Santa Cruz es operacional, no técnica;
--  cuando se quiera expandir, se hace UPDATE is_visible = true)
update shipping_zones
  set is_visible = false
  where not (nombre = 'Santa Cruz centro');
