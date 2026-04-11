#!/usr/bin/env bash
# PreToolUse hook para git commit — escanea los archivos staged buscando secretos y
# violaciones del protocolo antes de permitir el commit.
# Exit 2 = bloqueado. Exit 0 = permitido.

set -euo pipefail

# Asegurar que estamos en un repo git
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  exit 0
fi

# Si no hay nada staged, dejar pasar (Claude Code sabrá que el commit falla)
if git diff --cached --quiet; then
  exit 0
fi

FAIL=0
REPORT=""

# 1. Detección de secretos en el diff staged
SECRET_PATTERNS=(
  'eyJ[A-Za-z0-9_-]{40,}'                    # JWT (Supabase keys, etc.)
  'sk_live_[A-Za-z0-9]{20,}'                 # Stripe live
  'sk_test_[A-Za-z0-9]{20,}'                 # Stripe test
  'service_role[^a-z_]'                      # Literal service_role
  'SUPABASE_SERVICE_ROLE_KEY[[:space:]]*=[[:space:]]*["\x27]?eyJ'
  'POSTGRES_PASSWORD[[:space:]]*=[[:space:]]*["\x27]?[^$]'
  '-----BEGIN[[:space:]]+(RSA|OPENSSH|PRIVATE)[[:space:]]+KEY'
  'AKIA[0-9A-Z]{16}'                         # AWS access key
  'ghp_[A-Za-z0-9]{36}'                      # GitHub PAT
)

for pattern in "${SECRET_PATTERNS[@]}"; do
  if git diff --cached | grep -qE "$pattern"; then
    matches=$(git diff --cached | grep -nE "$pattern" | head -3)
    REPORT+="\n🚫 Secreto detectado (patrón: $pattern)\n$matches\n"
    FAIL=1
  fi
done

# 2. Archivos que NO deberían commitearse nunca
FORBIDDEN_FILES=(
  '\.env\.local'
  '\.env\.production'
  '\.env\.development\.local'
  '/tmp/.*\.txt'
  'rls_baseline\.txt'
  'node_modules/'
  '\.next/'
  'tsconfig\.tsbuildinfo'
  '\.DS_Store'
)

staged_files=$(git diff --cached --name-only)
for pattern in "${FORBIDDEN_FILES[@]}"; do
  if echo "$staged_files" | grep -qE "$pattern"; then
    REPORT+="\n🚫 Archivo prohibido staged (patrón: $pattern)\n"
    REPORT+=$(echo "$staged_files" | grep -E "$pattern")
    REPORT+="\n"
    FAIL=1
  fi
done

# 3. Chequeo rápido de tipo de commit (no monstruosos)
added_lines=$(git diff --cached --numstat | awk '{sum+=$1} END {print sum+0}')
if [ "$added_lines" -gt 2000 ]; then
  REPORT+="\n⚠️  Commit gigante ($added_lines líneas agregadas).\n"
  REPORT+="Considerá partirlo en commits más chicos. Si es intencional (por ejemplo un archivo\n"
  REPORT+="generado grande), pedile OK explícito al usuario antes de committear.\n"
  FAIL=1
fi

# 4. TypeScript debe compilar (si existe tsconfig.json)
if [ -f tsconfig.json ] && command -v npx >/dev/null 2>&1; then
  if ! npx --no-install tsc --noEmit 2>/dev/null; then
    REPORT+="\n🚫 TypeScript no compila (npx tsc --noEmit falló).\n"
    REPORT+="Arreglá los errores de tipos antes de committear.\n"
    FAIL=1
  fi
fi

if [ "$FAIL" -eq 1 ]; then
  echo -e "🚫 pre-commit-guard.sh BLOQUEÓ el commit" >&2
  echo -e "$REPORT" >&2
  echo "" >&2
  echo "Corregí los problemas arriba y volvé a intentar. No uses --no-verify." >&2
  exit 2
fi

exit 0
