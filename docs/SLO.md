# SLO · Estación Snack

**Versión:** 1.0 · **Fecha:** 2026-04-24

Objetivos de servicio explícitos para un negocio pequeño operado por una persona. Este documento existe para hacer las expectativas operativas cuantificables, no para pretender rigor tipo Google SRE.

---

## 1 · Definiciones

**SLI** = Service Level Indicator (métrica observable).
**SLO** = Service Level Objective (target sobre el SLI).
**Error budget** = 100% − SLO. Lo que "se puede perder" en el período sin gatillar intervención.

**Período de medición:** mes calendario.

---

## 2 · SLOs primarios

### 2.1 Disponibilidad del checkout

- **SLI:** porcentaje de requests a `POST /api/rpc` con RPC `fn_place_order` que retornan éxito (200 + order_id válido) sobre el total de intentos del período.
- **SLO:** ≥ 99.5% mensual.
- **Error budget:** 0.5% del período = ~3.6 horas de downtime/mes.
- **Fuente:** Vercel Analytics (server response status) + Supabase logs (RPC success rate).
- **Consecuencia si se rompe:** ventas perdidas directas; pedido queda sin entrar.

### 2.2 Latencia de home — LCP

- **SLI:** Largest Contentful Paint de `/` en Real User Monitoring (Vercel Speed Insights).
- **SLO:** p75 mobile < 2.5s · p95 mobile < 4.0s.
- **Error budget:** 25% de sesiones mobile pueden exceder 2.5s LCP sin disparar revisión.
- **Fuente:** Vercel Speed Insights dashboard.
- **Consecuencia si se rompe:** abandono temprano, ranking SEO degradado (Core Web Vitals es factor de Google).

### 2.3 Latencia del detalle de producto

- **SLI:** LCP de `/producto/[slug]` en RUM.
- **SLO:** p75 mobile < 3.0s.
- **Fuente:** Vercel Speed Insights.

### 2.4 Frescura de stock

- **SLI:** diferencia entre `products.stock_kg` en Postgres y el valor visible en `/` (home es `force-static`, se actualiza on-demand via `revalidatePath`).
- **SLO:** ≤ 5 min desde que el admin cambia stock hasta que el home refleja el cambio.
- **Fuente:** tiempo entre `updateStock()` y próximo response `/` con nuevo valor.
- **Consecuencia si se rompe:** oversell si el admin vendió presencialmente y no se refleja online a tiempo.

---

## 3 · SLOs secundarios (mejor esfuerzo, no auditados formalmente)

### 3.1 Tiempo de confirmación WhatsApp

- **Target:** 80% de pedidos confirmados por el operador dentro de 2h en horario laboral (mar-sáb, 9:00-20:00 CLT).
- **Medición:** `orders.confirmed_at - orders.whatsapp_sent_at`.
- **No es SLO duro** porque depende de factor humano; sí es señal si se degrada.

### 3.2 Builds CI

- **Target:** 95% de builds en `main` y PRs completan `tsc --noEmit + next build` en < 3 min sin warnings nuevos.
- **Fuente:** GitHub Actions history.

---

## 4 · Política de error budget

Si el error budget mensual se consume **antes del día 20 del mes**:

1. Freeze de features cosméticas hasta fin de mes.
2. Revisión de incidentes que consumieron budget (Vercel Analytics + audit log).
3. Si la causa es deployment reciente: rollback o fix antes de cualquier nuevo cambio.

Si hay **incidente con downtime > 15 min** durante horario laboral: runbook en [`RUNBOOK.md`](./RUNBOOK.md), postmortem breve en `docs/POSTMORTEMS/` (no existe todavía, crear en primer incidente).

---

## 5 · Cómo se miden hoy

| SLI | Herramienta activa | Estado |
|---|---|---|
| Disponibilidad RPC | Vercel logs + Supabase logs | Manual review mensual |
| LCP RUM | Vercel Speed Insights | Activo |
| Stock freshness | Logs custom (pendiente) | No automatizado |
| WhatsApp confirmation lag | Query SQL ad-hoc | No automatizado |

**Brecha conocida:** no hay dashboard consolidado. Estado actual es "revisar cuando algo se siente raro". Aceptable para el volumen actual (< 100 pedidos/mes). Si crece, se prioriza dashboard.

---

## 6 · Benchmarks de referencia

Valores contra los que se calibraron los SLOs (abril 2026):

- **LCP target 2.5s** = threshold "Good" de Core Web Vitals (web.dev/lcp).
- **Availability 99.5%** = típico de e-commerce pequeño; Stripe Status marca 99.99% pero eso asume equipo SRE dedicado.
- **Confirmation < 2h** = observado empíricamente en meses previos como aceptable por clientes (no hubo queja formal).

---

## 7 · Revisión

Este documento se revisa **al final de cada trimestre** o cuando un SLO se rompe consistentemente. Cambios requieren ADR en [`docs/ADR/`](./ADR) si implican redefinir target.

Próxima revisión prevista: **julio 2026**.
