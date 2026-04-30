@AGENTS.md

# Estación Snack — Protocolo de trabajo

Catálogo estático + carrito + pasarela WhatsApp. Sin DB, sin auth, sin backend de pedidos. Operador único en Santa Cruz, Valle de Colchagua. Cada bug en prod le cuesta confianza de un cliente nuevo.

---

## 1. Stack

- Next.js 16 + React 19 + Tailwind 4 + TypeScript 5 strict.
- Zustand 5 + persist (localStorage `es_cart_v4`, items expiran 1h, lastOrder 30 min).
- Framer Motion 12 para microinteracciones spring.
- Vercel para hosting. Dominio prod: `estacionsnack.cl`. Push a `main` = deploy.

---

## 2. Arquitectura

```
data/products.json + data/packs.json   ← fuente única de verdad
        ↓ (build time)
Next.js SSG                             ← todas las rutas estáticas
        ↓
Cliente (Zustand cart + localStorage)
        ↓ "Pasar a WhatsApp"
buildWaUrl() construye mensaje + ref local
        ↓
wa.me en popup nuevo
        ↓
OrderConfirmation banner (ref copiable + reabrir wa.me)
```

Pedidos viven en la conversación de WhatsApp del operador. No hay servidor de pedidos.

---

## 3. Archivos críticos

| Archivo | Rol |
|---|---|
| `data/products.json` | Catálogo. Precios reales del marketplace. |
| `data/packs.json` | Packs con BOM (referencia product IDs). |
| `lib/store.ts` | Zustand cart + lastOrder. Persist v4. |
| `lib/products.ts` | `getProducts()` / `getProductBySlug()` puras desde JSON. |
| `lib/shipping.ts` | Comunas + costos marketplace + FREE_SHIPPING_MIN. |
| `lib/whatsapp.ts` | `buildWaUrl()` con BOM, totales, ref. |
| `lib/pack-utils.ts` | Disponibilidad de packs según stock de componentes. |
| `components/OrderSheet.tsx` | Carrito + checkout. |
| `components/OrderConfirmation.tsx` | Red de seguridad post-WhatsApp. |
| `app/globals.css` | Design tokens (OKLCH + 8pt + type scale 1.200 + motion). |

Si tocás cualquiera de los tres primeros: leé los seis siguientes antes de cambiar nada.

---

## 4. Modo de trabajo

**Plan-Execute-Verify, siempre.** Tareas que tocan más de un archivo o efecto irreversible empiezan con plan explícito (supuestos, pasos numerados, riesgos por paso, checkpoints).

**Checkpoints obligatorios** antes de:

- Cualquier `git commit`, `git push`, `git reset --hard`, `git rebase`, `git merge`.
- Cambiar variables de entorno o `.env*`.
- Borrar archivos fuera del scope explícito.
- Publicar a prod (push a `main`).

**No** necesitás OK para:

- Lecturas (`cat`, `grep`, `ls`, `git status`, `git log`, `git diff`).
- `tsc --noEmit`, `eslint`, `vitest`, `playwright`, `next build`.
- Editar archivos que sí son scope de la tarea actual.

**Subagentes** (en `.claude/agents/`):

- `planner` — antes de tarea con >1 archivo.
- `reviewer` — antes de cada `git commit`.
- `researcher` — antes de decisión técnica/legal/UX no trivial.

---

## 5. Git y deploy

- Branches: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`. Nunca commit directo a `main`.
- Commits atómicos. Mensaje en imperativo corto.
- Antes de commit: `git status` + `git diff --cached` + `npm run verify` + grep de secretos.
- **Push a `main` solo con OK explícito del usuario.**
- Push a `main` = deploy automático a `estacionsnack.cl`.

---

## 6. Diseño y a11y

- Design tokens en `app/globals.css`: `--fs-*` (type scale fluid), `--space-*` (8pt), `--color-*` OKLCH, `--ease-*` motion.
- Touch targets ≥ 44×44 px en mobile.
- Foco visible (`*:focus-visible` con `--accent`).
- `prefers-reduced-motion` honrado en globals.
- Lighthouse target: Perf ≥ 95, A11y ≥ 95, BP 100, SEO 100.

---

## 7. Formato de respuestas

- Español neutro (sin voseo argentino).
- Concisión. Sin preámbulos. Sin resúmenes redundantes después del diff.
- Evidencia antes de claim ("funciona" no vale sin output).
- Listas solo con >3 items.
- Checkpoints son una línea: `→ Esperando OK para: <acción>`.

---

## 8. Anti-patrones prohibidos

- Empezar a ejecutar sin plan cuando hay >1 archivo o efecto irreversible.
- Hacer preguntas cuya respuesta está en `ls`/`grep`.
- Commits mezclando scopes ("fix mobile + add feature + refactor").
- `--force`, `--no-verify`, `git add -A` sin ver el diff primero.
- Decir "listo" sin evidencia.
- Reintroducir DB/auth/admin/agente sin plan explícito y aprobación.

---

## 9. Arranque de cada sesión

```bash
git status
git log -5 --oneline
git branch --show-current
```

Si hay cambios uncommitted que no reconocés: pará y preguntá antes de tocar nada.
