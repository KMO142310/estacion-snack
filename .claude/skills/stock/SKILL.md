---
name: stock
description: Snapshot del stock actual de cada producto (Supabase vs data/products.json). Detecta drift entre el catálogo del repo y el estado real de la DB.
---

# Stock skill — Snapshot Supabase vs JSON

Compara `data/products.json:stock_kg` (snapshot estático del repo) contra `products.stock_kg` en Supabase (estado vivo). Drift indica que el operador modificó stock vía admin pero el JSON está desactualizado.

## Cuándo invocar

- Antes de un commit que toca `data/products.json` (asegurar coherencia con prod).
- Cuando el sitio muestra stock distinto al admin.
- Como chequeo periódico (semanal).

## Cómo correrlo

```bash
node -e "
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const products = require('./data/products.json');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const { data: live, error } = await supabase
    .from('products')
    .select('id, slug, name, stock_kg, status, price');
  if (error) return console.error(error);

  const liveBySlug = Object.fromEntries(live.map((p) => [p.slug, p]));

  console.log('| Slug | JSON stock | DB stock | JSON price | DB price | Status |');
  console.log('|------|-----------:|---------:|-----------:|---------:|--------|');

  let drift = 0;
  for (const p of products) {
    const l = liveBySlug[p.slug];
    if (!l) {
      console.log('| ' + p.slug + ' | ' + p.stock_kg + ' | (falta en DB) | $' + p.price.toLocaleString('es-CL') + ' | — | ❌ |');
      drift++;
      continue;
    }
    const stockOK = p.stock_kg === l.stock_kg;
    const priceOK = p.price === l.price;
    const statusOK = p.status === l.status;
    const flag = stockOK && priceOK && statusOK ? '✅' : '⚠️';
    if (!stockOK || !priceOK || !statusOK) drift++;
    console.log('| ' + p.slug + ' | ' + p.stock_kg + ' | ' + l.stock_kg + ' | $' + p.price.toLocaleString('es-CL') + ' | $' + l.price.toLocaleString('es-CL') + ' | ' + flag + ' |');
  }
  console.log('\\n' + (drift === 0 ? '✅ Sin drift.' : '⚠️ Drift en ' + drift + ' producto(s). Revisar.'));
})();
"
```

## Si hay drift

- **JSON < DB**: el operador agregó stock vía admin. Si es permanente, actualizar `data/products.json` en un commit `chore(catalog): sync stock with prod`.
- **JSON > DB**: el operador vendió stock o lo bajó. Mismo fix.
- **price drift**: serio — significa que el sitio público (que lee del JSON en build time) muestra otro precio que el admin. Resolver YA.
