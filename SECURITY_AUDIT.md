# SECURITY AUDIT — Bloque 2: RLS Hardening

Entregable forense del Bloque 2 del plan de hardening de Estación Snack.
Captura el estado de Row-Level Security y control de acceso de Supabase
**antes** y **después** de aplicar `supabase/migrations/0002_rls_hardening.sql`,
con outputs literales de `curl` contra el REST API, anonimización consistente,
y citas a estándares por cada mitigación.

> Este documento se redactó durante la sesión del 2026-04-10/11 sobre la rama
> `hardening/round-1`. El "after" se rellena cuando la migración 0002 esté
> aplicada y los tests post se re-ejecuten.

## Modelo de amenaza

- **`SUPABASE_SERVICE_ROLE_KEY` se asume comprometida.** Cada operación
  privilegiada debe ser auditable post-hoc mediante un audit log append-only.
- **Links `/pedido/[id]` viajan por WhatsApp, se forwardean accidentalmente,
  quedan en historial de PCs compartidas, y el Referer los filtra.** El
  token-in-URL se trata como un secreto con TTL (30 días), no como una
  capability URL.
- **Anon y authenticated no deben poder enumerar, leer ni tamperar** `orders`,
  `order_items`, `customers`, ni `stock_reservations` por acceso directo al
  REST API.
- **Toda función `SECURITY DEFINER` es superficie de ataque** si su
  `search_path` no está fijado — vector histórico documentado en CVE-2018-1058.
- **El catálogo de productos (`products`) es intencionalmente público** para
  lectura; las mutaciones son admin-only.

## Estándares referenciados

| Sigla | Origen | Usado en |
|---|---|---|
| OWASP ASVS v4.0.3 §3.4, §8.3 | Session/token handling en URIs | `orders.access_token` |
| OWASP ASVS v4.0.3 §4.2.1 | Access control, default-deny | RLS en todas las tablas sensibles |
| OWASP ASVS v4.0.3 §7.1 | Audit logging | `audit_log`, `audit_log_order_views` |
| OWASP ASVS v4.0.3 §11.1.5 | Abuse of business logic | Stock griefing vía RPCs aisladas |
| NIST SP 800-63B §5.1.1.2 | Token entropy floor (≥ 112 bits) | 256-bit access tokens |
| NIST SP 800-92 §4.2 | Append-only audit logs | Trigger de inmutabilidad |
| CWE-200 | Sensitive info exposure | PII minimization en `/pedido/[id]` |
| CWE-208 | Timing side-channel | `safeEqual` en `lib/crypto.ts` |
| CWE-284 | Improper access control | Default-deny RLS |
| CWE-400 | Resource exhaustion / DoS | Revocación de DELETE abierto en `stock_reservations` |
| CWE-639 | IDOR via predictable ID | Access token + TTL |
| CWE-778 | Insufficient logging | Append-only audit log |
| CVE-2018-1058 | Postgres search_path hijacking | `SET search_path = public, pg_temp` |
| GDPR art. 5(1)(c) | Data minimization (standard técnico) | `audit_log_order_views.ip_hash` |
| Ley 19.496 (Chile) arts. 28-33 | Publicidad veraz y comprobable | FL-3 (hallazgo lateral) |

## Método

- **Tooling**: `curl` contra `${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/` con headers
  `apikey` + `Authorization: Bearer`.
- **Keys**: cargadas vía `vercel env pull --environment=production` a
  `.env.local` (gitignored desde Bloque 1, `chmod 600`). Las keys **nunca**
  aparecen literales en este documento.
- **Buffer local**: `/tmp/rls_baseline.txt`, creado con `umask 077`, forzado a
  `chmod 600`. Se borra con `rm -P` al cierre completo del Bloque 2 (después
  del audit post-migración).
- **Anonimización**: `<REDACTED-N>` para UUIDs que identifican sesiones,
  requests de Supabase (`sb-request-id`), o clientes. `N` es consistente por
  UUID dentro del documento. UUIDs de productos del catálogo quedan visibles
  porque son identificadores públicos derivables del listing de la home.
- **Headers omitidos por señal/ruido**: `cf-ray`, `set-cookie: __cf_bm`,
  `server: cloudflare`, `alt-svc`, `strict-transport-security`, `x-envoy-*`,
  `vary: Accept-Encoding`. No aportan al forensics de RLS y `__cf_bm` es un
  cookie de bot-detection que preferimos no tener literal en git.
- **Timing-safe compare**: cualquier comparación de secretos en código de
  aplicación usa `crypto.timingSafeEqual` vía `lib/crypto.ts:safeEqual`
  (Bloque 1).

## Metadata — ejecución baseline

| Campo | Valor |
|---|---|
| T_START | `2026-04-11T00:10:31Z` |
| T_END (curls #1–#9) | `2026-04-11T00:10:36Z` |
| Curls #10a / #10b | `~2026-04-11T00:14:47Z` |
| Curls #11 / #12 (diagnóstico packs) | posteriores, mismo buffer |
| Duración #1–#9 | ~5 s |
| Migración aplicada | **NO** — baseline, `0001_init.sql` activo |
| Proyecto Supabase | `uchhxzdvnvmtnfsojywa` |
| REST endpoint | `https://uchhxzdvnvmtnfsojywa.supabase.co/rest/v1/` |
| Commit base del audit | `7a87a84` + setup `5eba0db` (rama `hardening/round-1`) |

---

## Baseline — resultados literales

### #0 · Health check (sin headers)

```
GET /rest/v1/
→ HTTP/2 401
```

Esperado: endpoint vivo, PostgREST rechaza sin apikey. ✅

### #1 · SELECT anon `products`

**Expectativa**: `200` + catálogo — policy `products_public_read` del 0001
expone el catálogo por diseño. Sin PII en `products`.

```
GET /rest/v1/products?select=id,slug,name,price,stock_kg&order=sort_order
Headers: apikey / Authorization = anon

→ HTTP/2 200
  content-type: application/json; charset=utf-8
  content-range: 0-5/*
  content-profile: public
  sb-request-id: <REDACTED-1>

[{"id":"<REDACTED-2>","slug":"mix-europeo","name":"Mix Europeo","price":13000,"stock_kg":5.000},
 {"id":"<REDACTED-3>","slug":"mani-confitado-tropical","name":"Maní Confitado Tropical","price":5990,"stock_kg":5.000},
 {"id":"<REDACTED-4>","slug":"mani-confitado-rojo","name":"Maní Confitado Rojo","price":5990,"stock_kg":5.000},
 {"id":"<REDACTED-5>","slug":"chuby-bardu","name":"Chuby Bardú","price":9990,"stock_kg":5.000},
 {"id":"<REDACTED-6>","slug":"gomita-osito-docile","name":"Gomita Osito Docile","price":8500,"stock_kg":5.000},
 {"id":"<REDACTED-7>","slug":"almendra-entera","name":"Almendra Entera","price":16000,"stock_kg":1.000}]
```

### #2 · SELECT anon `orders`

**Expectativa**: `[]` — RLS enabled + sin policy explícita en 0001 = default-deny
nativo de Postgres.

```
GET /rest/v1/orders?select=*&limit=5
Headers: apikey / Authorization = anon

→ HTTP/2 200
  content-type: application/json; charset=utf-8
  content-length: 2
  content-range: */*
  content-profile: public
  sb-request-id: <REDACTED-8>

[]
```

**Estado**: ✅ cerrado por default-deny nativo aun sin policy explícita. El
0002 agrega un `deny_all` explícito como documentación del intent (OWASP ASVS
§4.2.1, CWE-284).

### #3 · SELECT anon `order_items`

```
GET /rest/v1/order_items?select=*&limit=5
Headers: apikey / Authorization = anon

→ HTTP/2 200
  content-length: 2
  content-range: */*
  sb-request-id: <REDACTED-9>

[]
```

**Estado**: ✅ idem #2.

### #4 · SELECT anon `customers`

```
GET /rest/v1/customers?select=*&limit=5
Headers: apikey / Authorization = anon

→ HTTP/2 200
  content-length: 2
  content-range: */*
  sb-request-id: <REDACTED-10>

[]
```

**Estado**: ✅ PII (phone, name) cerrada por default-deny nativo.
Ref: GDPR art. 5(1)(c), CWE-200.

### #5 · SELECT anon `stock_reservations` ⚠️ TEST NO DETERMINISTA

```
GET /rest/v1/stock_reservations?select=*&limit=5
Headers: apikey / Authorization = anon

→ HTTP/2 200
  content-length: 2
  content-range: */*
  sb-request-id: <REDACTED-11>

[]
```

**El `[]` NO prueba que la policy cierre lectura.** La migración 0001 contiene
(líneas 147–149):

```sql
create policy "reservations_select_session"
  on stock_reservations for select
  using (true);
```

Esta policy permite a cualquier anon leer **todas** las reservas. El `[]`
observado es porque en el momento del baseline no había reservas vivas
(TTL 15 min del `fn_reserve_stock`, sin checkouts en curso). **La policy está
abierta; el output del curl es engañoso.**

**Follow-up FL-1 requerido** (ver sección "Follow-ups") para convertir este
test en determinista con un insert previo de reserva con service_role.

### #6 · INSERT anon `orders` con body canario

```
POST /rest/v1/orders
Headers: apikey / Authorization = anon
        Content-Type: application/json
        Prefer: return=representation
Body:   {"customer_name":"RLS_TEST_SHOULD_FAIL","total":0}

→ HTTP/2 401
  content-type: application/json; charset=utf-8
  proxy-status: PostgREST; error=42501
  www-authenticate: Bearer
  sb-request-id: <REDACTED-12>

{"code":"42501","details":null,"hint":null,"message":"new row violates row-level security policy for table \"orders\""}
```

**Estado**: ✅ bloqueado limpio con `42501`. Ninguna fila creada. No hizo
falta DELETE de rescate. Ref: CWE-284, OWASP ASVS §4.2.1.

### #7 · PATCH anon `products` WHERE id = UUID-cero ⚠️ TEST DÉBIL

```
PATCH /rest/v1/products?id=eq.00000000-0000-0000-0000-000000000000
Headers: apikey / Authorization = anon
        Content-Type: application/json
        Prefer: return=minimal
Body:   {"price":99999999}

→ HTTP/2 204
  content-range: */*
  preference-applied: return=minimal
  sb-request-id: <REDACTED-13>

(sin body)
```

**Por qué es débil**: `204 No Content` con `return=minimal` es ambiguo — se
emite tanto si RLS bloquea el UPDATE como si el WHERE matchea 0 filas. El
UUID-cero garantiza 0 filas por diseño, o sea que en baseline no podemos
inferir si un anon podría modificar `products` con un UUID real.

**Follow-up FL-2 requerido**: cambiar a `Prefer: return=representation` en el
after-migration para discriminar `401 42501` (RLS block) vs `200 []`
(WHERE no match).

### #8 · DELETE anon `stock_reservations` WHERE session_id = UUID-cero ⚠️ TEST DÉBIL

```
DELETE /rest/v1/stock_reservations?session_id=eq.00000000-0000-0000-0000-000000000000
Headers: apikey / Authorization = anon
        Prefer: return=minimal

→ HTTP/2 204
  content-range: */*
  preference-applied: return=minimal
  sb-request-id: <REDACTED-14>

(sin body)
```

**Por qué es débil**: mismo problema que #7. La policy
`reservations_delete_session USING (true)` del 0001 (líneas 151–153) permite
el DELETE conceptualmente, pero no tenemos cómo demostrarlo sin tocar datos
reales.

**Follow-up FL-2**: aplicar el mismo fix (`return=representation`) al DELETE
post-migración. Ver también H6 en "Hipótesis de ataque cubiertas" — este es
el test del ataque de stock griefing.

### #9 · SELECT service_role `products` (test positivo base)

```
GET /rest/v1/products?select=id,slug,name,stock_kg&order=sort_order
Headers: apikey / Authorization = service_role

→ HTTP/2 200
  content-type: application/json; charset=utf-8
  content-range: 0-5/*
  content-profile: public
  sb-request-id: <REDACTED-15>

[{"id":"b7dbb47c-8855-4b4d-9001-251c10a60849","slug":"mix-europeo","name":"Mix Europeo","stock_kg":5.000},
 {"id":"620c8862-5274-48c7-9908-51e90e00865e","slug":"mani-confitado-tropical","name":"Maní Confitado Tropical","stock_kg":5.000},
 {"id":"465359fd-7762-4c84-b309-a2faba252d11","slug":"mani-confitado-rojo","name":"Maní Confitado Rojo","stock_kg":5.000},
 {"id":"e0aa1424-4b85-418c-bd3c-8afd98d0778b","slug":"chuby-bardu","name":"Chuby Bardú","stock_kg":5.000},
 {"id":"7e6207f0-b67a-4afb-b6ad-d811b0ffca49","slug":"gomita-osito-docile","name":"Gomita Osito Docile","stock_kg":5.000},
 {"id":"b5e1770c-fd2d-4ada-b8c0-1dfc3e61155b","slug":"almendra-entera","name":"Almendra Entera","stock_kg":1.000}]
```

**Estado**: ✅ service_role bypasea RLS, lee normalmente. Los 6 UUIDs del
catálogo quedan visibles porque son identificadores públicos del catálogo
(derivables del HTML servido en `/`).

### #10a · GET service_role pre-PATCH (captura `updated_at` baseline)

**Target elegido**: `b5e1770c-fd2d-4ada-b8c0-1dfc3e61155b` (`almendra-entera`,
`stock_kg=1.000`). Razón: único producto con stock ≠ 5.000. Un typo en el
payload del PATCH sería inmediatamente visible por diferir del stock del resto.

```
GET /rest/v1/products?id=eq.b5e1770c-fd2d-4ada-b8c0-1dfc3e61155b&select=id,slug,stock_kg,updated_at
Headers: apikey / Authorization = service_role

→ HTTP/2 200
  content-type: application/json; charset=utf-8
  sb-request-id: <REDACTED-16>

[{"id":"b5e1770c-fd2d-4ada-b8c0-1dfc3e61155b","slug":"almendra-entera","stock_kg":1.000,"updated_at":"2026-04-10T14:50:47.285982+00:00"}]
```

### #10b · PATCH service_role no-op (trigger bump de `updated_at`)

```
PATCH /rest/v1/products?id=eq.b5e1770c-fd2d-4ada-b8c0-1dfc3e61155b&select=id,slug,stock_kg,updated_at
Headers: apikey / Authorization = service_role
        Content-Type: application/json
        Prefer: return=representation
Body:   {"stock_kg":1.000}

→ HTTP/2 200
  content-type: application/json; charset=utf-8
  preference-applied: return=representation
  sb-request-id: <REDACTED-17>

[{"id":"b5e1770c-fd2d-4ada-b8c0-1dfc3e61155b","slug":"almendra-entera","stock_kg":1.000,"updated_at":"2026-04-11T00:14:47.534893+00:00"}]
```

**Análisis numérico**:

- `stock_kg` pre: `1.000` → float `1.0`
- `stock_kg` post: `1.000` → float `1.0`
- `|delta stock_kg|` = `0.0` — tolerancia `< 0.0001` ✅
- `updated_at` T1: `2026-04-10T14:50:47.285982+00:00` → epoch `1,775,832,647,285` ms
- `updated_at` T2: `2026-04-11T00:14:47.534893+00:00` → epoch `1,775,866,487,534` ms
- `T2 > T1`: ✅ trigger `trg_products_updated_at` disparó
- `T2 − T1` = `33,840,249` ms ≈ **9 h 24 min**

**Sobre el delta de 9 h 24 min**: refleja que la fila no se tocaba desde el
último deploy/admin action, **no** una anomalía del trigger. El criterio
original "delta debería ser del orden de segundos" asumía un modelo mental
equivocado donde `T1 = tiempo del GET`; en realidad `T1` es el valor
almacenado de `updated_at` que es arbitrario. Lo que importa: `T2 > T1`
(trigger corrió) y `T2 ≈ wall-clock now` al momento del PATCH (ambos
cumplidos).

**Side-effect intencional documentado**:

> El test positivo de service_role bumpea `products.updated_at` de
> `almendra-entera` de `2026-04-10T14:50:47Z` a `2026-04-11T00:14:47Z`, sin
> cambio de valor de negocio (`stock_kg` permanece en `1.000`, precio, nombre,
> categoría, etc. intactos). Es un side-effect esperado desde el diseño del
> test — el objetivo del PATCH era probar que service_role puede escribir y
> que los triggers `BEFORE UPDATE` siguen funcionando. **No es un efecto no
> deseado.**

**Estado**: ✅ service_role write + trigger operativos pre-0002.

---

## Resumen del baseline

| # | Test | Baseline | Expectativa post-0002 | Ref | Status |
|---|---|---|---|---|---|
| 0 | Health no-headers | `401` | `401` (sin cambio) | — | ✅ |
| 1 | SELECT anon `products` | `200` + 6 rows | `200` + 6 rows | OWASP ASVS §1.4 | ✅ |
| 2 | SELECT anon `orders` | `200 []` (default-deny nativo) | `200 []` (deny_all explícito) | CWE-284, CWE-200, OWASP ASVS §4.2.1 | ✅ |
| 3 | SELECT anon `order_items` | `200 []` | `200 []` | CWE-284, OWASP ASVS §4.2.1 | ✅ |
| 4 | SELECT anon `customers` | `200 []` | `200 []` | CWE-200, GDPR art. 5(1)(c) | ✅ |
| 5 | SELECT anon `stock_reservations` | `200 []` (no determinista) | `200 []` o `401 42501` | CWE-284 | ⚠️ FL-1 |
| 6 | INSERT anon `orders` | `401 42501` | `401 42501` | CWE-284, OWASP ASVS §4.2.1 | ✅ |
| 7 | PATCH anon `products` UUID-cero | `204` (débil) | discriminado vía FL-2 | CWE-284 | ⚠️ FL-2 |
| 8 | DELETE anon `stock_reservations` UUID-cero | `204` (débil) | discriminado vía FL-2 | CWE-284, CWE-400 | ⚠️ FL-2 |
| 9 | SELECT service_role `products` | `200` + 6 rows | `200` + 6 rows | — | ✅ |
| 10 | PATCH service_role `products` no-op | `200`, stock intacto, trigger bump | idem | — | ✅ |

**Conclusión del baseline**:

- `orders`, `order_items`, `customers`: cerradas por default-deny nativo de
  Postgres (RLS enabled + sin policy) aun antes del 0002. El 0002 agrega el
  `deny_all` explícito como documentación y defensa en profundidad.
- `stock_reservations`: el 0001 contiene tres policies `USING (true)` /
  `WITH CHECK (true)` para SELECT, INSERT y DELETE anónimos (líneas 143–153
  del 0001). Los tests #5 y #8 fueron débiles para demostrarlo con datos
  reales, pero la inspección del SQL confirma la apertura. El 0002 revoca
  estas policies y reemplaza con `reservations_deny_all`, canalizando todo
  acceso vía las RPCs `SECURITY DEFINER`.
- `products`: catálogo público vía `products_public_read` (intencional). No
  hay policy de escritura — cerrado por default-deny. FL-2 lo confirmará
  post-migración.
- Writes de service_role y triggers `BEFORE UPDATE` operativos pre-0002 (#10).

---

## Hipótesis de ataque cubiertas

Esta sección enumera los ataques concretos que el Bloque 2 intenta cerrar y
mapea cada uno al test y a la mitigación específica.

### H1 · Enumeración masiva de `orders` por anon

**Escenario**: un atacante con la anon key (que es pública por diseño — se
embebe en el bundle del cliente) hace `GET /rest/v1/orders?select=*` para
dumpear todos los pedidos y extraer patrones de consumo, precios internos,
o PII de clientes (nombre, teléfono snapshot).

**Test baseline**: #2 → `200 []`. Cerrado por default-deny nativo de Postgres
(RLS enabled + sin policy de SELECT para anon).

**Mitigación adicional en 0002**: policy `orders_deny_all` explícita + tests
de INSERT/UPDATE/DELETE con la misma default-deny.

**Ref**: CWE-200 (sensitive info exposure), CWE-284 (improper access control),
OWASP ASVS v4.0.3 §4.2.1.

### H2 · IDOR vía `/pedido/[id]` por adivinación o forward de link

**Escenario**: el cliente recibe un link `/pedido/<uuid>` por WhatsApp. Ese
link se forwardea accidentalmente a un grupo familiar, queda en el historial
de un PC compartido en un cyber, o lo filtra un `Referer` cuando el cliente
clickea un link saliente desde la página de su propio pedido. Un tercero con
el link ve el pedido completo.

**Mitigación 0002** (aplicada en este commit):
- Columna `orders.access_token` (256-bit, base64url) con TTL de 30 días
  vía `orders.access_token_expires_at`.
- Función admin `fn_rotate_order_access_token(uuid)` que corta la ventana de
  reuso al cambiar el pedido a estado terminal.

**Mitigación pendiente en Bloque 2 parte C** (refactor `/pedido/[id]`):
- Server component valida el token en Node con `crypto.timingSafeEqual`
  (NO en SQL, para no exponer timing side-channel bajo carga).
- `Referrer-Policy: no-referrer` en el route handler para evitar leakage del
  token vía `Referer` a links salientes (mitigación Barth/Jackson/Mitchell 2008).
- PII masking: `customer_phone` enmascarado (`+56 9 **** 1234`), `notes`
  sanitizadas antes de render.
- `Cache-Control: private, no-store, no-cache, must-revalidate` en el response.
- Audit log de cada GET exitoso en `audit_log_order_views` con `ip_hash`,
  `user_agent_hash`, `referer_host`.

**Ref**: CWE-639 (IDOR), CWE-208 (timing side-channel), CWE-200,
OWASP ASVS §3.4, §8.3, NIST SP 800-63B §5.1.1.2,
Barth/Jackson/Mitchell 2008 (Referer leakage).

### H3 · Dump de PII de `customers` por anon

**Escenario**: un atacante hace `GET /rest/v1/customers` para extraer phone,
name, total_spent de todos los clientes históricos — útil para spam dirigido,
doxxing, o perfilado comercial.

**Test baseline**: #4 → `200 []`. Cerrado por default-deny nativo.

**Mitigación 0002**: policy `customers_deny_all` explícita. Writes via
`fn_place_order` (`SECURITY DEFINER`), reads via service_role hasta Bloque 6
(tabla `admins`).

**Ref**: CWE-200, GDPR art. 5(1)(c) (minimization como standard técnico),
OWASP ASVS §4.2.1.

### H4 · Tamper de `products` por anon (precio, stock)

**Escenario**: un atacante (competidor, cliente descontento) hace
`PATCH /rest/v1/products?id=eq.<real>` para cambiar el precio de un producto
a $1 o borrar todo el stock_kg y romper la tienda sin hacer ruido.

**Test baseline**: #7 → `204` ambiguo (UUID-cero no matchea ninguna fila).
**Test inadecuado** — FL-2 lo convertirá en determinista.

**Mitigación 0002**: `products_deny_writes` explícita. Postgres RLS combina
con OR las policies permissive; `products_public_read` sigue permitiendo
SELECT, pero no hay ninguna policy permissive para INSERT/UPDATE/DELETE, o
sea queda cerrado por ausencia (default-deny) y el `deny_writes` es
documentación reforzada del intent. service_role bypasea todo.

**Ref**: CWE-284, OWASP ASVS §4.2.1.

### H5 · Hijacking de `search_path` en funciones `SECURITY DEFINER` (CVE-2018-1058)

**Escenario**: un atacante con capacidad de crear objetos en `pg_temp` o en
un schema accesible en el `search_path` crea una tabla o función shadow que
intercepta referencias no calificadas dentro de `fn_place_order` o
`fn_reserve_stock`. Por ejemplo, una tabla falsa `products` en `pg_temp` que
fuerza el RPC a tomar datos controlados por el atacante. Esto es
particularmente peligroso en funciones `SECURITY DEFINER` porque corren con
los permisos del owner de la función.

**Mitigación 0002**: `SET search_path = public, pg_temp` en cada función
`SECURITY DEFINER` (`fn_b64url`, `fn_audit_log_immutable`, `fn_audit_write`,
`fn_log_order_view`, `fn_rotate_order_access_token`, `fn_reserve_stock`,
`fn_release_expired_reservations`, `fn_place_order`). Al pinarlo a
`public, pg_temp` en ese orden, Postgres resuelve referencias en `public`
primero y solo cae a `pg_temp` si no las encuentra.

**Test baseline**: no testable desde REST (requiere ejecución SQL arbitraria
en Postgres). El fix es **preventivo** y documentado en el commit
`7a87a84` + este audit.

**Ref**: CVE-2018-1058, Postgres docs "Writing SECURITY DEFINER Functions Safely".

### H6 · Stock reservation griefing vía DELETE anon en `stock_reservations`

**Escenario**: un atacante con la anon key hace
`DELETE /rest/v1/stock_reservations` (con o sin WHERE amplio) para borrar
reservas activas del sistema. Dos variantes:

1. **DoS de checkout**: borrar todas las reservas vivas hace que clientes
   en medio de un checkout pierdan su hold y reciban "stock insuficiente" al
   confirmar, forzando abandono del carrito. Aplicable a toda la tienda a la
   vez si la policy deja DELETE abierto.
2. **Griefing selectivo pre-compra**: un atacante borra específicamente las
   reservas de productos low-stock (ej. `almendra-entera` con `stock_kg=1.000`)
   justo antes de disparar su propio `fn_place_order`, inflando la
   disponibilidad virtual y asegurándose de ganar la carrera contra clientes
   legítimos que estaban holdeando la última unidad.

**Test baseline**: #8 → `204` con UUID-cero. **Test débil** — no pudimos
discriminar entre "policy permite + 0 filas matchean" vs "policy bloquea"
con el WHERE-cero. Sin embargo, la inspección literal del SQL del 0001
(líneas 151–153) confirma `reservations_delete_session USING (true)`, o sea
la policy **sí permite DELETE anónimo**. El ataque es ejecutable hoy; solo
necesita reservas vivas para producir daño observable.

**Mitigación 0002** (aplicada en `supabase/migrations/0002_rls_hardening.sql`):

1. Revoca las tres policies abiertas del 0001:
   - `reservations_insert_anon`
   - `reservations_select_session`
   - `reservations_delete_session`
2. Reemplaza con `reservations_deny_all FOR ALL USING (false) WITH CHECK (false)`
   como baseline default-deny.
3. Todas las operaciones sobre `stock_reservations` pasan por las RPCs
   `SECURITY DEFINER` ya pinned con `search_path = public, pg_temp`:
   - `fn_reserve_stock(p_session_id, p_product_id, p_qty)` — inserta/actualiza
     reservas respetando el aislamiento por `session_id` (solo cuenta reservas
     de OTRAS sesiones para calcular disponibilidad).
   - `fn_place_order(...)` — limpia reservas expiradas + crea el order +
     limpia las de la sesión actual.
   - `fn_release_expired_reservations()` — solo borra `expires_at <= now()`,
     nunca reservas vivas.
4. El anon tiene `GRANT EXECUTE` solo sobre esas 3 funciones. No puede tocar
   la tabla directamente — ni leer reservas ajenas, ni borrar nada fuera de
   los flujos de negocio.

**Post-migration verification**: FL-2 (`Prefer: return=representation`) va a
discriminar en el after-run si el DELETE anónimo devuelve `401 42501`
(RLS bloquea) en vez del `204` ambiguo actual.

**Ref**: CWE-284 (improper access control), CWE-400 (resource exhaustion /
DoS a nivel de business logic), OWASP ASVS v4.0.3 §4.2.1, §11.1.5 (abuse of
business logic — protección de stock hold).

---

## Follow-ups (NO se aplican en este commit)

### FL-1 · Test determinista para `stock_reservations` anon read

**Problema**: el test #5 actual retorna `200 []` por ausencia de datos en el
momento del test (TTL 15 min expiró todas las reservas), no por cierre de
policy. La policy del 0001 `reservations_select_session USING (true)` está
efectivamente abierta — cualquier anon puede leer TODAS las reservas vivas.

**Diseño del test determinista para aplicar en el after-migration**:

```bash
SESSION_ID="baseline_fl1_$(openssl rand -hex 8)"   # anotar literal en el audit
PRODUCT_ID="<uuid válido del #9>"

# 1. Insertar reserva con service_role (datos controlados, NO afectan flujo real)
curl -X POST "$URL/rest/v1/stock_reservations" \
  -H "apikey: $SRV" -H "Authorization: Bearer $SRV" \
  -H "Content-Type: application/json" \
  -d "{\"product_id\":\"$PRODUCT_ID\",\"session_id\":\"$SESSION_ID\",\"qty\":0.001}"

# 2. Leer como anon
#    Pre-0002: DEBE devolver la fila (policy abierta = fuga confirmada).
#    Post-0002: DEBE devolver [] (default-deny) o 42501.
curl "$URL/rest/v1/stock_reservations?select=*&session_id=eq.$SESSION_ID" \
  -H "apikey: $ANON" -H "Authorization: Bearer $ANON"

# 3. Limpiar con service_role
curl -X DELETE "$URL/rest/v1/stock_reservations?session_id=eq.$SESSION_ID" \
  -H "apikey: $SRV" -H "Authorization: Bearer $SRV"
```

**Pendiente**: agregar como paso explícito al plan del after-migration con
OK previo del usuario antes de ejecutar (modificación controlada de datos
reales, aunque sea efímera).

### FL-2 · Discriminación de #7 y #8 vía `Prefer: return=representation`

**Problema**: `return=minimal` sobre `PATCH`/`DELETE` que matchean 0 filas
hace que `204 No Content` sea ambiguo entre "RLS bloqueó" y "WHERE matcheó
0 filas".

**Fix propuesto** (aplicar en el re-run post-migración de #7 y #8):

```diff
- Prefer: return=minimal
+ Prefer: return=representation
```

Con ese cambio:
- Si RLS bloquea → `401 42501` (como #6).
- Si WHERE matchea 0 filas → `200 []`.

No requiere cambiar los UUIDs ni los WHERE; solo el header. Aplica a #7 y #8
de forma idéntica.

### FL-3 · Integridad del descuento de packs (FUERA DE SCOPE DEL BLOQUE 2)

**⚠️ Hallazgo lateral con exposición legal. Requiere plan propio "Bloque 2.5".**

**Descripción del bug**: los 3 "packs" mostrados en la home
(`Pack Pica`, `Pack Dulce`, `Pack Proteína`) anuncian un precio con descuento
y un `oldPrice` tachado, pero el descuento **nunca se aplica**. Cuando el
cliente clickea "Agregar pack", el componente agrega los 2 productos base
independientemente al carrito, y el cliente termina pagando el `oldPrice`
(la suma de los 2 SKUs base a precio completo), no el `price` anunciado.

**Evidencia literal** (line numbers verificados contra commit de este audit):

1. `components/Combos.tsx:74-79` — `addCombo` descarta toda información del
   combo antes de llegar al store:

   ```tsx
   const addCombo = async (combo: ComboConfig) => {
     const a = products.find((p) => p.slug === combo.slugA);
     const b = products.find((p) => p.slug === combo.slugB);
     if (a) await addItem(a, 1);
     if (b) await addItem(b, 1);
   };
   ```
   Ni `combo.price`, ni `combo.oldPrice`, ni `combo.id` cruzan el límite del
   componente.

2. `lib/cart-context.tsx:16-20` — el shape del state del carrito es plano,
   sin marker de combo:

   ```tsx
   interface CartState {
     items: Record<string, number>; // productId -> kg
     sessionId: string;
     reservationExpiry: number | null; // timestamp ms
   }
   ```

3. `lib/cart-context.tsx:109-123` — `addItem` solo stora cantidad por
   `productId`:

   ```tsx
   const addItem = useCallback(async (product: Product, qty: number) => {
     let nextQty = 0;
     let sid = "";
     setState((s) => {
       sid = s.sessionId;
       nextQty = (s.items[product.id] ?? 0) + qty;
       return { ...s, items: { ...s.items, [product.id]: nextQty } };
     });
     bumpExpiry();
     trackAddToCart(...);
     if (sid) await reserveStock(sid, product.id, nextQty);
   }, [bumpExpiry]);
   ```

4. `lib/cart-context.tsx:156-163` — `totalPrice` es suma pura sin detección
   de combos:

   ```tsx
   const totalPrice = useCallback(
     (products: Product[]) =>
       Object.entries(state.items).reduce((sum, [id, kg]) => {
         const p = products.find((x) => x.id === id);
         return sum + (p ? p.price * kg : 0);
       }, 0),
     [state.items]
   );
   ```

5. `lib/actions.ts:93-96` — `placeOrder` computa total sumando `p.price *
   item.qty`, sin descuento:

   ```ts
   const total = params.items.reduce((acc, item) => {
     const p = products.find((x) => x.id === item.product_id);
     return acc + (p ? p.price * item.qty : 0);
   }, 0);
   ```

6. `supabase/migrations/0001_init.sql:299-303` — el RPC SQL replica la suma
   plana y la guarda en `orders.total`:

   ```sql
   update products set stock_kg = stock_kg - v_qty where id = v_product_id;

   v_item_sub := (v_price * v_qty)::int;
   v_subtotal := v_subtotal + v_item_sub;
   end loop;
   ```

7. Grep ampliado por `combo.price`, `combo.oldPrice`, `pack_pica`,
   `pack_dulce`, `pack_proteina`, `discount`, `descuento` fuera de
   `Combos.tsx` devuelve **cero matches** en código de negocio
   (`cart-context.tsx`, `actions.ts`, `0001_init.sql`, `0002_rls_hardening.sql`,
   `lib/products.ts`). Las únicas apariciones de `combo.price` /
   `combo.oldPrice` son en `components/Combos.tsx:104-105, 178-179` —
   exclusivamente el render visual de la card.

8. No existe `app/checkout/` (`Glob "app/checkout*" → 0 files`). El checkout
   va directamente de `Drawer.tsx` a `placeOrder` sin un paso intermedio de
   cálculo de descuentos.

**Impacto comercial** (asumiendo precios del commit base):

| Pack | Precio anunciado | Precio cobrado | Sobrecargo | "Ahorro" anunciado |
|---|---:|---:|---:|---:|
| Pica | $17.500 | $18.990 | +$1.490 | "Ahorrás $1.490" (falso) |
| Dulce | $17.000 | $18.490 | +$1.490 | "Ahorrás $1.490" (falso) |
| Proteína | $27.000 | $29.000 | +$2.000 | "Ahorrás $2.000" (falso) |

**Exposición legal (Chile)**: Ley 19.496 de Protección al Consumidor,
arts. 28-33 (información veraz y comprobable, publicidad engañosa). Sernac
puede abrir expediente ante una denuncia; las multas son en UTM y pueden
ser relevantes. Asume buena fe (el bug parece no intencional) pero igual
constituye publicidad engañosa técnicamente.

**Mitigación recomendada (NO aplicada en este commit)**:

- **Opción A (mínima, solo UI — fix en ~10 min, cero riesgo legal)**: remover
  el precio tachado (`oldPrice`) y el badge "Ahorrás $X" / "-Y%" de las cards
  de `Combos.tsx` hasta que la lógica real esté implementada. Los packs
  quedan como "sugerencia de combinación" sin claim de descuento. Archivos
  afectados: `components/Combos.tsx:177-183` (eliminar los 3 spans del precio
  viejo y ahorro) + `components/Combos.tsx:104-105` (remover el cálculo de
  `save` y `pct`). Cero riesgo de regresión funcional — el flujo del carrito
  y checkout queda exactamente igual porque el precio "con descuento" nunca
  se usaba en cálculo. **Recomendado para deploy urgente antes de cualquier
  cliente nuevo.**

- **Opción B (combo virtual en carrito — semana de trabajo)**: extender
  `CartState` con `appliedDiscounts: Array<{comboId, amount, requiresSlugs}>`
  para trackear qué combos están activos según los items presentes. Cambiar
  `totalPrice` a descontar el `amount` cuando los `requiresSlugs` están
  presentes. Cambios correlacionados: agregar columna `discount_total int`
  a `orders`, nuevo parámetro `p_discounts jsonb` a `fn_place_order`, lógica
  SQL para validar y aplicar los descuentos atómicamente, UI del carrito
  que muestre el descuento aplicado. Requiere migración 0003 y refactor del
  server action.

- **Opción C (SKU de combo en DB — cambio de modelo grande)**: crear filas
  `products` para cada pack con su propio precio y stock derivado, y lógica
  de descomposición en `fn_place_order` que descuente stock de los 2 SKUs
  base cuando se compra un pack. Requiere pensar el concepto de "bundle" /
  "composite_product" como primer ciudadano del schema. Afecta admin UI
  (edición de stock: ¿se edita el pack o los base?), analytics (¿cómo cuenta
  un "venta de pack" en el reporte por producto?), y display en el catálogo.
  Mayor cambio conceptual.

**Recomendación para el Bloque 2.5**: **Opción A ahora** (deploy urgente,
cierra exposición legal en minutos); **Opción B después** (plan completo con
tests y audit propio). **Opción C** solo si el modelo de negocio justifica
tratar los packs como SKUs independientes (probablemente no para una tienda
de ~6 productos).

**Status**: **no resuelto**, **requiere plan propio post-Bloque 2**
("Bloque 2.5 — Integridad de descuentos en carrito").

---

## Hallazgos laterales

### Diagnóstico complementario — modelo de datos de packs

Durante la investigación del FL-3 se ejecutaron 2 curls adicionales para
descartar que los packs existieran como filas en `products` ocultas por
filtros implícitos. Resultados:

#### #11 · SELECT service_role `products` ORDER BY slug (descarta `sort_order IS NULL`)

```
GET /rest/v1/products?select=id,slug,name,stock_kg,sort_order&order=slug
Headers: apikey / Authorization = service_role

→ HTTP/2 200
  content-range: 0-5/*
  sb-request-id: <REDACTED-18>

[6 rows, ordered by slug]
  almendra-entera            sort_order=6  stock_kg=1.0
  chuby-bardu                sort_order=4  stock_kg=5.0
  gomita-osito-docile        sort_order=5  stock_kg=5.0
  mani-confitado-rojo        sort_order=3  stock_kg=5.0
  mani-confitado-tropical    sort_order=2  stock_kg=5.0
  mix-europeo                sort_order=1  stock_kg=5.0
```

Mismas 6 filas que #9, ordenadas por slug. Descarta la hipótesis de que
haya filas con `sort_order IS NULL` ocultas por el ORDER BY del #9.

#### #12 · COUNT exact `products`

```
GET /rest/v1/products?select=id
Headers: apikey / Authorization = service_role
        Prefer: count=exact

→ HTTP/2 200
  content-range: 0-5/6
  sb-request-id: <REDACTED-19>
```

El `content-range: 0-5/6` confirma que `products` tiene **exactamente 6 filas
totales**, sin paginado oculto.

**Conclusión**: los 3 packs mostrados en `/` **no existen como filas** en
`products`; son un componente presentacional (`components/Combos.tsx`) que
compone SKUs reales vía `slugA` + `slugB`. Confirmado por:
- `count=exact = 6`
- Grep negativo por `pack-*` en seeds / migrations / `lib/products.ts`
- Lectura literal de `components/Combos.tsx:22-65` (array `COMBOS`
  hardcodeado)

**No es scope del Bloque 2**. Ver **FL-3** arriba para el bug de integridad
del descuento que esta investigación destapó.

---

## Housekeeping

- **`/tmp/rls_baseline.txt`**: contiene el raw de los 12 curls con UUIDs
  reales de productos y `sb-request-id` literales. **No contiene keys** (ni
  anon ni service_role) — las keys solo existen en variables de entorno
  durante la ejecución del script, nunca fueron redirigidas al archivo.
  **Borrar con `rm -P /tmp/rls_baseline.txt` al cierre completo del
  Bloque 2 (después del after-migration run).**
- **`.env.local`**: queda durante toda la sesión del Bloque 2.
  **Borrar con `rm -P .env.local` al cierre del Bloque 2.**
- Ambos archivos están cubiertos por `.gitignore` (Bloque 1 + setup): cero
  riesgo de commit accidental.
- Commits base del audit en rama `hardening/round-1`:
  - `ece94a6` — fail-closed cron auth, timing-safe compare (Bloque 1)
  - `7a87a84` — migración 0002 escrita, sin aplicar (Bloque 2 parte A)
  - `5eba0db` — setup Claude Code protocol, hooks, subagents (cherry-picked)

## Próximo paso

1. Aplicar `supabase/migrations/0002_rls_hardening.sql` vía Supabase
   Dashboard → SQL Editor. **Lo ejecuta el operador, no el agente.** El
   agente espera confirmación explícita "aplicada OK".
2. Re-correr #1 – #10 + FL-1 + FL-2 como "after-migration" con los ajustes
   discriminatorios aplicados. Capturar outputs en una nueva sección
   `## After — resultados literales` de este documento.
3. Completar resumen con antes/después y check de mitigaciones cumplidas.
4. Commit + push (autorización explícita separada).
5. Bloque 2 parte C: refactor de `app/pedido/[id]/page.tsx` con
   access_token, masking, audit log (plan nuevo).
6. Fuera del Bloque 2: abrir **Bloque 2.5** para FL-3 con plan propio.
