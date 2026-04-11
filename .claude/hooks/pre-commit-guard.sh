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
  'eyJ[A-Za-z0-9_-]{40,}'                                               # JWT (Supabase, Auth0, etc.)
  'sk_live_[A-Za-z0-9]{20,}'                                            # Stripe live
  'sk_test_[A-Za-z0-9]{20,}'                                            # Stripe test
  'SUPABASE_SERVICE_ROLE_KEY[[:space:]]*=[[:space:]]*["\x27]?eyJ'       # Assignment of service role key to a var
  'POSTGRES_PASSWORD[[:space:]]*=[[:space:]]*["\x27]?[^$]'              # Postgres password literal
  '-----BEGIN [A-Z ]*PRIVATE KEY-----'                                  # PEM private key (any algorithm)
  'AKIA[0-9A-Z]{16}'                                                    # AWS access key
  'ghp_[A-Za-z0-9]{36}'                                                 # GitHub PAT
)

# NOTE: `-- "$pattern"` is REQUIRED so grep does not misparse a pattern
# that starts with `-` (such as the PEM private key regex) as a flag.
# Never remove the `--` without replacing patterns with alternatives
# that cannot start with a dash.
for pattern in "${SECRET_PATTERNS[@]}"; do
  if git diff --cached | grep -qE -- "$pattern"; then
    matches=$(git diff --cached | grep -nE -- "$pattern" | head -3)
    REPORT+="\n🚫 Secreto detectado (patrón: $pattern)\n$matches\n"
    FAIL=1
  fi
done

# 2. Archivos que NO deberían commitearse nunca
# Patterns se matchean línea por línea contra `git diff --cached --name-only`.
# Anclamos con ^ y $ para evitar matches parciales (p.ej. ".env.local" no
# debe matchear ".env.local.example" que es el template público).
FORBIDDEN_FILES=(
  '^\.env\.local$'
  '^\.env\.production$'
  '^\.env\.production\.local$'
  '^\.env\.development\.local$'
  '^\.env\.test\.local$'
  '^/tmp/.*\.txt$'
  '^rls_baseline\.txt$'
  '^node_modules/'
  '^\.next/'
  '^.*\.tsbuildinfo$'
  '^\.DS_Store$'
)
# Intentional allowlist (templates, examples): `.env.local.example` — public
# template with placeholder values, never secrets. The FORBIDDEN_FILES
# patterns are anchored (`^...$`) so they won't match `.example` accidentally.

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

# 4. service_role usage barrier — SUPABASE_SERVICE_ROLE_KEY can only be
#    referenced from lib/supabase/admin.ts. Any other file importing it
#    (or re-introducing createAdminClient) gets blocked.
#    Ref: lib/supabase/admin.ts header comment + SECURITY_AUDIT.md.
admin_wrapper="lib/supabase/admin.ts"
for f in $(git diff --cached --name-only --diff-filter=AM | grep -E '\.(ts|tsx)$'); do
  if [ "$f" = "$admin_wrapper" ]; then
    continue
  fi
  if [ ! -f "$f" ]; then
    continue
  fi
  if grep -qE 'SUPABASE_SERVICE_ROLE_KEY|createAdminClient' "$f"; then
    REPORT+="\n🚫 service_role barrier violation en $f\n"
    REPORT+="  createAdminClient y SUPABASE_SERVICE_ROLE_KEY solo pueden\n"
    REPORT+="  vivir en $admin_wrapper. Agregá una función nombrada ahí\n"
    REPORT+="  en vez de importar service_role directo.\n"
    FAIL=1
  fi
done

# 5. TypeScript debe compilar (si existe tsconfig.json)
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
