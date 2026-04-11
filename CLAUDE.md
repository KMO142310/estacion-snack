@AGENTS.md

# Estación Snack — Protocolo de trabajo para Claude Code

Este archivo es la fuente de verdad sobre **cómo** Claude Code debe trabajar en este repo. Se carga automáticamente al inicio de cada sesión. **Leé todo antes de tocar una sola línea.**

---

## 1. Stack y contexto

- **Framework**: Next.js 16 + React 19 + Tailwind v4 + TypeScript 5.
- **DB**: Supabase (Postgres 16) con Row-Level Security.
- **Deploy**: Vercel. Dominio prod: `estacionesnack.cl`. Ramas: `main` (prod), `hardening/round-1` (seguridad), `fix/mobile-polish` (UI/UX).
- **Negocio**: tienda online de frutos secos y packs en Santa Cruz, Chile. El operador es el dueño, no un equipo técnico. Cada bug en prod le cuesta plata o confianza de cliente real.
- **Tu rol**: sos un agente autónomo con acceso a shell, filesystem, y git. No sos un chat. Terminá las tareas que empezás o dejá el estado explícito antes de parar.

---

## 2. Modo de trabajo obligatorio

### 2.1 Plan-Execute-Verify, siempre

Para cualquier tarea que implique más de un archivo, o tocar DB, deploy, migraciones, o git: **nunca empezás a ejecutar de entrada**. El flujo obligatorio es:

1. **PLAN**: escribí en el chat un plan explícito con:
   - Supuestos concretos (no "asumo que entendés", sino "asumo que `x` es `y`")
   - Pasos numerados, cada uno con el archivo/comando exacto
   - Riesgos por paso y mitigación
   - Checkpoints donde parás a esperar OK humano
   - Criterio de rollback si algo falla
2. **EXECUTE**: ejecutás paso por paso. Entre cada paso con efecto irreversible (escritura a disco, `git commit`, migración SQL, deploy, cambio de datos reales), **parás** y mostrás qué pasó antes de continuar.
3. **VERIFY**: al cierre, mostrás evidencia concreta de que funcionó (output de tests, diff de git, HTTP status de prod, screenshot, lo que corresponda). No decís "listo" sin evidencia.

No brinques pasos por "ahorrar tokens". El tiempo humano de corregir un error tuyo es 100× el costo de los tokens de hacerlo bien.

### 2.2 Checkpoints obligatorios (parás y esperás OK)

Parás y pedís OK explícito antes de:

- Cualquier `git commit`, `git push`, `git reset --hard`, `git rebase`, `git merge`.
- Cualquier `DELETE`, `DROP`, `TRUNCATE`, `ALTER TABLE` en Supabase.
- Aplicar una migración SQL.
- Tocar cualquier archivo en `app/`, `lib/`, `components/`, o `supabase/migrations/` **si** la tarea actual no es específicamente sobre ese archivo.
- Cambiar variables de entorno o `.env*`.
- Cualquier cambio que afecte `orders`, `customers`, `products`, o `stock_reservations` como datos reales (no schema).
- Publicar / deployar algo a prod.
- Ejecutar cualquier comando que hagas con side effects externos (curl contra APIs reales, envío de mensajes, etc.).

**No** necesitás pedir OK para:
- Lecturas (`cat`, `grep`, `ls`, `git status`, `git log`, `git diff`).
- Correr `tsc --noEmit`, `eslint`, `next build`, tests.
- Escribir a `/tmp/` o al scratchpad dentro de `.claude/scratch/`.
- Editar archivos que sí son scope explícito de la tarea actual (pero mostrás el diff cuando termines).

### 2.3 Usá subagentes en vez del loop humano-middleman

Cuando necesites **revisar tu propio trabajo** (audit, security review, code review de tu diff antes de commit), **lanzá un subagente** con el Task tool en vez de pararlo todo a esperar input humano. Los subagentes disponibles en `.claude/agents/` están hechos exactamente para esto:

- `reviewer` — revisa diffs antes de commit, detecta secrets, regresiones, y violaciones del protocolo.
- Usalo así: `Task(subagent_type: "reviewer", prompt: "Revisá el diff de HEAD vs el commit base del bloque. Buscá: secretos expuestos, líneas que rompan el protocolo de CLAUDE.md, regresiones obvias, tests faltantes, y cualquier cosa que merezca bloquear el commit.")`
- El subagente devuelve un reporte compacto. Vos lo leés, si da OK seguís, si no, corregís y re-ejecutás el subagente.

**El usuario NO es un revisor de código.** Es el aprobador final de acciones irreversibles. No le pidas que revise tu lógica línea por línea — eso es para el subagente.

### 2.4 Cuándo parás y cuándo NO parás

**NO** pares a pedir input humano para cosas que podés resolver vos mismo con una herramienta:
- ¿Existe tal archivo? → `ls`, no preguntes.
- ¿Qué hay en esta función? → `grep` o `Read`, no preguntes.
- ¿El build pasa? → `next build`, no preguntes.
- ¿Cuál es el UUID? → `curl` a la DB, no preguntes si tenés las credenciales.
- ¿Cuál fue el último commit? → `git log -1`, no preguntes.

**SÍ** parás cuando:
- El siguiente paso es irreversible y necesita decisión de negocio.
- Hay ambigüedad sobre la intención del usuario que no podés resolver leyendo el código.
- Descubriste algo que cambia el plan (por ejemplo, un bug lateral que puede ser más urgente que la tarea original).
- Llegaste a un checkpoint del plan.

---

## 3. Seguridad y datos

### 3.1 Secretos

- **Nunca** escribís un valor literal de `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `CRON_SECRET`, ni ninguna otra credencial en un archivo trackeado, commit, log, o mensaje del chat.
- Siempre referenciás via `process.env.X` en código y `$X` en shell, con las vars cargadas desde `.env.local` (gitignored).
- Antes de `git commit` corrés `git diff --cached | grep -iE 'eyJ|sk_|service_role|bearer'` como doble-check. Si hay match, abortás.
- `.env.local` y `/tmp/*.txt` con outputs de curl quedan **fuera de git** siempre. Usá `rm -P` (Linux) o `rm -P` (macOS) para borrar buffers forenses al cierre de cada bloque.

### 3.2 Row-Level Security

- Toda migración nueva en `supabase/migrations/` que toque RLS requiere audit forense siguiendo el formato de `SECURITY_AUDIT.md` (si existe) o el template de `.claude/templates/security-audit.md`.
- Ante cualquier policy nueva, asumí que `SUPABASE_SERVICE_ROLE_KEY` está comprometida y que el atacante conoce el schema entero.
- Tests de RLS con `curl` al REST API de Supabase, nunca con SQL directo desde el cliente.

### 3.3 Datos reales en prod

- No ejecutás UPDATE/DELETE/INSERT contra tablas de prod sin:
  1. Plan aprobado con scope explícito del WHERE clause.
  2. `SELECT ... WHERE ...` previo que muestre exactamente qué filas serán afectadas.
  3. OK del usuario con el count de filas exacto.
  4. Evidencia post-ejecución del cambio.

---

## 4. Git y deploys

- **Ramas**: nunca committeás directo a `main`. Feature branches con prefijo `fix/`, `feat/`, `hardening/`, `chore/`.
- **Commits**: atomic (un commit = un cambio lógico), mensaje en imperativo corto (`fix: block anon delete on stock_reservations`), cuerpo opcional con el *why*.
- **Nunca** `--force`, `--no-verify`, ni `git commit -a` sin ver el diff primero.
- **Antes de commit**: `git status` + `git diff --cached` + subagente `reviewer` + grep de secretos. En ese orden.
- **Push**: solo con OK explícito del usuario. Push a `main` nunca lo hacés vos — siempre lo hace el usuario desde su terminal después de revisar la PR.
- **Deploys a Vercel**: automáticos por push a `main`. Eso significa que un commit a `main` **es** un deploy a prod. Tratalo con el peso correspondiente.

---

## 5. Estructura del repo

```
estacion-snack/
├── app/              # Next.js app router. Rutas, layouts, pages.
├── components/       # React components. No lógica de negocio pesada.
├── lib/              # Lógica de negocio: cart-context, actions, supabase clients, crypto.
├── supabase/
│   ├── migrations/   # SQL migrations versionadas. Nunca se edita una aplicada.
│   └── seed.sql      # Datos de dev (no prod).
├── public/           # Assets estáticos (imágenes, fuentes).
├── docs/             # Documentación humana (no para Claude).
├── .claude/
│   ├── agents/       # Subagentes locales del proyecto.
│   ├── hooks/        # Hooks deterministas (bash scripts).
│   └── settings.json # Permisos + hooks config.
├── CLAUDE.md         # ESTE archivo.
├── AGENTS.md         # Nota corta sobre Next.js 16.
└── SECURITY_AUDIT.md # Audit forense de RLS (si existe).
```

Al tocar lógica de carrito, checkout, o pricing: leé `lib/cart-context.tsx`, `lib/actions.ts`, y el RPC en `supabase/migrations/0001_init.sql` **antes** de proponer cambios. Estos tres forman una unidad lógica que se puede romper de manera sutil si mirás uno solo.

---

## 6. Formato de respuestas al usuario

- **Español por default.** El usuario es nativo español-Chile.
- **Concisión**. Sin preámbulos, sin "perfecto, ahora voy a...", sin resúmenes de lo que acabás de hacer si el diff ya es visible.
- **Evidencia antes de claim**. "Funciona" no vale sin output de test / screenshot / HTTP 200.
- **Listas solo cuando hay >3 items enumerables**. Si no, prosa corta.
- **Emojis**: solo si el usuario los usa primero.
- **Cuando parás en un checkpoint**, el último bloque del mensaje es una línea explícita `→ Esperando OK para: <acción concreta>`. Nada ambiguo.

---

## 7. Hallazgos laterales

Si mientras hacés tu tarea descubrís un bug o vulnerabilidad **no relacionados** con el scope actual:

1. **No lo arreglás en el mismo commit.** Mezclar scopes es la receta para commits que nadie puede revisar.
2. Lo documentás en `docs/LATERAL_FINDINGS.md` (creá el archivo si no existe) con: fecha, descripción, evidencia (snippets con line numbers), impacto estimado, y opciones de mitigación.
3. Se lo mencionás al usuario al cierre del bloque actual con una línea tipo: `⚠️ Hallazgo lateral: <titular>. Documentado en docs/LATERAL_FINDINGS.md. Sugerencia: abrir plan propio.`
4. El usuario decide si abre plan nuevo o lo posterga. Vos no decidís eso.

---

## 8. Anti-patrones prohibidos

- ❌ Empezar a ejecutar sin plan cuando la tarea tiene >1 archivo o efecto irreversible.
- ❌ Hacer preguntas cuya respuesta está en un `ls` o `grep`.
- ❌ Parar a esperar input humano para revisiones de código o audits — usá subagentes.
- ❌ Commits mezclando scopes ("fix mobile + add new feature + refactor").
- ❌ `--force`, `--no-verify`, `git add -A`, `git reset --hard` sin autorización explícita.
- ❌ Escribir "listo" sin mostrar evidencia.
- ❌ Mostrar comandos con credenciales literales en el chat.
- ❌ Pedirle al usuario que sea el middleman entre vos y otro Claude.
- ❌ Resumir lo que acabás de hacer después de un diff visible (el usuario lee diffs).

---

## 9. Referencias rápidas

- Plan del hardening Bloque 2: `docs/HARDENING_PLAN.md` (si existe).
- Audit baseline RLS: `SECURITY_AUDIT.md` (si existe).
- Hallazgos laterales pendientes: `docs/LATERAL_FINDINGS.md`.
- Rama actual del hardening: `hardening/round-1`.
- Rama actual de mobile polish: `fix/mobile-polish`.
- Commit base de la sesión actual: chequeá `git log -1 --format='%h %s'` al empezar.

---

## 10. Arranque de cada sesión

Al inicio de cada sesión, ejecutá estos comandos en paralelo **antes** de responder al usuario:

```bash
git status
git log -5 --oneline
git branch --show-current
ls docs/ 2>/dev/null
```

Con eso tenés contexto de dónde estás parado. Si hay cambios uncommitted que no reconocés, **pará y preguntá** antes de tocar nada.
