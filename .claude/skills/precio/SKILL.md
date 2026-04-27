---
name: precio
description: Recalcula el precio sugerido de un pack a partir del precio actual de sus componentes en data/products.json. Útil cuando subes un precio de producto y necesitas saber si el pack que lo contiene queda con ahorro real o ficticio (riesgo Sernac).
---

# Precio skill — Recalcular pack desde componentes

Lee `data/products.json` y `data/packs.json`, calcula:
- Suma de componentes a precios actuales (sueltos).
- Precio actual del pack.
- Ahorro absoluto y porcentual.
- Recomendación: si el ahorro < 5%, sugiere reducir el pack o aumentar; si > 25%, podría estar regalando margen.

## Cuándo invocar

- Antes de cambiar un precio en `data/products.json` (saber qué packs afecta).
- Después de cambiar un precio (validar que packs siguen coherentes).
- Cuando el usuario pregunte "¿cuánto debería costar el Pack X?".

## Cómo correrlo

```bash
node -e '
const products = require("./data/products.json");
const packs = require("./data/packs.json");

const productById = Object.fromEntries(products.map((p) => [p.id, p]));

for (const pack of packs) {
  const sueltoTotal = pack.items.reduce((sum, it) => {
    const p = productById[it.productId];
    if (!p) return sum + it.kg * (it.pricePerKg ?? 0);
    return sum + it.kg * p.price;
  }, 0);

  const ahorroAbs = sueltoTotal - pack.price;
  const ahorroPct = sueltoTotal > 0 ? Math.round((ahorroAbs / sueltoTotal) * 100) : 0;

  console.log(`\n=== ${pack.name} (${pack.slug}) ===`);
  console.log(`  Componentes:`);
  for (const it of pack.items) {
    const p = productById[it.productId];
    const real = p ? p.price : it.pricePerKg;
    console.log(`    - ${it.kg} kg ${p?.name ?? it.name}: $${(it.kg * real).toLocaleString("es-CL")} (${real.toLocaleString("es-CL")}/kg)`);
  }
  console.log(`  Sueltos:  $${sueltoTotal.toLocaleString("es-CL")}`);
  console.log(`  Pack:     $${pack.price.toLocaleString("es-CL")}`);
  console.log(`  Ahorro:   $${ahorroAbs.toLocaleString("es-CL")} (${ahorroPct}%)`);

  if (ahorroPct < 5) console.log(`  ⚠️  Ahorro <5% — pack pierde sentido. Revisar.`);
  else if (ahorroPct > 25) console.log(`  ⚠️  Ahorro >25% — regalando margen. Revisar.`);
  else console.log(`  ✅ Ahorro razonable.`);
}
'
```

## Output esperado

```
=== Pack Clásico (pack-clasico) ===
  Componentes:
    - 1 kg Almendra natural: $13.000 (13.000/kg)
    - 1 kg Mix europeo: $9.000 (9.000/kg)
  Sueltos:  $22.000
  Pack:     $18.000
  Ahorro:   $4.000 (18%)
  ✅ Ahorro razonable.
```
