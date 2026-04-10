# Arquitectura — Estación Snack

## Stack

```
┌─────────────────────────────────────────────────┐
│                  CLIENTE (Browser)               │
│  React 19 · CartProvider (localStorage/session) │
│  Server Actions → reserveStock / placeOrder     │
└─────────────┬───────────────────────────────────┘
              │ HTTPS
┌─────────────▼───────────────────────────────────┐
│              VERCEL (Next.js 16 App Router)      │
│                                                  │
│  app/                                            │
│  ├── page.tsx          ← ISR (revalidate 60s)   │
│  │   └── getProducts() → Supabase               │
│  ├── admin/            ← SSR, auth-gated        │
│  │   ├── productos/    ← inline stock edit      │
│  │   ├── pedidos/      ← read-only list         │
│  │   └── clientes/     ← read-only list         │
│  └── admin/logout/     ← Route Handler          │
│                                                  │
│  lib/                                            │
│  ├── actions.ts        ← Server Actions          │
│  ├── cart-context.tsx  ← Client state            │
│  ├── supabase/server   ← SSR client (@supabase/ssr)│
│  └── supabase/client   ← Browser client          │
└─────────────┬───────────────────────────────────┘
              │ Supabase JS + RLS
┌─────────────▼───────────────────────────────────┐
│              SUPABASE (PostgreSQL)               │
│                                                  │
│  tables:                                         │
│  ├── products          ← catálogo + stock_kg    │
│  ├── customers         ← phone unique           │
│  ├── orders            ← status lifecycle       │
│  ├── order_items       ← snapshot de precios    │
│  └── stock_reservations← TTL 15 min             │
│                                                  │
│  functions:                                      │
│  ├── fn_reserve_stock  ← SELECT FOR UPDATE      │
│  ├── fn_place_order    ← transacción completa   │
│  └── fn_release_expired_reservations            │
│                                                  │
│  auth:                                           │
│  └── magic link email (admin only)              │
└─────────────────────────────────────────────────┘
```

## Flujo de un pedido

```
1. Cliente agrega producto al carrito
   → addItem() → reserveStock(sessionId, productId, qty)
   → fn_reserve_stock() — SELECT FOR UPDATE, inserta en stock_reservations
   → Countdown 15 min visible en el drawer

2. Cliente completa formulario (nombre, teléfono) y toca "Enviar por WhatsApp"
   → placeOrder(sessionId, items, customer)
   → fn_place_order() — transacción:
      a. limpia reservas expiradas
      b. valida stock disponible (excluye reservas de otros)
      c. descuenta stock en products
      d. crea order + order_items
      e. upsert customer
      f. libera reservas de esta sesión
   → devuelve order_id
   → genera URL wa.me con mensaje pre-armado
   → redirige a WhatsApp

3. Admin ve el pedido en /admin/pedidos (status: pending_whatsapp)
4. Admin confirma por WhatsApp y cambia status a confirmed (Fase 2: botón en UI)
```

## Decisiones de diseño

| Decisión | Razón |
|----------|-------|
| Cart en localStorage + sessionId | Sin autenticación de cliente; simple y funcional |
| Reservas con TTL 15 min | Evita deadlocks sin bloqueo permanente de stock |
| fn_place_order como stored procedure | Garantiza atomicidad; no hay race condition entre el descuento y la creación del pedido |
| ISR 60s en la home | Stock cambia raramente; no necesita streaming en tiempo real para el catálogo |
| Fallback a PRODUCTS estáticos | La tienda funciona aunque Supabase no esté configurado |
| RLS + service role para admin | Lectura pública de productos; resto cerrado |
