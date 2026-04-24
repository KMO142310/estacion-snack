# ADR 0002 — Row-Level Security como frontera primaria de autorización

**Fecha:** 2026-04-24
**Estado:** Aceptado
**Supersede:** —
**Superseded by:** —

## Contexto

Estación Snack expone un catálogo público de productos y un flujo de pedido que escribe en tablas sensibles (`orders`, `customers`, `order_items`, `stock_reservations`, `audit_log`). El operador único accede a `/admin` con magic link; los clientes no tienen cuentas.

Había que decidir **dónde vive la frontera de autorización**:

| Opción | Dónde se decide "¿puede X acceder a Y?" |
|---|---|
| A — App-layer | Server actions + middleware. La DB confía en el servidor. |
| B — RLS con `default-deny` | Postgres rechaza por default; policies específicas habilitan acceso. El servidor envía JWT y la DB decide. |
| C — Híbrido "belt + suspenders" | Checks en ambos lados, redundantes. |

### Modelo de amenaza relevante

- **SUPABASE_SERVICE_ROLE_KEY comprometida**: si el atacante obtiene la key, en opción A puede hacer lo que quiera; en B tiene bypass de RLS pero no de los triggers de inmutabilidad (audit log) ni de funciones `SECURITY DEFINER`.
- **Inyección en server action**: parámetros mal sanitizados podrían llegar a Postgres; con RLS `default-deny`, aun si la query construye bien pero el caller no tiene policy, se rechaza.
- **Server action con bug lógico**: por ejemplo, olvidar el `WHERE user_id = ?` en una lista de pedidos. Con RLS, la DB aplica el filtro aunque el server no lo haga.
- **Acceso directo al REST API de Supabase** con anon key: sin RLS sería lectura/escritura libre. Con RLS, es equivalente a no tener acceso.

## Decisión

**Opción B: RLS con `default-deny` en todas las tablas**, con service role usado solo como "escape hatch" centralizado.

Reglas operativas:

1. Toda tabla nace con `ALTER TABLE x ENABLE ROW LEVEL SECURITY;` inmediatamente después del `CREATE`.
2. Policies `FOR SELECT / INSERT / UPDATE / DELETE` explícitas. Sin policies = negado.
3. Operaciones que necesitan ignorar RLS (cron, admin, mutaciones atómicas) viven en funciones `SECURITY DEFINER` con `SET search_path = public, pg_temp` (mitiga CVE-2018-1058).
4. Service role client existe **exclusivamente** en [`lib/supabase/admin.ts`](../../lib/supabase/admin.ts). Cualquier import fuera de ese archivo es bloqueado por el pre-commit hook.
5. Todo path que usa service role pasa primero por `assertAdmin()` ([`lib/auth/assert-admin.ts`](../../lib/auth/assert-admin.ts)) que valida `user.email === ADMIN_EMAIL`.

### Policies de referencia

```sql
-- products: lectura pública, escritura solo service_role (admin)
CREATE POLICY products_public_select ON products
  FOR SELECT TO anon, authenticated
  USING (is_active IS DISTINCT FROM false);

-- orders / customers / order_items / audit_log / stock_reservations:
-- NO policies for anon. Inserts/updates ocurren via SECURITY DEFINER functions
-- llamadas desde server actions ya gateadas.
-- Selects desde el cliente retornan 0 filas (default-deny).
```

La función `fn_place_order` corre como `SECURITY DEFINER`, bypassa RLS **solo dentro de su propio scope**, y no exponemos su output a clientes sin re-verificar con `access_token`.

## Consecuencias

### Positivas

- **Defensa en profundidad.** Un bug en server action, o una service_role_key filtrada, no implica game-over automático. El trigger de inmutabilidad del audit log y las funciones `SECURITY DEFINER` son frontera adicional.
- **Revisable por auditoría forense.** `SECURITY_AUDIT.md` reproduce con `curl` cada policy: baseline (debe denegar) + after (debe permitir solo lo esperado). Es ejecutable, no aspiracional.
- **Minimiza superficie de fuga de datos si se pierde la anon_key.** La anon_key es pública por diseño; con RLS `default-deny`, perderla no es un incidente.
- **Mapping directo a OWASP ASVS v4.0.3 §4.2.1** (access control per resource) y **CWE-862** (missing authorization). Un auditor externo puede cross-referenciar.

### Negativas / costos

- **Curva de aprendizaje.** PL/pgSQL y policies de RLS son más hostiles que un middleware de Express. Requirió inversión inicial.
- **Debugging más engorroso.** Un 403 puede venir de la policy, del `SECURITY DEFINER`, o del server action. Toolkit: `SET ROLE anon` + `\d+ tabla` + `EXPLAIN (ANALYZE, BUFFERS)`.
- **Migrations más largas.** Cada tabla nueva requiere `ENABLE RLS` + policies + tests curl. La migración `0002_rls_hardening.sql` tiene 400+ líneas.
- **Service role como emergencia, no como rutina.** Disciplina humana necesaria para no caer en la tentación de "bypasear con service role" cada vez que hay fricción.

## Alternativas descartadas

### A — Autorización solo en app-layer

Rechazada porque:
- Un bug lógico único (falta un `WHERE`) compromete todo el sistema.
- Service role en múltiples lugares del código es invitación a fuga.
- No hay capa de defensa si la app se compromete (RCE, dependency hijack).

### C — Híbrido con checks en ambos lados

Considerada pero rechazada en la práctica porque:
- Duplica código y riesgo de drift entre ambos.
- El checklist mental al escribir cada server action se vuelve largo.
- RLS ya es la capa autoritativa; duplicar en app no agrega garantías, solo latencia y código.

En cambio, el patrón es: **app-layer valida inputs y shape, DB valida autorización**. Complementarios, no redundantes.

## Verificación

Reproducible con `curl` contra el REST API de Supabase. Ver [`SECURITY_AUDIT.md`](../../SECURITY_AUDIT.md) §3-§7. Snippet de baseline:

```bash
# Como anon, intentar leer orders → debe retornar []
curl -s "$SUPABASE_URL/rest/v1/orders" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" | jq length
# Expected: 0
```

Referencias:
- OWASP ASVS v4.0.3 §4 — Access Control
- NIST SP 800-162 — Attribute-Based Access Control (conceptualmente similar a RLS)
- CWE-862, CWE-863, CWE-639
- Supabase RLS docs: https://supabase.com/docs/guides/auth/row-level-security
