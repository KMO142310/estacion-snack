# Estación Snack

[![CI](https://github.com/omarnewton/estacion-snack/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/omarnewton/estacion-snack/actions/workflows/ci.yml)
[![Deploy](https://img.shields.io/badge/vercel-production-000?logo=vercel)](https://estacionsnack.cl)

Tienda online por kilo de frutos secos y dulces. Operada por una sola persona desde Santa Cruz, Valle de Colchagua. **El pedido se cierra por WhatsApp**; pago al recibir o transferencia.

**Producción:** [estacionsnack.cl](https://estacionsnack.cl)

---

## Sobre este proyecto

Catálogo estático + carrito + pasarela WhatsApp. Sin base de datos, sin backend de pedidos, sin login. Diseñado para que un operador unipersonal reciba pedidos por WhatsApp sin fricción, y el cliente nuevo no tenga que crear cuenta ni dar tarjeta para hacer una primera compra.

Construido por Omar (no desarrollador de formación) con Claude como asistente técnico. El protocolo de trabajo está en [`CLAUDE.md`](./CLAUDE.md).

---

## Arquitectura de un vistazo

```
Cliente (browser)
  └─ Catálogo Next.js estático (SSG)
       └─ Carrito Zustand + localStorage (TTL 1h)
            └─ "Pasar a WhatsApp" → wa.me con mensaje pre-armado
                 └─ Cliente envía mensaje, operador responde
                 └─ Banner persistente con ref del pedido como red de seguridad
```

Sin servidor de pedidos. Sin DB. Sin auth. El sistema completo de gestión es la conversación de WhatsApp del operador.

---

## Stack

| Capa | Tecnología | Rol |
|---|---|---|
| Framework | Next.js 16 + React 19 | App Router, SSG |
| Estilos | Tailwind 4 + tokens OKLCH | Sistema visual modular |
| Tipos | TypeScript 5 strict | Safety |
| Estado | Zustand 5 + persist | Carrito en localStorage |
| Animación | Framer Motion 12 | Microinteracciones spring |
| Hosting | Vercel | Deploy automático en push a `main` |
| Tests | Vitest + Playwright | Unit + E2E |

---

## Decisiones no obvias

- **Sin DB en runtime.** `data/products.json` y `data/packs.json` son la fuente de verdad. Build-time. Cero costos cloud, cero llamadas de red, cero latencia.
- **Sin checkout online.** WhatsApp como pasarela. Coherente con el negocio: 1 persona atendiendo, primeros clientes, sin RUT comercial. Reduce fricción del cliente nuevo.
- **`generateOrderRef()` local.** 8 chars hex desde `crypto.getRandomValues`. Sin servidor para generar IDs.
- **Confirmación post-checkout persistente.** Banner Zustand `lastOrder` sobrevive 30 min. Si el popup de WhatsApp falla, el cliente tiene un botón "Reabrir WhatsApp" + ref copiable.
- **Design tokens científicos.** Type scale modular ratio 1.200, paleta OKLCH perceptual, grid 8pt, motion tokens (Material Motion). Ver `app/globals.css`.

---

## Correr en local

```bash
npm install
cp .env.local.example .env.local   # opcional, solo para analytics
npm run dev                         # → http://localhost:3000
```

Scripts:

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint 9
npm run test         # Vitest unit
npm run test:e2e     # Playwright (instala con test:e2e:install)
npm run verify       # lint + typecheck + test + build
npm run build        # build prod
```

### Variables de entorno (todas opcionales)

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canónica para sitemap/OG |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 (carga solo con consent) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel (carga solo con consent) |

---

## Estructura del repo

```
estacion-snack/
├── app/                # Next.js App Router (todas estáticas)
├── components/         # UI (Hero, Cards, OrderSheet, OrderConfirmation)
├── lib/                # store, shipping, whatsapp, pack-utils, products
├── data/               # products.json + packs.json (fuente única)
├── public/img/         # Fotos JPG + WebP + WebP-400 mobile
├── tests/              # Vitest unit + Playwright E2E
└── .github/workflows/  # CI
```

---

## Deploy

Push a `main` = deploy automático en Vercel. Preview deployments por branch.

**Política:** commits directos a `main` prohibidos. Todo cambio pasa por branch + PR + `verify` verde.

---

## Licencia

Proyecto personal. Código público como referencia; sin permiso de uso comercial.
