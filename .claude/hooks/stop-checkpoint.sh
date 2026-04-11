#!/usr/bin/env bash
# Stop hook — corre cuando Claude Code termina una "vuelta" y está por devolver
# control al usuario. Última oportunidad de dejar un resumen determinista del
# estado del repo para que el humano entienda qué pasó sin leer 500 líneas de chat.

set +e

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  exit 0
fi

branch=$(git branch --show-current 2>/dev/null || echo "?")
status=$(git status --porcelain 2>/dev/null)
ahead_behind=$(git rev-list --left-right --count @{upstream}...HEAD 2>/dev/null || echo "? ?")
last_commit=$(git log -1 --format='%h %s' 2>/dev/null || echo "—")

# Solo imprimir si hay algo relevante
if [ -n "$status" ] || [ "$ahead_behind" != "0	0" ]; then
  echo "" >&2
  echo "─── stop-checkpoint ───" >&2
  echo "Rama: $branch" >&2
  echo "Último commit: $last_commit" >&2
  if [ -n "$status" ]; then
    changed_count=$(echo "$status" | wc -l | tr -d ' ')
    echo "Archivos modificados (uncommitted): $changed_count" >&2
    echo "$status" | head -10 >&2
    if [ "$changed_count" -gt 10 ]; then
      echo "... (+$((changed_count - 10)) más)" >&2
    fi
  fi
  if [ "$ahead_behind" != "0	0" ] && [ "$ahead_behind" != "? ?" ]; then
    echo "ahead/behind vs upstream: $ahead_behind" >&2
  fi
  echo "───────────────────────" >&2
fi

exit 0
