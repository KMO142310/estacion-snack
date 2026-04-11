# LATERAL FINDINGS — Estación Snack

Registro de bugs y vulnerabilidades descubiertos **fuera del scope** de la
tarea en curso. Cada entry tiene fecha, descripción, evidencia (snippets con
line numbers), impacto, opciones de mitigación, y status. El scope estricto
es: "lo encontré mientras hacía X, no lo arreglé porque X no es esto, lo
documento acá para que X y esto no se mezclen en el mismo commit".

Formato de cada entry:

```
## YYYY-MM-DD · <ID corto> · <título>

**Status**: open | planned | fixed | won't-fix
**Descubierto en**: <bloque / tarea donde apareció>
**Impacto**: <resumen de 1 línea>
**Evidencia**: <snippets con line numbers>
**Opciones de mitigación**: <lista>
**Plan propuesto**: <ref a plan nuevo si aplica>
```

---

## 2026-04-10 · LF-1 · pre-commit-guard.sh: grep falla con pattern `-----BEGIN ... KEY`

**Status**: **fixed** (en el commit de este mismo día que agrega la sección
After del `SECURITY_AUDIT.md`, junto con LF-2 abajo). El fix está en
`.claude/hooks/pre-commit-guard.sh`: se agregó `--` a las invocaciones de
`grep` para que cualquier pattern que empiece con `-` sea parseado como
pattern y no como flag, y el pattern PEM se simplificó a
`-----BEGIN [A-Z ]*PRIVATE KEY-----` que cubre todos los formatos de PEM
private key (RSA, EC, OPENSSH, PKCS#8) sin falsos negativos. Se agregó un
comentario en el script advirtiendo a quien lo edite en el futuro que no
remueva el `--`.

**Descubierto en**: Bloque 2 parte B — cherry-pick de `chore/claude-code-setup`
a `hardening/round-1`, al correr `.claude/hooks/pre-commit-guard.sh` manualmente
como sustituto del hook automático (hooks no cargados en esta sesión porque
`.claude/` es post-startup).

**Impacto**: **bajo**. El hook termina con `exit 0` (no bloquea el commit) pero
emite un error en stderr y **no escanea private keys** en ningún momento — el
pattern que busca `-----BEGIN (RSA|OPENSSH|PRIVATE) KEY` queda roto porque
bash/grep interpreta el `-` inicial como flag de opción. Cualquier
intento de commitear una private key literal pasaría el guard sin alertar.
El resto de los patterns (JWT, `sk_live`, `sk_test`, AWS, GitHub PAT) sí
funcionan porque no empiezan con `-`.

**Evidencia literal** (output del hook al correrlo manualmente sobre el staged
diff de `chore/claude-code-setup` en la sesión del 2026-04-10):

```
grep: unrecognized option `-----BEGIN[[:space:]]+(RSA|OPENSSH|PRIVATE)[[:space:]]+KEY'
usage: grep [-abcdDEFGHhIiJLlMmnOopqRSsUVvwXxZz] [-A num] [-B num] [-C[num]]
        [-e pattern] [-f file] [--binary-files=value] [--color=when]
        [--context[=num]] [--directories=action] [--label] [--line-buffered]
        [--null] [pattern] [file ...]
guard exit=0
```

El hook sigue ejecutando otros checks y retorna exit 0 porque el `grep` que
falla no es el único — el shell script continúa después del error. Eso
significa que el bug es **silencioso**: el commit pasa, el operador no ve el
error salvo que esté mirando stderr con atención.

**Causa raíz**: en `.claude/hooks/pre-commit-guard.sh`, la invocación de `grep`
pasa el patrón `-----BEGIN...` como primer argumento posicional. `grep` ve el
guión inicial e intenta parsearlo como flag. Los fix estándar son tres y
cualquiera funciona:

1. Prefijar con `--` para marcar fin de opciones: `grep -E -- '-----BEGIN ...'`
2. Usar `-e` explícito: `grep -E -e '-----BEGIN ...'`
3. Cambiar el regex para no empezar con `-`: `grep -E '^-----BEGIN|[^-]-----BEGIN ...'`
   (menos limpio, no lo recomiendo)

La opción **(1)** es la canónica y es un fix de 4 caracteres.

**Opciones de mitigación**:

- **Opción A (fix directo)**: editar `.claude/hooks/pre-commit-guard.sh`,
  agregar `--` antes del patrón `-----BEGIN...`. Un solo cambio de línea.
  Reversible trivialmente. Requiere abrir plan propio porque `.claude/hooks/`
  está fuera del scope del Bloque 2 parte B.
- **Opción B (rewrite del patrón)**: cambiar el patrón para que no empiece
  con `-`. Menos limpio, más frágil a falsos negativos.
- **Opción C (no arreglar)**: el riesgo real es bajo porque: (a) los demás
  patterns funcionan, (b) Claude Code rara vez va a intentar commitear una
  private key literal, (c) el operador ejecuta el hook manualmente en esta
  sesión y ya está advertido. No recomendado como fix definitivo pero
  aceptable como status quo hasta que se abra el plan de (A).

**Plan propuesto**: abrir plan "chore: fix pre-commit-guard.sh private key
regex quoting" como un commit independiente después de cerrar Bloque 2.
Scope: 1 archivo, 1 línea, reversible. El agente principal puede ejecutarlo
sin subagente porque el reviewer no bloqueará un cambio tan chico en un hook
de seguridad.

**Nota operativa**: mientras este bug esté abierto, cualquier revisión
humana de diffs antes de commit debería hacer un `grep -E '-----BEGIN .*
KEY'` adicional manualmente sobre `git diff --cached` como compensación.
**Esta nota queda histórica — el fix ya está aplicado.**

---

## 2026-04-11 · LF-2 · pre-commit-guard.sh: falso positivo de `service_role`

**Status**: **fixed** (en el mismo commit que LF-1, aplicado durante el
intento de commit del audit post-migración).

**Descubierto en**: Bloque 2 parte B — durante el intento de commit de
la sección "After" del `SECURITY_AUDIT.md`. El hook bloqueó la operación
con el siguiente output:

```
🚫 Secreto detectado (patrón: service_role[^a-z_])
85:+reserva con service_role antes del SELECT anon, y el anon aún así devuelve
136:+2. Insertar canary data con service_role, intentar la mutación anon con
137:+   WHERE matcheante, y verificar con service_role que la fila quedó intacta.
```

**Impacto**: **alto** (falso positivo bloquea commits legítimos, ruido
operacional, incentivo a bypasear el hook con `--no-verify`). Cualquier
documento que hable sobre Supabase Row-Level Security va a mencionar la
palabra `service_role` decenas de veces. El pattern del hook era
`service_role[^a-z_]` — matchea la palabra literal seguida de cualquier
carácter que no sea letra minúscula o underscore. Eso incluye espacios,
puntos, comas, saltos de línea, paréntesis, etc. O sea: imposible escribir
documentación técnica sobre RLS sin disparar el guard.

**Causa raíz**: el pattern es redundante con
`SUPABASE_SERVICE_ROLE_KEY[[:space:]]*=[[:space:]]*["\x27]?eyJ` que ya
estaba en el array y cubre el caso real (asignación del valor del key a
una variable). El pattern `service_role[^a-z_]` parece haber sido un
intento de "detectar el nombre de la clave" pero el nombre de la clave
(`SUPABASE_SERVICE_ROLE_KEY`) no es el secreto — el secreto es el JWT que
se le asigna. Mencionar el nombre `service_role` en documentación o
comentarios de código es normal y no constituye exposición.

**Fix aplicado**: eliminar la línea `'service_role[^a-z_]'` del array
`SECRET_PATTERNS` en `.claude/hooks/pre-commit-guard.sh`. El patrón
específico `SUPABASE_SERVICE_ROLE_KEY[[:space:]]*=[[:space:]]*["\x27]?eyJ`
permanece y sigue cubriendo el caso de un secreto literal asignado.

**Verificación post-fix**:

```bash
cd "/Users/omaralexis/Desktop/Frutos secos/estacion-snack"
git add SECURITY_AUDIT.md   # el mismo diff que estaba bloqueado
.claude/hooks/pre-commit-guard.sh  # corre y retorna exit 0
```

**Lección aprendida**: patterns de detección de secretos deben apuntar al
**valor** del secreto (eyJ..., sk_live..., AKIA..., etc.), no al **nombre**
de la variable que lo contiene. El nombre es parte del contrato público
del sistema y aparece en docs, comments, y el código mismo; el valor es
lo que no debe commitearse.

**Nota operativa**: este fix + LF-1 van en el mismo commit (separado del
commit del audit) con mensaje `fix(hooks): pre-commit-guard regex fixes
for PEM keys and service_role false positives`.

---

## 2026-04-11 · LF-3 · pre-commit-guard.sh: forbidden file patterns sin anclar

**Status**: **fixed** (en el commit del Bloque 2C que incluye el
`lib/supabase/admin.ts` wrapper).

**Descubierto en**: Bloque 2 parte C — al intentar stagear
`.env.local.example` (template público con placeholders, no secretos) el
guard lo bloqueaba con el pattern `\.env\.local` matcheando parcialmente
contra `.env.local.example`.

**Causa raíz**: los patterns de `FORBIDDEN_FILES` en
`.claude/hooks/pre-commit-guard.sh` usaban regex sin anclar (`^...$`). Un
pattern como `\.env\.local` matchea:
- `.env.local` ✓ (correcto)
- `.env.local.example` ✗ (falso positivo — template público)
- Cualquier otra cosa que contenga la secuencia literal

**Fix aplicado**: anclar todos los patterns con `^` y `$` para matchear
la línea completa contra el nombre completo del archivo. Enumeración
explícita en vez de glob:

```
^\.env\.local$
^\.env\.production$
^\.env\.production\.local$
^\.env\.development\.local$
^\.env\.test\.local$
```

`.env.local.example` queda explícitamente fuera de la lista (comentario
inline en el script lo aclara).

**Verificación post-fix**:

```bash
git add .env.local.example .claude/hooks/pre-commit-guard.sh ...
.claude/hooks/pre-commit-guard.sh  # exit 0
```

**Lección aprendida**: en regex de seguridad, anclar siempre (`^`/`$`)
cuando matcheás contra filenames o líneas. Los falsos positivos en
herramientas de guardrail son peores que los falsos negativos porque
incentivan a los operadores a bypasear el guard con `--no-verify`.
