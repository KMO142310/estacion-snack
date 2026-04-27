---
name: smoke
description: Smoke tests post-deploy contra producción. Verifica /api/health, /api/agent/chat (validación 400), /api/og/order-confirmation (404 sin params), /admin/asistente (redirect a login). Usa esta skill después de cada merge a main para confirmar que el deploy de Vercel quedó sano.
---

# Smoke skill — Estación Snack

Verifica que el último deploy a producción esté sano. Toma <30 segundos. Nunca toca data real.

## Cuándo invocar

- Después de cada merge a `main` (Vercel auto-deploya, esta skill confirma).
- Cuando el usuario reporte "no carga la página" / "el agente no responde".
- Antes de cerrar una sesión de trabajo si tocaste algo que se desplegó.

## Qué hace

1. **GET /api/health** — espera 200 con `status: "ok"` y commit reciente.
2. **GET /api/og/order-confirmation** sin params — espera 400 (validación funciona).
3. **POST /api/agent/chat** con body `{}` — espera 400 (Zod rechaza).
4. **GET /admin/asistente** — espera 307 redirect a `/admin/login` (gate funciona).

## Cómo correrlo

Ejecuta este script en bash. Cualquier respuesta inesperada = problema.

```bash
SITE="${SITE:-https://www.estacionsnack.cl}"

echo "=== /api/health ==="
curl -sw "\n→ HTTP %{http_code}\n" "$SITE/api/health" | tail -3 | grep -o '"commit":"[^"]*"\|"status":"[^"]*"\|HTTP [0-9]*'

echo ""
echo "=== /api/og/order-confirmation sin params (espera 400) ==="
curl -sw "→ HTTP %{http_code}\n" "$SITE/api/og/order-confirmation" -o /dev/null

echo ""
echo "=== /api/agent/chat body inválido (espera 400) ==="
curl -sw "→ HTTP %{http_code}\n" -X POST "$SITE/api/agent/chat" \
  -H "Content-Type: application/json" -d '{}' -o /dev/null

echo ""
echo "=== /admin/asistente sin auth (espera 307 → /admin/login) ==="
curl -sw "→ HTTP %{http_code}\n→ Location: %{redirect_url}\n" \
  "$SITE/admin/asistente" -o /dev/null
```

## Criterio de éxito

Las 4 verificaciones devuelven el código esperado. Si el commit de health no es el último merge, espera ~2 min y reintenta (Vercel deploy en curso).

## Si algo falla

| Falla | Causa probable | Acción |
|-------|----------------|--------|
| /api/health 503 | Falta env var crítica en Vercel | Ver `app/api/health/route.ts` para qué env var falta. Setear con `vercel env add`. |
| /api/agent/chat 500 | Falta `ANTHROPIC_API_KEY` en Vercel | Setear la key. Sin ella el agente no puede arrancar. |
| /admin/asistente 200 (no redirect) | Gate de auth roto | BLOCKER CRITICAL. Revisar `app/admin/(gated)/layout.tsx`. |
| /api/og 200 sin params | Validación rota | Revisar `app/api/og/order-confirmation/route.tsx`. |
