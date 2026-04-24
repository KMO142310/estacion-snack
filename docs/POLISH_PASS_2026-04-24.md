# Polish Pass · 2026-04-24

**Objetivo**: que el proyecto se lea como "trabajo con pensamiento atrás" ante un revisor técnico con background en informática, sin inflar deuda técnica que el operador único tenga que mantener después.

**Trigger**: percepción del dueño de que el sitio se veía "básico".

**Branch**: `chore/recover-uncommitted-session` (renombrar a `feat/academic-presentation-polish` antes del PR).

---

## Resultado en una mirada

| Área | Antes | Después |
|---|---|---|
| Uncommitted WIP | 8 archivos sin commitear en `main` desde sesión previa (-310 líneas netas) | Preservado como commit atómico con mensaje explicativo |
| Hero | Single-image minimalista genérico | FlipBoard (Solari split-flap) rotando 4 mensajes + image caption + TrustBar con 4 signals concretos |
| Trust signals | Línea italic única | 4 ítems con icono (Origen, Horario, Cobertura, Pago) |
| README | Setup básico | Badges, C4 Context Mermaid, método declarado, 7 puntos "no obvios", links a docs |
| ADRs | 1 (nextjs+supabase) | 3 — sumados RLS-boundary + WhatsApp-as-payment-rail |
| Threat model | Implícito en SECURITY_AUDIT.md (54KB) | `docs/THREAT_MODEL.md` STRIDE por componente en 250 líneas |
| SLO/SLI | No documentado | `docs/SLO.md` con availability, LCP, frescura stock + política error budget |
| Security exec | Solo SECURITY_AUDIT.md | `docs/SECURITY.md` ejecutivo 2 páginas |
| ArchitectureC4 | Solo ASCII | Agregado C4 Container Mermaid |
| Tests | Ninguno | Vitest + 5 archivos · 34 tests verdes |
| Lint | Ninguno | ESLint 9 flat config + 15 errores previos resueltos |
| Formatter | Ninguno | Prettier 3 + .prettierrc + .prettierignore |
| CSP | Ausente | Nonce-based middleware + /api/csp-report + report-uri |
| /api/health | Ausente | Endpoint con status + env checks |
| CI | typecheck + build | lint + typecheck + test + build |
| Pre-commit hook | False-positives en docs con `service_role` | Patterns anclados, JWT requiere formato header.payload |

---

## Commits del pass (rama `chore/recover-uncommitted-session`)

```
5bdd960 feat(infra): ESLint + Prettier + Vitest + CSP nonce middleware + CI expandido
e73e971 docs: narrativa de calidad — README + 2 ADRs + threat model + SLO + security exec
6189ae9 feat(home): Hero con tablero de salidas + TrustBar con sustancia
78a258a chore(ui): preservar refactor minimalista de sesión previa
```

---

## Verificación

- `npm run lint`: 0 errors, 0 warnings.
- `npm run typecheck`: verde.
- `npm test`: 34/34 passing.
- `npm run build`: 22/22 rutas generadas; middleware (Proxy) y `/api/csp-report`, `/api/health` registrados.
- `npm run verify`: pipeline completo verde.

---

## Lo que se dejó explícitamente fuera

Documentado en `.claude/plans/delegated-honking-gosling.md` §"Lo que explícitamente NO hacemos":

- Playwright E2E (requiere seed data estable — sin eso son teatro).
- Recomendaciones "comprados juntos" (cold-start con <1000 pedidos = ruido estadístico).
- Stock forecasting moving average (mismo problema de data).
- Sentry / pino structured logging (Vercel Analytics ya cubre, sin costo adicional).
- Recharts / dashboard analytics (visualmente bonito, operacionalmente inútil a este volumen).
- i18n, dark mode, PWA (scope creep).
- Mercado Pago integration (decisión de negocio documentada en ADR 0003, no técnica).
- k6 load tests (tráfico marginal = ficción).
- commitlint, lint-staged, matrix Node (fricción para operador único).
- pg_trgm search (Bloque 4 opcional del plan — pospuesto porque la migración en prod Supabase es riesgo innecesario para esta presentación; bien implementado requiere ADR comparando contra tsvector/Meilisearch/PGVector que no tiene sentido escribir sin data real).

---

## Hallazgos laterales resueltos durante el pass

1. **`.git/hooks/pre-commit`** (LF-2 extendido): el pattern `service_role` case-insensitive sin anclaje bloqueaba commits legítimos de documentación. El pattern JWT `eyJ[...]{20,}` también matcheaba hashes SHA-512 base64 en `package-lock.json`. Ambos refinados:
   - JWT ahora requiere formato `eyJ...eyJ` con punto (header.payload real).
   - `service_role` requiere asignación literal (`service_role[=:]\s*["'...]`).
   - Sumados: AWS access key, GitHub PAT, Stripe test key.
   - Reporta líneas que gatillaron al fallar (trazabilidad).
   - NOTA: `.git/hooks/` no es versionado, el fix es local. Si Omar cambia de máquina, hay que re-aplicar.

2. **`lib/business-info.ts`**: contiene RUT + número de cuenta bancaria literal. Hoy se importa desde client components (OrderSheet) → **shippea al bundle de cliente**. Riesgo bajo (son datos que el cliente igual ve en WhatsApp), pero aislarlo en env var + server-only lookup sería más limpio. **Abierto** en `docs/LATERAL_FINDINGS.md`.

---

## Hallazgos laterales NO resueltos (documentados)

Ninguno nuevo que no estuviera ya en `docs/LATERAL_FINDINGS.md`. El item de `business-info.ts` arriba es lo único detectado durante este pass.

---

## Próximos pasos sugeridos (post-presentación)

**Si la conversación con el cuñado trae feedback específico** que se quiera implementar:

- Implementar pg_trgm search con ADR fuerte comparando contra alternativas (plan guardado).
- Rate limiting en `/contacto` y `/api/csp-report` (upstash o in-memory).
- Migrar `ADMIN_EMAIL` env var a tabla `admins` con roles (cuando haya segundo operador).
- Dashboard admin con gráficos de ingresos + top productos (recharts).
- Playwright E2E del critical path.
- Lighthouse CI con budgets explícitos (LCP, bundle size).
- Sentry o Axiom.co para error tracking centralizado.

Ninguno es urgente. Todos son aditivos. El proyecto hoy ya cubre con seriedad la superficie que un revisor técnico va a explorar en los primeros 30 min.

---

## Deploy

**No se hace merge a `main` desde este pass**. El operador (Omar) debe:

1. Revisar la rama localmente (`git log --oneline`, `npm run dev`).
2. Pushear la rama a GitHub (`git push -u origin chore/recover-uncommitted-session` o renombrarla a `feat/academic-presentation-polish`).
3. Abrir PR a `main` en GitHub.
4. Verificar que CI pase (lint + typecheck + test + build).
5. Revisar el preview deployment en Vercel (URL en el PR).
6. Mergear solo si el preview se ve bien.
7. Verificar `curl -I https://www.estacionsnack.cl` muestra header `content-security-policy`.
8. Verificar `curl https://www.estacionsnack.cl/api/health` retorna `{status:"ok"}`.

Push a `main` = deploy automático. Cualquier regresión visible después de mergear se mitiga con rollback en Vercel dashboard.
