# Workflows — Estación Snack

Este doc mapea los **5 flujos críticos** que se repiten en el desarrollo del sitio. Para cada uno, indica qué agente / skill usar en cada paso. La idea: nunca improvisar lo que ya está documentado.

Si vas a hacer algo que NO está acá pero se repite >2 veces, agrégalo como nuevo workflow.

---

## Flujo 1 — Cambio de precio de un producto

**Trigger típico**: "subió la almendra a $14.000".

| Paso | Agente / skill | Acción |
|------|----------------|--------|
| 1 | `catalog-curator` | Edita `data/products.json` → campo `price` del slug correspondiente |
| 2 | `/precio` skill | Verifica si algún pack contiene ese producto y queda con ahorro irreal |
| 3 | `catalog-curator` | Si pack afectado, recalcula `pricePerKg` del item + sugiere nuevo `price` del pack |
| 4 | `/stock` skill | Verifica que no haya drift entre repo y DB de Supabase (price diff es serio) |
| 5 | (auto) | `lib/agent/system-prompt.ts:CATALOG_SUMMARY` se autoregenera al import — sin edit manual |
| 6 | Tests | `npm test` (revisar `tests/lib/integration-cart-flow.test.ts` con assertions hardcodeadas) |
| 7 | `reviewer` agent | Lee diff, busca secretos / regresiones |
| 8 | Commit + push + merge | Vercel auto-deploya. Esperar 1-2 min |
| 9 | `/smoke` skill | Verifica /api/health en prod con commit nuevo |

**Tiempo total estimado**: 15 min.

---

## Flujo 2 — Nuevo producto

**Trigger típico**: "agregamos pistacho 1 kg, $11.000".

| Paso | Agente / skill | Acción |
|------|----------------|--------|
| 1 | `catalog-curator` | Pide al usuario: name, slug, price, stock_kg, formato, foto |
| 2 | `marketer` | Genera one-liner, descripción larga, meta tags |
| 3 | (humano) | Subir foto a `public/img/<slug>.webp` + `<slug>-400.webp` mobile |
| 4 | `catalog-curator` | Agrega entry a `data/products.json` con shape exacto de los existentes |
| 5 | `designer` | Verifica que la card visual nueva no rompe la simetría del grid |
| 6 | `catalog-curator` | Considera si entra a algún pack existente |
| 7 | Tests | `npm test` + `npm run build` (verificar `generateStaticParams` lo incluye) |
| 8 | `reviewer` | Pre-commit |
| 9 | Commit + push + merge | Deploy |
| 10 | `/smoke` | Verifica `/producto/<slug>` carga 200 |

**Tiempo total estimado**: 30-45 min (depende de la foto).

---

## Flujo 3 — Bug en producción

**Trigger típico**: "no se agregan productos al carro" / "el agente no responde" / "no llega el WhatsApp".

| Paso | Agente / skill | Acción |
|------|----------------|--------|
| 1 | `/smoke` | Confirma síntomas. ¿Falla /api/health? ¿/api/agent/chat? ¿la home? |
| 2 | (humano) | Reproduce en `localhost:3000` con `npm run dev` |
| 3 | `auditor` | Si reproduce, audita el área afectada (auth gate? CSP? env var? RLS?) |
| 4 | `planner` | Plan de fix con rollback claro |
| 5 | (humano + agente principal) | Aplica fix en branch `fix/<scope>` |
| 6 | Tests E2E | `npm run test:e2e` para cazar el bug en CI futuro |
| 7 | `reviewer` | Pre-commit |
| 8 | PR + CI verde + merge | Deploy |
| 9 | `/smoke` | Verifica fix en prod |
| 10 | (humano) | Confirma con el cliente que reportó |

**Si el bug es CRITICAL** (cliente no puede comprar / data leak): seguir mismo flujo pero deploy a prod en <30 min.

---

## Flujo 4 — Feature nueva

**Trigger típico**: "quiero un widget de testimonios en la home".

| Paso | Agente / skill | Acción |
|------|----------------|--------|
| 1 | `researcher` | Investiga patrones (cómo lo hacen Graza / Aesop / sitios ref) |
| 2 | `planner` | Plan multi-archivo con bloques + checkpoints |
| 3 | `designer` | Diseña tokens (espaciado, tipografía, layout responsive) |
| 4 | `marketer` | Copy del widget si tiene texto (CTA, headlines, label) |
| 5 | (agente principal) | Implementa según plan |
| 6 | Tests | Unit (Vitest) para lógica + E2E (Playwright) para UI critical path |
| 7 | `auditor` | Audit del nuevo componente (a11y, perf, SEO) |
| 8 | `reviewer` | Pre-commit |
| 9 | PR + CI verde + merge | Deploy |
| 10 | `/smoke` + manual | Verifica en prod, screenshot si aplica |

**Tiempo estimado**: 1-3 días según scope.

---

## Flujo 5 — Iterar el agente conversacional

**Trigger típico**: "el agente respondió mal a un cliente" / "queremos que también sepa hacer X".

| Paso | Agente / skill | Acción |
|------|----------------|--------|
| 1 | (humano) | Captura el caso reproducible: input exacto + respuesta del bot + qué se esperaba |
| 2 | `prompt-eng` | Diagnostica: ¿falta regla en system prompt? ¿tool no existe? ¿prompt débil? |
| 3 | `prompt-eng` | Propone diff a `lib/agent/system-prompt.ts` + caso de eval |
| 4 | (agente principal) | Aplica diff + agrega eval a `prompts/agent-eval.md` |
| 5 | `op-coach` | Simula 20 prompts representativos contra el prompt actualizado (dry run) |
| 6 | `/agent-eval` skill | Si tienes `ANTHROPIC_API_KEY` local, corre evals reales (~$0.10) |
| 7 | Si tools nuevos: editar `lib/agent/tools.ts` + `executors.ts` con auth/confirm gates |
| 8 | Tests | `tests/lib/agent/auth-gate.test.ts` + `tools.test.ts` cubren contratos |
| 9 | `reviewer` | Pre-commit (cuidado con secretos del agente: ANTHROPIC_API_KEY, UPSTASH_*) |
| 10 | PR + CI + merge | Deploy. El system prompt se cachea con prompt caching ephemeral. |

**Tiempo estimado**: 1-2 horas para cambios de prompt, 1 día para tools nuevos.

---

## Cuándo NO seguir un workflow

Si el cambio es trivial (1 archivo, 5 líneas, reversible, sin efecto en prod), NO sigas el workflow completo. Edita, testea, commitea, pushea. Los workflows son para cambios que tocan más de un archivo o que afectan lo que el cliente final ve.

---

## Equipo de agentes (resumen rápido)

| Agente | Cuándo usarlo |
|--------|---------------|
| `auditor` | Dictamen completo del estado (full site, página, flujo) |
| `catalog-curator` | Tocas `data/products.json`, `data/packs.json`, `lib/shipping.ts` |
| `designer` | Cambios visibles en UI: jerarquía, tipografía, color, layout |
| `marketer` | Copy visible al cliente: hero, productos, WhatsApp, meta tags |
| `op-coach` | Validar UX del agente conversacional antes de mergear |
| `planner` | Plan multi-archivo con riesgos + checkpoints + rollback |
| `prompt-eng` | Iterar `lib/agent/system-prompt.ts` con evals |
| `researcher` | Decisión técnica/producto no trivial → traer benchmarks |
| `reviewer` | Pre-commit siempre |

## Skills (slash commands)

| Skill | Para qué |
|-------|----------|
| `/smoke` | Verificar prod post-deploy en <30s |
| `/precio` | Recalcular pack desde componentes |
| `/pedido` | Ver shape de un order_id en Supabase (local) |
| `/stock` | Snapshot drift entre `data/products.json` y DB |
| `/agent-eval` | Correr suite de evals del agente conversacional |
