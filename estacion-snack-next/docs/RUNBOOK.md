# Runbook de Operaciones — Estación Snack

## Bootstrap inicial (hacer una sola vez)

### 1. Crear proyecto Supabase

1. Ir a [supabase.com](https://supabase.com) → "New project"
2. Región: **South America (São Paulo)** para menor latencia desde Chile
3. Guardar la contraseña de la base de datos en un lugar seguro

### 2. Correr las migraciones

En la consola SQL de Supabase (Dashboard → SQL Editor):

```sql
-- Copiar y ejecutar el contenido de:
supabase/migrations/0001_init.sql
```

O con Supabase CLI:
```bash
supabase login
supabase link --project-ref <tu-project-ref>
supabase db push
```

### 3. Configurar variables de entorno

En Vercel: **Settings → Environment Variables**

| Variable | Dónde encontrarla |
|----------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → service_role key |
| `ADMIN_EMAIL` | Tu email (el que usarás para entrar al panel) |

También crear `.env.local` local copiando desde `.env.local.example`.

### 4. Deploy

```bash
vercel --prod
```

O push a `main` si está conectado a Vercel via Git.

---

## Operaciones del día a día

### Actualizar stock de un producto

1. Ir a `tu-dominio.com/admin/productos`
2. Hacer clic en el número de stock del producto
3. Escribir el nuevo valor y presionar Enter o "Guardar"

### Ver pedidos nuevos

1. Ir a `tu-dominio.com/admin/pedidos`
2. Los pedidos en estado **"Pendiente WA"** son los que llegaron por WhatsApp pero aún no se confirmaron
3. (Fase 2) Botón para cambiar estado a Confirmado / Entregado

### Agregar un producto nuevo

Por ahora: SQL Editor en Supabase:
```sql
INSERT INTO products (slug, name, category, price, unit, stock_kg, low_threshold, copy, badge, color, sort_order)
VALUES (
  'nuevo-producto',    -- slug único, sin espacios
  'Nombre del Producto',
  'frutos',           -- o 'dulces'
  9990,               -- precio en CLP por kg
  'kg',
  3,                  -- stock inicial
  1,                  -- umbral "pocas"
  'Descripción del producto.',
  null,               -- o 'Popular', 'Nuevo', etc.
  'orange',           -- orange/green/red/purple/yellow/sand
  7                   -- orden en el catálogo
);
```

(Fase 2: formulario en el panel de admin)

### Gestionar imágenes

1. Supabase Dashboard → Storage → Crear bucket `product-images` (public)
2. Subir imagen
3. Copiar URL pública
4. Actualizar `image_url`, `image_webp_url`, `image_400_url` en la tabla `products`

---

## Troubleshooting

### La tienda muestra productos estáticos (no los de la DB)

- Verificar que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén configurados en Vercel
- Verificar que la migración se ejecutó correctamente (hay datos en la tabla `products`)
- La tienda hace fallback a datos estáticos si Supabase no responde — funciona, pero el stock no es en tiempo real

### El panel de admin muestra "Sin autenticación"

- Verificar que `ADMIN_EMAIL` coincide con el email que usaste en el magic link
- Verificar `SUPABASE_SERVICE_ROLE_KEY` en las variables de entorno

### El proyecto Supabase está pausado

- Ocurre en el plan gratuito si no hay actividad en >1 semana
- Solución: entrar al Dashboard de Supabase y hacer clic en "Resume"
- Para evitarlo: configurar un cron que haga un ping a la DB cada pocos días (Fase 3)

### Error "Stock insuficiente" al pedir

- El producto tiene stock real menor al pedido
- Actualizar el stock en `/admin/productos` o responder al cliente por WhatsApp

---

## Despacho martes y viernes

1. Revisar `/admin/pedidos` — filtrar por `pending_whatsapp` y `confirmed`
2. Preparar los pedidos
3. Cambiar estado a `preparing` → `delivered` (Fase 2: desde el panel)
4. Actualizar stock si hubo diferencias

---

## Backups

Supabase hace backup automático diario en todos los planes. Para exportar manualmente:
```bash
supabase db dump -f backup-$(date +%Y%m%d).sql
```
