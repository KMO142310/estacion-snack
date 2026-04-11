#!/usr/bin/env bash
# PostToolUse hook — después de cada Edit/Write, corre verificaciones rápidas
# y reporta en stderr (visible al modelo) si algo rompió.
# Este hook NUNCA bloquea (exit 0 siempre). Solo avisa.
# El objetivo es que Claude Code vea inmediatamente si rompió el tipo o el lint,
# sin que el humano tenga que pedirle "corré tsc".

set +e  # no abortar en error, queremos reportar todo

input=$(cat)

if command -v jq >/dev/null 2>&1; then
  file_path=$(echo "$input" | jq -r '.tool_input.file_path // ""')
else
  file_path=$(echo "$input" | grep -oE '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"\(.*\)"$/\1/')
fi

# Solo reaccionar si editó un archivo TS/TSX
case "$file_path" in
  *.ts|*.tsx)
    if [ -f tsconfig.json ] && command -v npx >/dev/null 2>&1; then
      # Typecheck rápido del proyecto entero. tsc no soporta single-file check
      # sin trampas, así que corremos --noEmit sobre todo. Es rápido con cache.
      tsc_output=$(npx --no-install tsc --noEmit 2>&1)
      tsc_exit=$?
      if [ "$tsc_exit" -ne 0 ]; then
        echo "⚠️  post-edit-verify: TypeScript no compila después de editar $file_path" >&2
        echo "$tsc_output" | head -20 >&2
        echo "" >&2
        echo "Corregí los errores antes de seguir. NO hagas commit en este estado." >&2
      fi
    fi
    ;;
esac

# No bloqueamos — solo informamos
exit 0
