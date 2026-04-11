# STATUS-LIVE — Estación Snack

**Fecha de rebuild**: 2026-04-11  
**Estado**: Build limpio, listo para deploy

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.2.3 (App Router, Turbopack) |
| React | 19.2.4 |
| CSS | Tailwind v4 + inline styles |
| Animaciones | Framer Motion 12 |
| Estado carrito | Zustand + persist (localStorage, 7 días) |
| Datos | JSON estático (`data/`) — sin Supabase |
| Deploy | Vercel (rama `rebuild/v2`) |
| Dominio | estacionsnack.cl |

---

## Rutas producidas por el build

| Ruta | Tipo | Notas |
|------|------|-------|
| `/` | Static | Home completa con catálogo y packs |
| `/producto/[slug]` | SSG (6 páginas) | Una por producto |
| `/envios` | Static (1h cache) | Nueva — diseño sistema 2026 |
| `/faq` | Static (1h cache) | Nueva — acordeón interactivo |
| `/contacto` | Static | Nueva — WhatsApp-first |
| `/sobre-nosotros` | Static (1h cache) | Nueva — diseño sistema 2026 |
| `/opengraph-image` | Static | OG imagen de la home |
| `/robots.txt` | Static | — |
| `/sitemap.xml` | Dynamic | — |

**Rutas admin** (`/admin/*`) — presentes en el build pero no vinculadas desde el frontend público. Pueden eliminarse en Sprint 5 cleanup.

---

## Paleta de marca (tokens activos)

```
Terracota   #D0551F   — CTAs, badges, acentos
Crema Pan   #F4EADB   — Fondo principal, texto sobre oscuro
Burdeo Seco #5A1F1A   — Texto principal, sección TopVentas, DetrasDe
Verde Oliva #7A8457   — Texto secundario, ComoFunciona, TrustBar
```

---

## Tipografía

- **Display**: Fraunces (500/600/700, normal + italic) via `next/font/google`
- **Body**: Inter (400/500/600) via `next/font/google`
- Ambas self-hosted por Vercel, `display:swap`

---

## Flujo de pedido (funcional)

1. Usuario toca producto → bottom sheet con chips de cantidad
2. Selecciona cantidad (chips: 1/1.5/2/3 kg, o 0.5/1/1.5/2 kg para Chuby Bardú)
3. "Agregar al pedido" → Zustand store + toast + haptic
4. Header muestra badge con count de items
5. "Ver pedido" → OrderSheet con resumen, nota opcional
6. "Confirmar por WhatsApp" → loading 600ms → `wa.me` con mensaje pre-armado → clear cart

---

## Variables de entorno necesarias en Vercel

```
NEXT_PUBLIC_SITE_URL=https://www.estacionsnack.cl
```

Las variables de Supabase, Resend y CRON_SECRET siguen en `.env.local` pero **el frontend ya no las usa**. Pueden mantenerse o eliminarse sin afectar la tienda.

---

## Pendientes antes de producción

Ver `PENDIENTE_USUARIO.md` para la lista completa. Los únicos bloqueantes son las **fotos de productos** — sin ellas, el placeholder crema aparece en el catálogo.
