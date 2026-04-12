# PRODUCTOS-BOM — Composición de Packs

> **Bill of Materials (BOM)**: Cada pack consume stock de sus componentes individuales.
> El sistema calcula disponibilidad automáticamente desde `data/products.json`.
> El operador es el gate final de confirmación via WhatsApp.

---

## Lógica de disponibilidad

Para cada pack, el sistema hace:

1. Suma kg requeridos por `productId` (por si un mismo producto aparece más de una vez).
2. Para cada componente: `floor(stock_kg / kg_requerido)` = unidades posibles con ese componente.
3. El mínimo de todos los componentes = unidades disponibles del pack.
4. Si cualquier componente tiene `status: "agotado"` o stock insuficiente → pack agotado.

El stock **no se reserva automáticamente**. El operador confirma y descuenta manualmente.

---

## Pack Pica — `pack-pica`

**Precio**: $18.990 | **Precio suelto**: ~$22.745 | **Ahorro**: ~$3.755 (≈17%)

| Componente          | productId | Cantidad | Precio/kg | Subtotal  |
|---------------------|-----------|----------|-----------|-----------|
| Mix Europeo         | 1         | 500g     | $13.000   | $6.500    |
| Maní Confitado Rojo | 3         | 300g     | $5.990    | $1.797    |
| Chuby Bardú         | 4         | 250g     | $9.990    | $2.498    |
| Almendra Entera     | 6         | 200g     | $16.000   | $3.200    |
| **Total**           |           | **1,25 kg** |         | **$13.995** |

> ⚠️ **Almendra Entera (id:6)** tiene `stock_kg: 1` y `status: "ultimo_kg"`.
> Con 200g por pack, solo permite 5 unidades del Pack Pica antes de agotarse.
> Con 200g por pack y 300g en Pack Proteína → priorizar según demanda.

---

## Pack Dulce — `pack-dulce`

**Precio**: $14.990 | **Precio suelto**: ~$10.689 | **Ahorro**: ~-$4.301

> ⚠️ **Nota de pricing**: El Pack Dulce actualmente cuesta MÁS que la suma de sus componentes sueltos.
> `($5.990×0.5) + ($5.990×0.3) + ($9.990×0.3) + ($8.500×0.25)` = $2.995 + $1.797 + $2.997 + $2.125 = **$9.914**
> El precio del pack ($14.990) es $5.076 **más caro** que suelto. Revisar si el precio es correcto.

| Componente               | productId | Cantidad | Precio/kg | Subtotal  |
|--------------------------|-----------|----------|-----------|-----------|
| Maní Confitado Tropical  | 2         | 500g     | $5.990    | $2.995    |
| Maní Confitado Rojo      | 3         | 300g     | $5.990    | $1.797    |
| Chuby Bardú              | 4         | 300g     | $9.990    | $2.997    |
| Gomita Osito Docile      | 5         | 250g     | $8.500    | $2.125    |
| **Total**                |           | **1,35 kg** |         | **$9.914** |

---

## Pack Proteína — `pack-proteina`

**Precio**: $19.990 | **Precio suelto**: ~$23.598 | **Ahorro**: ~$3.608 (≈15%)

| Componente          | productId | Cantidad | Precio/kg | Subtotal  |
|---------------------|-----------|----------|-----------|-----------|
| Mix Europeo         | 1         | 800g     | $13.000   | $10.400   |
| Almendra Entera     | 6         | 300g     | $16.000   | $4.800    |
| Chuby Bardú         | 4         | 200g     | $9.990    | $1.998    |
| **Total**           |           | **1,30 kg** |         | **$17.198** |

> ⚠️ **Almendra Entera (id:6)** tiene `stock_kg: 1`.
> Con 300g por pack, solo permite **3 unidades** del Pack Proteína antes de agotarse.

---

## Conflicto de stock compartido — Almendra Entera (id:6)

La Almendra Entera aparece en **dos packs** y como **producto individual** en catálogo:

| Uso                  | Cantidad por unidad |
|----------------------|---------------------|
| Pack Pica (x1)       | 200g                |
| Pack Proteína (x1)   | 300g                |
| Producto individual  | min 1 kg            |

Con `stock_kg: 1` disponible, el sistema mostrará:

- Pack Pica: máx 5 unidades (floor(1000g / 200g))
- Pack Proteína: máx 3 unidades (floor(1000g / 300g))
- Producto individual: disponible (pero solo 1 kg)

**El stock no se bloquea entre packs**. Si se venden 3 Pack Proteína (−900g) y el operador no actualiza `stock_kg`, el sistema seguirá mostrando Pack Pica disponible. El operador debe actualizar `data/products.json` después de cada venta confirmada.

---

## Cómo actualizar stock

Editar `data/products.json`, campo `stock_kg` del producto correspondiente.
Para marcar agotado: cambiar `status` a `"agotado"` (packs que usen ese componente quedarán automáticamente deshabilitados).

Estados válidos: `"disponible"` | `"ultimo_kg"` | `"agotado"`

---

## Mensaje WhatsApp — formato BOM

Cuando el carrito incluye un pack, el mensaje enviado al operador incluye el desglose:

```
- Pack Pica (x1) · $18.990
  ↳ 500g Mix Europeo + 300g Maní Confitado Rojo + 250g Chuby Bardú + 200g Almendra Entera
```

Esto le permite al operador verificar stock físico componente a componente antes de confirmar.
