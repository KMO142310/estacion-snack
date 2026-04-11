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

**Status**: open
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
