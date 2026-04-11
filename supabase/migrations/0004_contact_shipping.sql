-- ============================================================
-- Estación Snack — Migración 0004
-- contact_messages + shipping_zones
-- ============================================================

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
create table contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  message     text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Solo el service role puede leer/insertar
alter table contact_messages enable row level security;

-- El formulario público inserta via server action (service role) — sin anon access
-- No se necesita policy de anon; el server action usa SUPABASE_SERVICE_ROLE_KEY

-- ============================================================
-- SHIPPING ZONES
-- Tarifas planas por zona para la Región de O'Higgins.
-- El campo `comunas` es un array de nombres exactos que deben
-- matchear con los nombres del selector en el checkout.
-- ============================================================
create table shipping_zones (
  id             uuid primary key default gen_random_uuid(),
  nombre         text not null,
  comunas        text[] not null,
  price          int not null,          -- CLP
  estimated_days text not null,
  carrier        text not null default 'propio',
  is_active      boolean not null default true,
  sort_order     int not null default 99
);

-- Lectura pública para que el checkout pueda calcular el envío
alter table shipping_zones enable row level security;

create policy "shipping_zones_public_read"
  on shipping_zones for select
  using (is_active = true);

-- ============================================================
-- SEED — Zonas de la Región de O'Higgins
-- (Precios placeholder — el operador los ajusta desde admin o SQL)
-- ============================================================
insert into shipping_zones (nombre, comunas, price, estimated_days, sort_order) values
(
  'Santa Cruz centro',
  ARRAY['Santa Cruz'],
  0,
  'Mismo día (martes o viernes)',
  1
),
(
  'Comunas vecinas inmediatas',
  ARRAY['Palmilla', 'Peralillo', 'Nancagua', 'Chépica', 'Lolol'],
  2500,
  '1–2 días hábiles',
  2
),
(
  'Resto de O''Higgins',
  ARRAY[
    'San Fernando', 'Chimbarongo', 'Placilla', 'Pumanque', 'Marchigüe',
    'Pichilemu', 'Rancagua', 'Peumo', 'Pichidegua', 'Las Cabras',
    'Malloa', 'Rengo', 'Requínoa', 'Quinta de Tilcoco', 'San Vicente',
    'Mostazal', 'Graneros', 'Codegua', 'Machalí', 'Olivar', 'Doñihue',
    'Coinco', 'Coltauco', 'Litueche', 'La Estrella', 'Paredones',
    'Marchigüe'
  ],
  3500,
  '2–3 días hábiles',
  3
);

-- ============================================================
-- ENV VAR recordatorio
-- RESEND_API_KEY debe estar seteado en Vercel para notificaciones
-- de contacto. Ver .env.local.example.
-- ============================================================
