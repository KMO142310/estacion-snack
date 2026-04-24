# Security — resumen ejecutivo

**Versión:** 1.0 · **Fecha:** 2026-04-24

Sumario de 2 páginas de la postura de seguridad. Para el detalle forense con `curl` reproducible, ver [`SECURITY_AUDIT.md`](../SECURITY_AUDIT.md) (54 KB). Para threat model completo, ver [`THREAT_MODEL.md`](./THREAT_MODEL.md).

---

## 1 · Postura en una frase

Defensa en profundidad con la base de datos como frontera primaria de autorización: **RLS default-deny** en todas las tablas + funciones `SECURITY DEFINER` con `search_path` pinning + audit log append-only + access tokens 256-bit con comparación time-safe.

---

## 2 · Controles vs amenazas (tabla ejecutiva)

| Amenaza | Control | Ubicación | Referencia |
|---|---|---|---|
| SQL injection | Queries parameterizadas (supabase-js) + RLS default-deny | `lib/actions.ts`, migraciones | CWE-89 |
| IDOR en pedidos | Access token 256-bit, base64url, TTL 30 días, rotación en estado terminal | `fn_place_order`, `lib/crypto.ts` | CWE-639 |
| Timing side-channel | `crypto.timingSafeEqual` (Node nativo) | `lib/crypto.ts#safeEqual` | CWE-208 |
| Overselling en concurrencia | Transacción atómica con `SELECT FOR UPDATE` + stock reservations TTL 15 min | `fn_place_order`, `fn_reserve_stock` | — |
| Privilege escalation via search_path | `SET search_path = public, pg_temp` en toda función `SECURITY DEFINER` | Todas las migrations | CVE-2018-1058 |
| Admin spoofing | `assertAdmin()` compara `user.email === ADMIN_EMAIL` server-side | `lib/auth/assert-admin.ts` | CWE-287 |
| Audit tampering | Trigger de inmutabilidad (UPDATE/DELETE bloqueado) | `0002_rls_hardening.sql` | CWE-778 |
| Clickjacking | `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` (WIP) | `next.config.ts` | CWE-1021 |
| Mixed content / downgrade | HSTS 2 años + preload | `next.config.ts` | CWE-319 |
| Information disclosure vía Referer | `Referrer-Policy: no-referrer` en `/pedido/[id]` | `next.config.ts` | CWE-200 |
| Admin panel indexado | `robots.ts` disallow + `X-Robots-Tag: noindex` | `app/admin/layout.tsx` | — |
| PII en logs (GDPR) | IP + UA hasheados con HMAC-SHA256 + pepper | `audit_log_order_views` | GDPR Art. 5(1)(c) |
| Leak de secretos en commits | Pre-commit hook escanea JWT/AWS/Stripe/GitHub patterns | `.claude/hooks/pre-commit-guard.sh` | CWE-798 |
| Service role mal usado | Único import en `lib/supabase/admin.ts`; resto bloqueado por hook | `lib/supabase/admin.ts` | — |
| FLoC / tracking cross-site | `Permissions-Policy: interest-cohort=()` | `next.config.ts` | Privacy |

---

## 3 · Superficie de ataque por canal

### Cliente público (anon)

- **Acceso a DB**: solo SELECT en `products` con `is_active = true`.
- **Operaciones permitidas**: reservar stock (con session_id), crear pedido vía `fn_place_order`.
- **Todo lo demás**: denegado por RLS.
- **Audit baseline**: `curl $SUPABASE_URL/rest/v1/orders -H "apikey: $ANON"` retorna `[]` (verificable en `SECURITY_AUDIT.md`).

### Cron (`/api/cron/release-reservations`)

- **Auth**: Bearer `CRON_SECRET` comparado con `safeEqual`.
- **Operaciones permitidas**: llamar a `fn_release_expired_reservations` (input-less, idempotente).
- **Sin secret válido**: 401.

### Admin (`/admin/*`)

- **Auth**: Supabase magic link + cookie SSR.
- **Gate**: `assertAdmin()` en cada operación.
- **Service role**: disponible solo tras pasar el gate; centralizado en `lib/supabase/admin.ts`.

---

## 4 · Política de secretos

| Secret | Ubicación | Rotación | Si filtra |
|---|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel env, `.env.local` | Manual cuando se sospeche | Rotar en Supabase + redeploy. Game-over dentro del scope de DB, mitigado por triggers. |
| `SUPABASE_ANON_KEY` | Pública (NEXT_PUBLIC_*) | No aplica | No es incidente — es pública por diseño; RLS default-deny la neutraliza. |
| `ADMIN_EMAIL` | Vercel env | Raro | Cambiar valor + verificar que la cuenta anterior ya no tiene sesión activa. |
| `CRON_SECRET` | Vercel env | Manual cuando se sospeche | Rotar + redeploy. Peor caso: atacante gatilla cron más veces (idempotente, bajo impacto). |
| `AUDIT_PEPPER` | Vercel env | Nunca (hashes previos no verifican con pepper nuevo) | Rotar solo si se filtra; comunicar en post-mortem que audit previo queda no-correlacionable. |
| `RESEND_API_KEY` | Vercel env | Manual | Rotar en Resend + redeploy. Peor caso: spam outbound en nombre del proyecto. |

---

## 5 · Verificación continua

- **CI**: `tsc --noEmit` + `next build` bloquean merge a `main`.
- **Pre-commit local**: hook de secrets + lint + typecheck.
- **Audit manual**: `SECURITY_AUDIT.md` se actualiza cuando hay migración que toca RLS.
- **Revisión mensual**: log de Supabase + Vercel analytics para detectar patterns anómalos.
- **Penetration testing externo**: no contratado (presupuesto). Plan: cuando el ticket promedio × volumen lo justifique.

---

## 6 · Brechas conocidas

Documentadas con honestidad:

1. **CSP nonce-based**: en progreso. Actualmente headers OWASP cubren la mayor parte; CSP cerraría la brecha de XSS inline.
2. **Rate limiting** en `/contacto`: no implementado. Riesgo: spam del formulario. Mitigación provisional: review manual.
3. **RBAC granular**: solo 1 admin. Cuando se incorpore segundo operador, migrar de env var a tabla `admins`.
4. **Logs estructurados**: uso `console.*` + Vercel logs. Sin Sentry/Datadog por costo; Vercel Analytics cubre web vitals y errores client-side.
5. **Backups de DB**: Supabase free tier ofrece PITR 1 día. Plan Pro ($25/mes) extiende a 7 días — evaluable cuando haya razón.

---

## 7 · Reportar vulnerabilidades

Si encontraste algo: email directo al operador vía `/contacto` o Instagram DM. Responder dentro de 72h en horario laboral.

**No se publican CVEs** — proyecto personal, sin superficie crítica de supply-chain. Fixes se aplican directo en `main` vía PR.

---

## Referencias

- [`SECURITY_AUDIT.md`](../SECURITY_AUDIT.md) — audit forense reproducible.
- [`THREAT_MODEL.md`](./THREAT_MODEL.md) — STRIDE detallado.
- OWASP ASVS v4.0.3, NIST SP 800-63B, CWE/CVE.
