#!/usr/bin/env bash
# PreToolUse hook — bloquea comandos peligrosos determinísticamente.
# Input: JSON del tool call via stdin. Output: exit 0 (permitido) o exit 2 (bloqueado, muestra stderr al modelo).
# Referencia: https://docs.claude.com/en/docs/claude-code/hooks

set -euo pipefail

# Leer el tool input JSON
input=$(cat)

# Extraer el comando con jq si está disponible, sino grep rústico
if command -v jq >/dev/null 2>&1; then
  cmd=$(echo "$input" | jq -r '.tool_input.command // ""')
else
  cmd=$(echo "$input" | grep -oE '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"command"[[:space:]]*:[[:space:]]*"\(.*\)"$/\1/')
fi

# Patrones que SIEMPRE bloquean, independientemente de permissions.deny
# (defensa en profundidad — si alguien borra deny del settings, estos siguen activos)
BLOCKED_PATTERNS=(
  'rm[[:space:]]+-rf[[:space:]]+/'
  'rm[[:space:]]+-rf[[:space:]]+~'
  'rm[[:space:]]+-rf[[:space:]]+\*'
  'git[[:space:]]+push[[:space:]]+.*--force'
  'git[[:space:]]+push[[:space:]]+-f[[:space:]]'
  'git[[:space:]]+reset[[:space:]]+--hard[[:space:]]+origin'
  'git[[:space:]]+commit[[:space:]]+.*--no-verify'
  'sudo[[:space:]]'
  'curl[[:space:]]+.*\|[[:space:]]*(sh|bash)'
  'wget[[:space:]]+.*\|[[:space:]]*(sh|bash)'
  'DROP[[:space:]]+(TABLE|DATABASE|SCHEMA)'
  'TRUNCATE[[:space:]]+TABLE'
  'DELETE[[:space:]]+FROM[[:space:]]+[a-z_]+[[:space:]]*;'
  '>[[:space:]]*\.env\.(local|production)'
)

for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if echo "$cmd" | grep -qE "$pattern"; then
    echo "🚫 BLOQUEADO por .claude/hooks/block-dangerous.sh" >&2
    echo "Patrón: $pattern" >&2
    echo "Comando: $cmd" >&2
    echo "" >&2
    echo "Este comando está en la lista de comandos irreversibles o destructivos." >&2
    echo "Si estás absolutamente seguro de que lo querés correr, pedile al usuario" >&2
    echo "que lo ejecute manualmente desde su terminal." >&2
    exit 2
  fi
done

# Detección de secretos literales en el comando (anon keys de Supabase, JWTs, etc.)
if echo "$cmd" | grep -qE '(eyJ[A-Za-z0-9_-]{40,}|sk_live_|sk_test_|service_role)[A-Za-z0-9_-]{20,}'; then
  echo "🚫 BLOQUEADO: el comando parece contener un secreto literal (JWT, API key, o service_role token)." >&2
  echo "Usá variables de entorno (\$SUPABASE_SERVICE_ROLE_KEY) cargadas desde .env.local en vez de literales." >&2
  exit 2
fi

exit 0
