# Estación Snack

Tienda online de frutos secos y dulces a granel, Santa Cruz, Chile.
Pedidos vía WhatsApp. Despacho martes y viernes.

**Prod**: [estacionsnack.cl](https://estacionsnack.cl)  
**Stack**: Next.js 16 · React 19 · Tailwind v4 · TypeScript 5 · Supabase (Postgres 16) · Vercel

---

## Correr en local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con las claves reales (ver sección Env vars)

# 3. Arrancar el servidor de desarrollo
npm run dev
# → http://localhost:3000
```

Typecheck:
```bash
npm run typecheck
```

Build de producción local:
```bash
npm run build && npm start
```

---

## Estructura

```
estacion-snack/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout: fuentes, metadata, analytics
│   ├── page.tsx                # Home (ISR 60s): carga productos desde Supabase
│   ├── globals.css             # Design tokens y estilos globales
│   ├── robots.ts               # robots.txt generado (bloquea /admin y /api/)
│   ├── sitemap.ts              # sitemap.xml con URLs de productos
│   ├── producto/[slug]/        # Página de detalle de producto
│   ├── pedido/[id]/            # Confirmación de pedido (autenticado por token)
│   └── admin/                  # Panel admin (gated por email en Supabase Auth)
│       ├── login/              # Magic link login
│       ├── logout/             # Route handler de logout
│       └── (gated)/            # Rutas protegidas por assertAdmin()
│           ├── productos/      # CRUD de productos + gestión de stock
│           ├── pedidos/        # Lista de pedidos con filtros
│           └── clientes/       # Vista de clientes
├── components/                 # Componentes React (ver docs/COMPONENTS.md)
├── lib/
│   ├── actions.ts              # Server actions públicas (getProducts, placeOrder…)
│   ├── admin-actions.ts        # Server actions admin (updateStock, upsertProduct…)
│   ├── cart-context.tsx        # Contexto de carrito (localStorage + sessionStorage)
│   ├── products.ts             # Seed estático de fallback + helpers (fmt, WA)
│   ├── types.ts                # Tipos TypeScript: Product, Order, OrderItem…
│   ├── analytics.ts            # Wrappers GA4 + Meta Pixel
│   ├── crypto.ts               # Comparación en tiempo constante de access tokens
│   ├── auth/assert-admin.ts    # Guard de autenticación admin
│   └── supabase/
│       ├── client.ts           # Cliente browser (anon key)
│       ├── server.ts           # Cliente SSR (cookie-based)
│       └── admin.ts            # Cliente service role (solo server-side)
├── supabase/
│   ├── migrations/             # SQL versionado — nunca editar uno ya aplicado
│   │   ├── 0001_init.sql       # Schema inicial: products, customers, orders, reservations
│   │   ├── 0002_rls_hardening.sql  # RLS policies + access_token en orders
│   │   └── 0003_product_details.sql  # long_description, nutrition, is_active
│   └── seed.sql                # Datos de dev (no ejecutar en prod)
├── docs/                       # Documentación operativa
│   ├── ARCHITECTURE.md         # Decisiones de arquitectura (ADRs)
│   ├── COMPONENTS.md           # Catálogo de componentes
│   ├── CUTOVER.md              # Guía de migración de dominio
│   ├── LATERAL_FINDINGS.md     # Bugs encontrados fuera de scope
│   └── RUNBOOK.md              # Runbook operativo
├── public/                     # Assets estáticos (imágenes, favicon)
├── .env.local.example          # Template de variables de entorno
├── vercel.json                 # Config de Vercel (cron jobs)
└── CLAUDE.md                   # Protocolo de trabajo para Claude Code
```

---

## Variables de entorno

Copiar `.env.local.example` a `.env.local` y completar:

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | Sí |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key pública de Supabase | Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (solo servidor) | Sí |
| `ADMIN_EMAIL` | Email que puede acceder a `/admin` | Sí |
| `NEXT_PUBLIC_SITE_URL` | URL canónica (`https://estacionsnack.cl`) | Sí en prod |
| `CRON_SECRET` | Bearer token para `/api/cron/release-reservations` | Sí en prod |
| `AUDIT_PEPPER` | Secret para hashear IPs en audit_log | Sí en prod |
| `NEXT_PUBLIC_GA4_ID` | ID de medición GA4 (`G-XXXXXXXXXX`) | No |
| `NEXT_PUBLIC_META_PIXEL_ID` | ID del píxel de Meta | No |

En Vercel, configurar las mismas variables en Settings → Environment Variables.

---

## Migraciones

Las migraciones SQL son manuales: ejecutar en el SQL Editor de Supabase, en orden.

```
supabase/migrations/0001_init.sql           # Schema base — solo si es proyecto nuevo
supabase/migrations/0002_rls_hardening.sql  # RLS + access_token
supabase/migrations/0003_product_details.sql # long_description, nutrition, is_active
```

Nunca editar una migración ya aplicada. Crear un archivo nuevo con el número siguiente.

---

## Deploy

El proyecto se despliega en Vercel con deploy automático desde `main`.

Un push a `main` es un deploy a producción.

Para migrar el dominio a `estacionsnack.cl`: ver `docs/CUTOVER.md`.

---

## Flujo de pedido

1. El cliente agrega productos al carrito (estado en `localStorage`).
2. Al hacer checkout, `placeOrder` llama al RPC `fn_place_order` en Supabase.
3. El RPC crea el pedido atómicamente: descuenta stock, crea el cliente si es nuevo, genera un `access_token`.
4. El servidor construye el link de WhatsApp con el detalle del pedido y la URL de `/pedido/[id]?t=<token>`.
5. El cliente abre WhatsApp. El operador confirma el pedido desde `/admin/pedidos`.
6. El cliente puede ver el estado en `/pedido/[id]?t=<token>` (autenticado solo por token, sin cuenta).

El cron `*/5 * * * *` libera reservas de stock expiradas (TTL 15 min) vía `/api/cron/release-reservations`.

---

## Contribuir

Ver [CONTRIBUTING.md](./CONTRIBUTING.md).
