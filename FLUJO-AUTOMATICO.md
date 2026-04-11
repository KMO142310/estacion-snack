# Flujo automático — Claude Code sin middleman

**Para Omar. Leer una vez, volver cuando haga falta.**

---

## El problema que tenías

Estabas copiando y pegando mensajes entre dos sesiones de Claude:

1. **Claude Code** (en tu terminal) haciendo el trabajo real — editando archivos, corriendo curls, aplicando migraciones.
2. **Yo** (Cowork mode) revisando lo que hizo el primero y diciéndote qué responder.

Esto tenía ventajas reales (dos pares de ojos, dos contextos, segunda opinión), pero el costo era que vos quedabas de middleman forever, copiando texto de una ventana a otra. No escala.

## Lo que hice

Convertí la disciplina que yo te daba vía chat en **configuración del proyecto** que Claude Code aplica solo. Ahora Claude Code:

1. **Lee un protocolo de trabajo** (`CLAUDE.md`) al inicio de cada sesión, automáticamente.
2. **Tiene permisos deterministas** (`.claude/settings.json`) que definen qué puede hacer solo y qué requiere OK tuyo.
3. **Corre hooks** (`.claude/hooks/*.sh`) antes y después de cada tool call que bloquean comandos peligrosos y verifican secretos/typecheck sin intervención humana.
4. **Usa subagentes** (`.claude/agents/*.md`) en vez de pedirte que seas el middleman. Cuando necesita una segunda opinión, llama a un subagente internamente.

---

## Los archivos nuevos

### `CLAUDE.md` (raíz del repo)

La biblia del proyecto. Claude Code la lee al arrancar. Contiene:

- Contexto (stack, dominio, negocio, tu rol).
- Modo de trabajo obligatorio (Plan → Execute → Verify).
- Lista de checkpoints donde **siempre** para a pedir OK (commits, migraciones, deploys, DELETE, etc.).
- Reglas de seguridad (secretos, RLS, datos reales).
- Git flow (ramas, commits, push).
- Estructura del repo y archivos sensibles.
- Formato de respuestas esperado.
- Cómo manejar hallazgos laterales.
- Anti-patrones prohibidos explícitos.
- Qué correr al inicio de cada sesión.

**Esto reemplaza el prompt de "plan mode" que me pediste antes.** En vez de tener que pegar el mismo prompt cada vez que abrís una sesión, Claude Code lo lee del archivo.

### `.claude/settings.json`

Config de permisos + hooks. Tres categorías:

- **`allow`**: Claude Code ejecuta sin preguntar. Son comandos de lectura y builds (`ls`, `cat`, `git status`, `git diff`, `npx tsc`, `npx next build`, `grep`, etc.) + ediciones a archivos de código normal.
- **`ask`**: Claude Code pide OK tuyo cada vez. Son acciones con efecto (`git commit`, `git push`, `npm install`, `curl`, `vercel`, ediciones a `supabase/migrations/`, `.env*`, `next.config.ts`, `package.json`).
- **`deny`**: Claude Code **no** puede ejecutarlos nunca, aunque vos digas que sí. Son los destructivos absolutos (`git push --force`, `rm -rf /`, `sudo`, escritura a `.env.local`, pipes `curl | sh`).

Podés editarlo si querés aflojar o endurecer permisos específicos.

### `.claude/hooks/block-dangerous.sh`

Hook `PreToolUse` que corre antes de cada comando Bash. Bloquea patrones destructivos determinísticamente — si Claude Code de alguna manera termina queriendo correr `rm -rf /` o `git push --force origin main`, este hook lo aborta antes de que el comando se ejecute. También detecta secretos literales en comandos (por ejemplo si Claude intenta pasar un JWT directo en una línea de curl en vez de usar `$SUPABASE_SERVICE_ROLE_KEY`).

Este es el "cinturón de seguridad" deterministico. El LLM puede equivocarse; los hooks no.

### `.claude/hooks/pre-commit-guard.sh`

Hook `PreToolUse` específico para `git commit`. Escanea los archivos staged buscando:

- Secretos literales en el diff (JWTs, Stripe keys, AWS keys, GitHub PATs, service_role tokens).
- Archivos que nunca deberían commitearse (`.env.local`, `node_modules/`, `.next/`, etc.).
- Commits monstruosos (>2000 líneas — flag para pedir confirmación).
- TypeScript roto (`npx tsc --noEmit`).

Si encuentra cualquier cosa, bloquea el commit y le dice a Claude Code qué corregir. Tu responsabilidad de "correr tsc antes de commit" queda automatizada.

### `.claude/hooks/post-edit-verify.sh`

Hook `PostToolUse` que corre después de cada `Edit`/`Write` en archivos `.ts`/`.tsx`. Corre `npx tsc --noEmit` y reporta en stderr si hay errores de tipos. Claude Code ve el output y puede corregir antes de que vos te enteres.

### `.claude/hooks/stop-checkpoint.sh`

Hook `Stop` que corre cuando Claude Code termina una vuelta. Imprime un resumen determinístico del estado del repo (rama, último commit, archivos modificados, ahead/behind del upstream) para que cuando leas la ventana no tengas que correr `git status` manualmente.

### `.claude/agents/reviewer.md`

Subagente "revisor paranoico". **Este es el reemplazo directo de lo que yo estaba haciendo por vos.** Claude Code lo llama antes de cada commit. El reviewer:

- Lee el diff staged.
- Busca secretos, archivos prohibidos, violaciones del CLAUDE.md, tests rotos, TypeScript roto, datos hardcodeados de prod.
- Devuelve un reporte con veredicto `BLOCK | WARN | OK` y lista de hallazgos con severidad.
- Claude Code decide qué hacer con el reporte (corregir y re-intentar, o seguir si es OK).

Vos no tenés que mediar. Claude Code le dice "revisame este diff" y el reviewer le contesta dentro del mismo loop.

### `.claude/agents/planner.md`

Subagente "arquitecto de planes". Claude Code lo llama al inicio de cualquier tarea no-trivial. El planner:

- Lee el contexto del repo.
- Devuelve un plan paso a paso con supuestos, riesgos, checkpoints, criterio de rollback.
- Claude Code ejecuta ese plan paso a paso.

Esto reemplaza el "dame un plan antes de ejecutar" que le tenías que recordar manualmente.

---

## Cómo se usa ahora

### Al empezar una nueva sesión de Claude Code

Abrís Claude Code en el directorio `estacion-snack/`. Claude Code lee `CLAUDE.md` + `.claude/settings.json` automáticamente al arrancar, y ya tiene todo el contexto.

Le decís qué querés en una línea:

> "Aplicá el Bloque 2 parte B: baseline RLS + apply 0002 + audit post."

Claude Code:
1. Llama al subagente `planner` para armar un plan detallado.
2. Te muestra el plan y espera OK.
3. Vos decís "OK" o ajustás.
4. Claude Code ejecuta paso por paso, parando en cada checkpoint crítico (migración, commit, push).
5. Antes de cada commit llama al subagente `reviewer`.
6. El reviewer dice BLOCK/WARN/OK.
7. Si BLOCK, Claude Code corrige y re-intenta sin preguntarte.
8. Si OK, te muestra el diff y pide OK final para el commit (porque `git commit` está en `ask`).
9. Push lo hacés vos desde tu terminal (como acordamos).

### Lo que ya NO hacés

- ❌ Pegar mensajes entre sesiones.
- ❌ Explicar el protocolo de trabajo cada vez.
- ❌ Recordar "che, corré tsc antes de commit".
- ❌ Revisar líneas de código manualmente buscando secretos.
- ❌ Decirle "parate, pensá un plan primero" cada vez que arranca sin plan.
- ❌ Ser el segundo par de ojos. Los hooks + el reviewer son el segundo par de ojos.

### Lo que sí seguís haciendo

- ✅ Aprobar commits, migraciones, deploys (checkpoints de `ask`).
- ✅ Decidir sobre hallazgos laterales (¿abrimos plan nuevo? ¿lo posponemos?).
- ✅ Empujar push a `main` vos desde tu terminal.
- ✅ Aplicar migraciones SQL vos desde el SQL Editor de Supabase.
- ✅ Tomar decisiones de negocio (¿este combo debe ser SKU o virtual? ¿cambiamos el precio?).

Básicamente, **tu rol queda como CEO/aprobador, no como middleman técnico**.

---

## Cosas que recomiendo hacer ahora

### 1. Verificar que los hooks son ejecutables

```bash
cd ~/Desktop/Frutos\ secos/estacion-snack
ls -la .claude/hooks/
```

Deberían verse con `-rwx` al principio. Si no:

```bash
chmod +x .claude/hooks/*.sh
```

### 2. Testear que el bloqueo funciona

Abrí Claude Code y pedile:

> "Corré `git push --force origin main` como prueba."

Debería bloquearse por el hook `block-dangerous.sh`. Si no se bloquea, algo está mal en el setup.

### 3. Commitear la config nueva

```bash
git checkout -b chore/claude-code-setup
git add CLAUDE.md .claude/ FLUJO-AUTOMATICO.md
git commit -m "chore: setup Claude Code protocol, hooks, and subagents"
git push -u origin chore/claude-code-setup
```

Después mergeás a `main` cuando quieras que se active en las próximas sesiones de Claude Code en el repo.

### 4. En la próxima sesión de Claude Code, probá pedirle algo real

Por ejemplo:

> "Agregá un 2do test FL-2 al SECURITY_AUDIT.md usando return=representation, como sugeríamos. No apliques la migración todavía."

Debería:
1. Llamar al planner.
2. Mostrarte el plan.
3. Ejecutar paso por paso.
4. Antes del commit, llamar al reviewer.
5. Commitear solo con tu OK final.

---

## Buenas prácticas aprendidas de la comunidad

Después de investigar cómo gente más avanzada está usando Claude Code en 2026, esto es lo que vale la pena saber:

**1. `CLAUDE.md` es la herramienta más infravalorada.** La gente lo trata como un README, pero en realidad es el prompt global del proyecto. Ponele el protocolo de trabajo completo adentro y Claude Code va a ser 10× más disciplinado sin que le tengas que repetir las reglas. Ver el artículo de Morph sobre best practices 2026.

**2. Hooks > instrucciones.** Las instrucciones en CLAUDE.md son "advisory" — Claude Code puede ignorarlas bajo presión. Los hooks son determinísticos — corren siempre. Poné las reglas críticas (secretos, comandos destructivos, typecheck) en hooks, y las reglas de estilo (tono, formato) en CLAUDE.md.

**3. Subagentes para limpiar contexto.** Cada subagente tiene su propia ventana de contexto. Cuando Claude Code llama a `reviewer`, el reviewer lee 5000 líneas de diff y devuelve un reporte de 40 líneas — y el contexto del agente principal queda limpio. Sin subagentes, revisar un diff grande quema el contexto de Claude Code y lo hace más tonto para las siguientes tareas.

**4. Plan mode + auto-accept edits = el punto dulce.** Claude Code tiene varios modos de permisos. Para este proyecto, el setup ideal es: `plan` mode para empezar una sesión (Claude Code arma el plan sin tocar nada), y después `accept-edits` mode para ejecutar (edita archivos sin preguntar pero sigue pidiendo OK para shell commands riesgosos). Lo cambiás con `Shift+Tab` en la UI de Claude Code.

**5. `/clear` entre tareas no relacionadas.** Si venías trabajando en el audit de RLS y ahora querés arreglar un bug de UI, correr `/clear` y empezar fresh es más rápido que arrastrar el contexto viejo. Claude Code va a leer `CLAUDE.md` de nuevo y tiene todo el setup.

**6. Checkpoints automáticos > revisión humana.** El mejor setup es uno donde Claude Code puede trabajar 30 minutos sin que lo mires, y cuando volvés, el estado del repo es confiable. Eso requiere que los hooks sean buenos y que el reviewer sea paranoico. Este setup apunta a eso.

**7. Shadow mode antes de autonomía.** Para tareas realmente críticas (ej. tocar pricing o checkout), algunos proyectos corren Claude Code en modo "observador" durante 2 semanas — hace propuestas pero no ejecuta, y vos validás contra lo que terminaste haciendo. Después le das write access solo a las cosas que consistentemente hace bien. Para Estación Snack no es necesario llegar a eso hoy, pero vale tenerlo en mente si algún día querés que Claude Code maneje cosas como reportes semanales automáticos o seeding de productos nuevos.

---

## Qué sigue — no lo estoy haciendo yo ahora

Estas son extensiones naturales de este setup que podés pedir cuando quieras:

- **Skills específicas**: una skill "rls-audit" que condensa el protocolo de los Bloques 2/2B en un archivo que Claude Code puede invocar automáticamente cuando ve una migración de RLS. Hoy el protocolo vive en el chat; debería vivir en `.claude/skills/rls-audit/SKILL.md`.
- **CI integración**: correr el `reviewer` subagente como GitHub Action en cada PR, usando la Claude Code Security Review de Anthropic. Bloquea el merge automáticamente si hay hallazgos críticos.
- **Más subagentes**: `mobile-qa` para verificar responsive antes de commits de UI, `deploy-verifier` que corre curls contra prod después de un push a `main`, `migration-runner` que ejecuta SQL contra Supabase con backup previo.
- **Integración con scheduled tasks** del Cowork: un task diario que corre el reviewer sobre los últimos N commits de `main` y te avisa si encuentra algo raro.

Cada uno es un archivo chico adicional en `.claude/agents/` o `.claude/skills/`. No hay magia — es incrementalmente extensible.

---

## Referencias

- **Claude Code docs (oficial)**: cómo funcionan hooks, subagentes, plan mode, checkpoints. [code.claude.com/docs](https://code.claude.com/docs/en/best-practices)
- **Morph — best practices 2026**: [morphllm.com/claude-code-best-practices](https://www.morphllm.com/claude-code-best-practices)
- **Anthropic Security Review GitHub Action**: [github.com/anthropics/claude-code-security-review](https://github.com/anthropics/claude-code-security-review)
- **Trail of Bits forensic skills**: skills para auditorías de seguridad. [github.com/trailofbits/skills](https://github.com/trailofbits/skills)
- **Builder.io — 50 tips**: [builder.io/blog/claude-code-tips-best-practices](https://www.builder.io/blog/claude-code-tips-best-practices)
- **PubNub — subagent patterns**: [pubnub.com/blog/best-practices-for-claude-code-sub-agents](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/)

---

## Si algo se rompe

1. **Los hooks no corren**: verificá `chmod +x .claude/hooks/*.sh` y que `settings.json` sea JSON válido (`cat .claude/settings.json | jq .`).
2. **Claude Code ignora CLAUDE.md**: verificá que el archivo está en la raíz del repo (no adentro de `estacion-snack/estacion-snack/`) y que arranca con `@AGENTS.md` si querés preservar el import.
3. **El reviewer subagente no se invoca automáticamente**: hoy Claude Code no llama subagentes por cuenta propia — vos o el planner tenés que decirle "llamá al reviewer antes del commit". En el futuro esto se puede automatizar con un `PreToolUse` hook en `git commit` que abra el subagente.
4. **Un hook bloquea algo que no debería**: editá el array de `BLOCKED_PATTERNS` en `.claude/hooks/block-dangerous.sh` y sacá el patrón problemático. Es solo bash.
5. **Querés aflojar permisos para una sesión puntual**: corré Claude Code con `--permission-mode accept-edits` o `--dangerously-skip-permissions` (último solo si sabés qué estás haciendo).

---

**Fin del doc. Abrilo cuando algo falle o cuando quieras extender el setup.**
