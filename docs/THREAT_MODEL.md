# Threat Model — Estación Snack

**Versión:** 1.0
**Fecha:** 2026-04-24
**Scope:** aplicación `estacionsnack.cl` (Next.js + Supabase + Vercel) y flujo completo de pedido.
**Fuera de scope:** seguridad física del operador, supply-chain attacks en dependencias npm (Dependabot activo), ataques a cuentas personales del operador (Gmail, banco, Meta).

Análisis **STRIDE** por componente. Cada amenaza lista el control existente, su ubicación y referencia CWE/ASVS cuando aplica.

---

## Componentes

1. **Cliente público** — navegador en `estacionsnack.cl`.
2. **Next.js app** — Vercel (Edge + Fluid functions).
3. **Supabase (Postgres + Auth + Storage)**.
4. **Cron job** — `/api/cron/release-reservations`.
5. **Admin** — operador autenticado vía magic link.

## Datos en juego

| Dato | Sensibilidad | Ubicación |
|---|---|---|
| Catálogo + stock | Público | `products` (lectura pública) |
| Nombre + teléfono del cliente | PII moderada | `customers` (default-deny) |
| Detalle del pedido | PII + comercial | `orders`, `order_items` |
| Access token del pedido | Secreto efímero | URL del cliente |
| `SUPABASE_SERVICE_ROLE_KEY` | Alto — bypass de RLS | Vercel env vars + `lib/supabase/admin.ts` |
| `CRON_SECRET` | Medio — DoS si filtra | Vercel env vars |
| `AUDIT_PEPPER` | Medio — sin él, IPs son identificables | Vercel env vars |
| Audit log | Forense | `audit_log` (append-only) |

---

## STRIDE por componente

### Cliente → App

| Amenaza | Vector | Control | Referencia |
|---|---|---|---|
| **S**poofing: suplantación de cliente | Req manipulada con phone ajeno | `fn_place_order` no requiere auth; cada pedido genera token propio; no hay "historial del cliente" consultable sin token. | CWE-287 |
| **T**ampering: modificar precios en el request | Cliente manda `price: 1` | Server action **ignora** precios del cliente; `fn_place_order` consulta precio desde `products` server-side. | CWE-602 |
| **R**epudiation: "yo no pedí eso" | Cliente niega pedido enviado | `audit_log` con `access_token_created` + hash de IP/UA (GDPR). Inmutable (trigger bloquea UPDATE/DELETE). | CWE-778 |
| **I**nformation disclosure: leer pedido ajeno (IDOR) | GET `/pedido/UUID?t=<guess>` | Access token 256 bits entropy; comparación time-safe (`safeEqual` en `lib/crypto.ts`); TTL 30 días; rotación en estado terminal. | CWE-639, CWE-208 |
| **D**oS: inundar formulario de contacto | POST spam masivo | Rate limiting (WIP, planificado). Supabase RLS bloquea bulk inserts fuera de `fn_*`. Vercel DDoS en plataforma. | — |
| **E**levation: anon → admin | Manipular cookie/session | Magic link + cookie `HttpOnly` + `SameSite=Lax` + `Secure`. `ADMIN_EMAIL` validado server-side con `assertAdmin()`. | CWE-1220 |

### App ↔ Supabase

| Amenaza | Vector | Control | Referencia |
|---|---|---|---|
| **T**ampering: SQL injection | Server action concatenando query | Todas las queries vía `@supabase/supabase-js` parameterizadas + RPC; RLS default-deny limita blast radius. | CWE-89 |
| **I**nformation disclosure: anon lee tablas sensibles | Atacante usa anon key contra REST API | `default-deny` en `customers`, `orders`, `order_items`, `audit_log`, `stock_reservations`. Reproducible en `SECURITY_AUDIT.md`. | ASVS §4.2.1 |
| **T**ampering: search_path hijacking en `SECURITY DEFINER` | Atacante crea tabla `pg_temp.products` | `SET search_path = public, pg_temp` en TODA función `SECURITY DEFINER`. | CVE-2018-1058 |
| **E**levation: anon llama a función admin | RPC directo a `fn_upsert_product` | Function sin `GRANT EXECUTE TO anon`; solo service role (admin-only). | CWE-285 |
| **R**epudiation: admin borra audit log | UPDATE/DELETE sobre `audit_log` | Trigger de inmutabilidad: cualquier `UPDATE` o `DELETE` lanza excepción. Admin no puede saltarlo sin `DROP TRIGGER` (auditable en logs DB). | CWE-778 |

### Cron → App → Supabase

| Amenaza | Vector | Control | Referencia |
|---|---|---|---|
| **S**poofing: atacante llama `/api/cron/release-reservations` | GET sin auth | Bearer `CRON_SECRET` validado con `safeEqual` time-safe. | CWE-287, CWE-208 |
| **T**ampering: cron libera más reservas que las expiradas | Bug en función | `fn_release_expired_reservations` tiene `WHERE expires_at < now()` hardcoded; input-less. | — |
| **R**epudiation: cron corrió pero nadie sabe | Falta logging | Respuesta retorna count; `audit_log` inserta con `actor='cron'`. | CWE-778 |

### Admin

| Amenaza | Vector | Control | Referencia |
|---|---|---|---|
| **S**poofing: otro email accede a `/admin` | `user.email` manipulado | `assertAdmin()` compara `user.email === ADMIN_EMAIL` server-side. Supabase Auth es la source of truth del email (viene del JWT). | CWE-287 |
| **E**levation: user común → admin operando en DB | Policy permite INSERT en `admin_users` | No existe tabla `admin_users`; el gate es env var. Roadmap: migrar a tabla con policies. | ASVS §4.2.2 |
| **I**nformation disclosure: admin panel indexable | Googlebot crawlea `/admin` | `robots.ts` disallow `/admin`; `noindex` header en admin layout; `X-Robots-Tag: noindex` via `next.config.ts`. | — |

---

## Controles transversales

### Headers (OWASP, configurados en `next.config.ts`)

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- `/pedido/[id]`: `Referrer-Policy: no-referrer`, `Cache-Control: no-store`, `X-Robots-Tag: noindex, nofollow`
- CSP nonce-based (WIP — planificado para bloque siguiente).

### Secrets management

- Todo secret vive en Vercel env vars (prod) y `.env.local` (dev, gitignored).
- Pre-commit hook escanea patterns (JWT `eyJ`, Stripe `sk_`, AWS `AKIA`, GitHub PAT, `service_role`) en diff staged.
- Rotación: manual vía Vercel Settings cuando se sospecha compromiso. Sin automatización (scope limitado).

### GDPR / minimización de datos

- IPs y User-Agents hasheados con HMAC-SHA256 + `AUDIT_PEPPER` antes de insertar en `audit_log_order_views`. PII bruta nunca persiste. GDPR Art. 5(1)(c).
- Teléfono y nombre del cliente guardados por legítimo interés (cumplir pedido); política de retención en `docs/RUNBOOK.md`.

---

## Amenazas conocidas no mitigadas

| Amenaza | Por qué no se mitiga hoy | Mitigación si escala |
|---|---|---|
| Rate limiting en `/contacto` y `/api/csp-report` | Tráfico marginal, falsos positivos pesan más | Upstash Ratelimit por IP hash cuando tráfico > X/min |
| CSP nonce-based completo | Implementación en progreso (Bloque 3 del plan de polish) | Middleware + `strict-dynamic` |
| RBAC granular (múltiples admins con permisos distintos) | Solo 1 operador hoy | Tabla `admins` + roles cuando se contrate segundo operador |
| Penetration testing externo | Presupuesto | Contratar cuando el ticket promedio × volumen justifique (> 200 pedidos/mes) |
| WAF / bot management | Vercel free tier ya tiene baseline | Vercel Pro o Cloudflare si aparece abuse real |

---

## Referencias

- OWASP ASVS v4.0.3 — https://owasp.org/www-project-application-security-verification-standard/
- NIST SP 800-63B — Digital Identity Guidelines
- Microsoft STRIDE — https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats
- CWE — https://cwe.mitre.org
- CVE-2018-1058 (PostgreSQL search_path) — https://nvd.nist.gov/vuln/detail/CVE-2018-1058
- GDPR Art. 5(1)(c) — minimización de datos
- `SECURITY_AUDIT.md` — audit forense reproducible con `curl`
