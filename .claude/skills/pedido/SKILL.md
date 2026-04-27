---
name: pedido
description: Devuelve el resumen de un pedido (order_id) consultando Supabase. Útil para debug rápido sin abrir /admin/pedidos. Requiere SUPABASE_SERVICE_ROLE_KEY en env local.
---

# Pedido skill — Resumen de un order_id desde CLI

Útil cuando:
- Un cliente reporta "no recibí el pedido" y necesitas ver el shape exacto.
- Estás debuggeando un cambio en `lib/whatsapp.ts` y quieres ver el pedido real.
- El agente conversacional reporta algo raro sobre un pedido.

## Cómo correrlo

Requiere las env vars en `.env.local` (no las uses en CI). El script usa el admin client.

```bash
ORDER_ID="$1"
[ -z "$ORDER_ID" ] && { echo "uso: ORDER_ID=<uuid o prefijo 8-char>"; exit 1; }

node -e "
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  let id = '$ORDER_ID';
  // Resolver prefijo si es corto.
  if (id.length === 8) {
    const { data } = await supabase.from('orders').select('id').like('id', id + '%').limit(1).maybeSingle();
    if (!data) return console.error('No encontré orden con prefijo ' + id);
    id = data.id;
  }
  const { data, error } = await supabase
    .from('orders')
    .select('id, created_at, customer_name, customer_phone, total, subtotal, shipping, status, notes, access_token_expires_at, order_items(id, product_name, qty, unit_price, subtotal)')
    .eq('id', id)
    .maybeSingle();
  if (error) return console.error(error);
  if (!data) return console.error('Orden no existe.');
  console.log(JSON.stringify(data, null, 2));
})();
"
```

## Privacy

- El access_token NO se imprime (ya filtrado del select).
- El customer_phone aparece completo — esta skill es solo-local, NUNCA pegues el output en chats públicos.
