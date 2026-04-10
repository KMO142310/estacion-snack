# Estación Snack — Next.js App

Stack: Next.js 16 · React 19 · Tailwind v4 · Supabase (PostgreSQL + Auth)

## Bootstrap (primera vez)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar entorno
```bash
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase
```

### 3. Crear proyecto Supabase
1. [supabase.com](https://supabase.com) → New project → región São Paulo
2. Dashboard → SQL Editor → pegar y ejecutar `supabase/migrations/0001_init.sql`
3. Copiar Project URL, anon key y service_role key a `.env.local`

### 4. Variables de entorno
| Variable | Dónde encontrarla |
|----------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key |
| `ADMIN_EMAIL` | Tu email (para el panel /admin) |

### 5. Dev server
```bash
npm run dev
# → http://localhost:3000
```

### 6. Deploy en Vercel
```bash
npm i -g vercel
vercel --prod
# Configurar las mismas env vars en Vercel Dashboard → Settings → Environment Variables
```

---

## Estructura
```
app/
├── page.tsx              # Home (ISR 60s)
├── layout.tsx            # Fuentes + metadata global
└── admin/
    ├── layout.tsx        # Protegido con Supabase Auth
    ├── login/page.tsx    # Magic link
    ├── productos/        # Editar stock (funcional)
    ├── pedidos/          # Ver pedidos (read-only)
    └── clientes/         # Ver clientes (read-only)

components/               # Header, Hero, ProductCard, Drawer, etc.
lib/
├── actions.ts            # Server Actions (getProducts, reserveStock, placeOrder)
├── cart-context.tsx      # Cart state (client)
├── products.ts           # Seed estático (fallback)
├── types.ts              # TypeScript types
└── supabase/
    ├── client.ts         # Browser client
    └── server.ts         # SSR client

supabase/migrations/
└── 0001_init.sql         # Schema + funciones + seed
docs/
├── ARCHITECTURE.md       # Diagrama del stack
├── RUNBOOK.md            # Operaciones del día a día
└── ADR/0001-nextjs-supabase.md
```

## Notas importantes
- El sitio HTML actual (`../estacion-snack/`) sigue funcionando hasta el cutover
- Sin Supabase configurado, la tienda funciona con productos estáticos (sin stock en vivo)
- Ver `docs/RUNBOOK.md` para operaciones del día a día
