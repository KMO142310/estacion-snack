-- ============================================================
-- Estación Snack — Detalle de producto y columna is_active
-- Migración: 0003_product_details.sql
--
-- Agrega:
--   products.long_description  — descripción larga (Markdown/texto)
--   products.nutrition         — info nutricional placeholder (jsonb)
--   products.is_active         — toggle visible/oculto en catálogo
--
-- Idempotente: usa ADD COLUMN IF NOT EXISTS.
-- ============================================================

alter table products
  add column if not exists long_description text,
  add column if not exists nutrition        jsonb,
  add column if not exists is_active        boolean not null default true;

create index if not exists idx_products_is_active on products(is_active);

comment on column products.long_description is
  'Descripción extendida del producto. Texto plano o Markdown.';

comment on column products.nutrition is
  'Tabla nutricional por 100g. Estructura ejemplo:
   {"energia_kcal":580,"proteinas_g":21,"grasas_g":49,"carbohidratos_g":20,"fibra_g":7}';

comment on column products.is_active is
  'Cuando false, el producto no aparece en el catálogo público.
   La lectura pública (products_public_read RLS) debe filtrar por is_active=true.';

-- Actualizar la policy pública para respetar is_active
-- (la política anterior usaba USING (true) — la reemplazamos)
drop policy if exists products_public_read on products;
create policy products_public_read on products
  for select
  to anon, authenticated
  using (is_active = true);

comment on policy products_public_read on products is
  'Solo productos activos son visibles públicamente. El admin los ve
   todos a través de service_role (bypass RLS).';

-- Actualizar los 6 productos del seed con long_description y nutrition placeholder
update products set
  long_description = 'Una mezcla premium de frutos secos europeos sin sal agregada. Contiene maní tostado, almendras naturales, nueces de castilla y avellanas. Ideal para snackear, ensaladas o como acompañamiento. Vendido a granel por kilo, siempre fresco.',
  nutrition = '{"energia_kcal":620,"proteinas_g":20,"grasas_g":52,"carbohidratos_g":18,"fibra_g":7,"sodio_mg":5}'::jsonb
where slug = 'mix-europeo';

update products set
  long_description = 'Maní cubierto con una capa crujiente de azúcar en colores tropical: amarillo, verde, naranja y rojo. Dulce, colorido y adictivo. El favorito de los chicos y los no tan chicos. Perfecto para picar a cualquier hora.',
  nutrition = '{"energia_kcal":480,"proteinas_g":12,"grasas_g":18,"carbohidratos_g":65,"fibra_g":3,"sodio_mg":80}'::jsonb
where slug = 'mani-confitado-tropical';

update products set
  long_description = 'El confitado chileno clásico. Maní tostado envuelto en una cubierta roja crujiente. Simple, intenso, imposible comer uno solo. Se vende fresco por kilo, sin conservantes.',
  nutrition = '{"energia_kcal":475,"proteinas_g":12,"grasas_g":18,"carbohidratos_g":63,"fibra_g":3,"sodio_mg":85}'::jsonb
where slug = 'mani-confitado-rojo';

update products set
  long_description = 'Confites de chocolate recubiertos de una capa de azúcar de colores. El clásico bowl que siempre está vacío antes de que alguien se dé cuenta. Ideal para fiestas, reuniones y cualquier excusa.',
  nutrition = '{"energia_kcal":510,"proteinas_g":6,"grasas_g":22,"carbohidratos_g":72,"fibra_g":2,"sodio_mg":60}'::jsonb
where slug = 'chuby-bardu';

update products set
  long_description = 'Ositos de goma clásicos en todos los colores y sabores: frutilla, naranja, limón, piña y frambuesa. Blanditos, coloridos y difíciles de compartir. El snack que recuerda a la infancia.',
  nutrition = '{"energia_kcal":330,"proteinas_g":6,"grasas_g":0,"carbohidratos_g":78,"fibra_g":0,"sodio_mg":15}'::jsonb
where slug = 'gomita-osito-docile';

update products set
  long_description = 'Almendra entera natural con piel, sin sal ni procesado adicional. Alta en grasas saludables, proteínas y vitamina E. Producto premium de primera calidad. Stock limitado — última unidad disponible.',
  nutrition = '{"energia_kcal":580,"proteinas_g":21,"grasas_g":50,"carbohidratos_g":10,"fibra_g":12,"sodio_mg":1}'::jsonb
where slug = 'almendra-entera';
