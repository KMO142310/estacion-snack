# DEPLOY.md — Runbook de despliegue a producción

**Sitio**: `https://www.estacionsnack.cl`
**Hosting**: Vercel
**Repo**: `KMO142310/estacion-snack`
**Rama de producción**: `main` (push automático = deploy).

Este documento es el playbook que se sigue para llevar cualquier cambio al sitio en vivo. Está pensado para que cualquier persona (incluyendo Omar 6 meses después de no tocar el código) pueda seguirlo paso a paso.

---

## 1. Reglas de oro

1. **Nunca commit directo a `main`.** Siempre branch + PR.
2. **Nunca push a `main` sin CI verde.** El CI corre lint + typecheck + tests + build + Playwright E2E.
3. **Push a `main` = deploy a producción.** Vercel tira el deploy en 1-2 min sin intervención manual.
4. **Cada PR tiene Vercel preview URL.** Validar la preview antes de mergear si el cambio es visible al cliente.
5. **Smoke post-deploy obligatorio.** Después de cada merge, verificar que prod responde 200 con el commit nuevo.

---

## 2. Flujo estándar (paso a paso)

### A. Preparar el cambio

```bash
cd "/Users/omaralexis/Desktop/⛩️/Frutos secos/estacion-snack"
git checkout main
git pull origin main
git checkout -b feat/<scope>            # o fix/, chore/, docs/
```

### B. Hacer el cambio + verificar localmente

```bash
# 1) Editar archivos
# 2) Verificar que compila y los tests pasan
npx tsc --noEmit                        # typecheck
npm run lint                            # eslint
npm test                                # vitest unit tests
npm run build                           # next build (genera el bundle prod)

# 3) (Opcional para cambios visuales) smoke local
npm run dev                             # arranca en localhost:3000
# abrir http://localhost:3000 y verificar
```

### C. Reviewer subagent + commit

```bash
# Llamar al subagente reviewer (en Claude Code) antes del commit:
# Task(subagent_type: "reviewer", prompt: "Revisa el diff staged...")

git add <archivos específicos>          # NO uses git add -A sin revisar
git status                              # confirmar qué se va a commitear
git diff --cached                       # leer el diff completo

# Commit con mensaje en imperativo corto + co-author Claude:
git commit -m "$(cat <<'EOF'
<tipo>(<scope>): <título corto>

<cuerpo opcional con el why>

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

**Tipos de commit**: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`.

### D. Push + PR

```bash
git push -u origin feat/<scope>

gh pr create --base main --head feat/<scope> --title "<tipo>: título" --body "$(cat <<'EOF'
## Summary
- bullet 1
- bullet 2

## Test plan
- [x] npx tsc --noEmit
- [x] npm run lint
- [x] npm test
- [x] npm run build
- [ ] Smoke en Vercel preview
- [ ] Smoke post-deploy en prod
EOF
)"
```

### E. Esperar CI verde

```bash
gh pr checks <NUMERO> --watch --interval 15
```

Los checks que deben pasar:
- `lint · typecheck · unit · build` (45-60 segundos)
- `e2e (playwright)` (1-2 minutos)
- `Vercel` (deploy preview)
- `Vercel Preview Comments` (auto)

### F. (Opcional) Validar Vercel preview

Si el cambio es visible al cliente, abrir la URL del Vercel preview en el comment del PR y hacer smoke manual:
- Home renderiza
- Click en producto → modal abre
- Click "Agregar al carro" → badge actualiza
- Click cart icon → sheet abre
- Click "Pasar a WhatsApp" → URL se construye correctamente

### G. Merge

```bash
gh pr merge <NUMERO> --squash --delete-branch
```

Flags:
- `--squash`: convierte todos los commits del branch en un único commit en `main`. Mantiene `main` limpio.
- `--delete-branch`: borra la rama local y remota tras mergear.

### H. Esperar deploy de Vercel + smoke en prod

Vercel tarda 1-2 min en desplegar el commit nuevo a `main`. Esperar y verificar:

```bash
# Esperar hasta que /api/health reporte el commit nuevo:
NEW_COMMIT=$(git rev-parse --short main)
until curl -sf "https://www.estacionsnack.cl/api/health" | grep -q "\"commit\":\"$NEW_COMMIT\""; do
  sleep 10
done
echo "✓ Prod actualizado a $NEW_COMMIT"
```

O usar la skill `/smoke` de Claude Code que corre los 4 curls estándar.

### I. Smoke completo en prod (los 4 que importan)

```bash
SITE="https://www.estacionsnack.cl"

# 1. Health
curl -sw "\nHTTP %{http_code}\n" "$SITE/api/health" | tail -3

# 2. OG image sin params (espera 400)
curl -sw "→ HTTP %{http_code}\n" "$SITE/api/og/order-confirmation" -o /dev/null

# 3. Endpoint del agente con body inválido (espera 400)
curl -sw "→ HTTP %{http_code}\n" -X POST "$SITE/api/agent/chat" \
  -H "Content-Type: application/json" -d '{}' -o /dev/null

# 4. Admin asistente sin auth (espera 307 → /admin/login)
curl -sw "→ HTTP %{http_code}\n" "$SITE/admin/asistente" -o /dev/null
```

Resultado esperado:
- `/api/health` → 200 con `"status":"ok"` y commit nuevo
- `/api/og/order-confirmation` → 400 (validación funciona)
- `/api/agent/chat` → 400 (Zod rechaza body inválido)
- `/admin/asistente` → 307 (gate de auth funciona)

---

## 3. Variables de entorno en Vercel

El sitio depende de estas env vars. Si alguna falta, `/api/health` reporta `503`.

### Críticas (sin estas el sitio no funciona)

| Variable | Para qué |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth pública de Supabase |
| `NEXT_PUBLIC_SITE_URL` | URL canónica del sitio (usado en SEO + OG images) |
| `ADMIN_EMAIL` | Email único que puede acceder a `/admin` |
| `CRON_SECRET` | Bearer para `/api/cron/release-reservations` |
| `AUDIT_PEPPER` | Pepper para hashear IPs en audit logs |

### Opcionales (si faltan, features puntuales no funcionan)

| Variable | Sin ella |
|----------|----------|
| `RESEND_API_KEY` | Form de contacto no envía email (falla silencioso) |
| `NEXT_PUBLIC_GA4_ID` | No hay analytics |
| `NEXT_PUBLIC_META_PIXEL_ID` | No hay tracking de Facebook |
| `ANTHROPIC_API_KEY` | El agente conversacional `/admin/asistente` no responde |
| `UPSTASH_REDIS_REST_URL` + `_TOKEN` | El endpoint público `/api/agent/chat` no tiene rate limit (fail-open) |
| `OWNER_WHATSAPP` | Notificación al operador cae a default `56953743338` hardcodeado |
| `ANTHROPIC_MODEL` | Modelo del agente cae al default `claude-sonnet-4-6` |

### Cómo agregar/cambiar una env var

Solo Omar puede hacer esto (requiere autenticación con Vercel):

```bash
# Desde el directorio del proyecto:
vercel env add ANTHROPIC_API_KEY production
# pegar el valor cuando pregunte
```

Después de agregar/cambiar env vars, **redeploy es necesario** para que tomen efecto:

```bash
vercel deploy --prod
```

O empujar un commit dummy a `main` para gatillar redeploy automático.

---

## 4. Rollback (si algo sale mal en prod)

### Opción A — Revertir el commit problemático

```bash
git checkout main
git pull origin main
git revert <SHA-malo> --no-edit
git push origin main
```

Esto crea un commit nuevo que deshace el problemático. Vercel desplegará el revert en 1-2 min. Sin pérdida de history.

### Opción B — Promover deploy anterior (Vercel UI)

1. Abrir [Vercel Dashboard](https://vercel.com/oas-projects-3f65b2b2/estacion-snack/deployments).
2. Encontrar el último deploy bueno (anterior al problema).
3. Click `...` → "Promote to Production".

Esto es instantáneo (segundos) pero NO actualiza `git`. Solo sirve como medida de emergencia hasta que se arregle el código.

---

## 5. Casos especiales

### Cambios visuales (UI)
- **Llamar al subagente `designer` antes de tocar código** si la decisión visual es no trivial.
- Validar la **Vercel preview URL** del PR antes de mergear.
- Confirmar mobile + desktop con DevTools.

### Cambios de catálogo (precios, productos, packs)
- **Llamar al subagente `catalog-curator`** — sabe el shape exacto de `data/products.json` + `data/packs.json` y verifica coherencia.
- Correr la skill `/precio` para validar que los packs no tengan ahorro irreal.
- Correr la skill `/stock` si el cambio afecta inventario.

### Cambios al agente conversacional
- **Llamar al subagente `prompt-eng`** para iterar `lib/agent/system-prompt.ts`.
- Correr la skill `/agent-eval` (requiere `ANTHROPIC_API_KEY` local) para validar regression.
- Llamar al subagente `op-coach` para simular 20 prompts del operador.

### Cambios al schema de Supabase (migrations)
- **NUNCA aplicar una migration sin un audit forense**. Ver `SECURITY_AUDIT.md` si existe.
- Aplicar migration en staging primero (si existe) o en prod con backup hecho.
- Documentar la migration en el commit message.

---

## 6. Estado actual de prod (snapshot)

**Última actualización**: 2026-04-26

| Componente | Estado | Última versión |
|------------|--------|----------------|
| Sitio público (`/`, `/producto/*`, `/envios`) | 🟢 Vivo | `e09c2b9` (visual warmth Colchagua) |
| Endpoint `/api/health` | 🟢 200 ok | — |
| Endpoint `/api/agent/chat` (público) | 🟡 Funcional sin rate limit | Falta Upstash en Vercel |
| Endpoint `/api/og/order-confirmation` | 🟢 Funcional | — |
| `/admin/asistente` (chat conversacional) | 🟡 UI carga, bot no responde | Falta `ANTHROPIC_API_KEY` en Vercel |
| `/admin` panel operador | 🟢 Funcional | — |

**Acción humana pendiente** (solo Omar puede hacerla):
1. `vercel env add ANTHROPIC_API_KEY production` para activar el agente.
2. Crear DB en `console.upstash.com` y `vercel env add UPSTASH_REDIS_REST_URL/_TOKEN production` para activar rate limit del endpoint público.

---

## 7. Checklist condensado (cuando ya se sabe el flujo)

```
[ ] git pull origin main
[ ] git checkout -b <branch>
[ ] cambios + tests locales (typecheck + lint + test + build)
[ ] reviewer subagent
[ ] commit + push
[ ] gh pr create
[ ] esperar CI verde (gh pr checks --watch)
[ ] (visual) revisar Vercel preview
[ ] gh pr merge --squash --delete-branch
[ ] esperar deploy Vercel (1-2 min)
[ ] smoke en prod (4 curls)
[ ] cerrar bloque + reportar al usuario
```

---

## Anexo — Por qué este runbook existe

El usuario pidió 2026-04-26: *"production/DEPLOY.md ejecuta eso que hizo claude design y deploya a vercel después de testear"*. El designer agent ya había propuesto y aplicado las 5 mejoras visuales (D-01 a D-05) en el PR #24. Este documento formaliza el flujo para que cualquier deploy futuro siga el mismo patrón sin tener que recordar los pasos.
