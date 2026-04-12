export interface PackItem {
  name: string;
  productId: string;
  kg: number;
  pricePerKg: number;
}

export interface Pack {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  badge: string | null;
  price: number;
  image_url: string;
  image_webp_url: string;
  image_400_url: string;
  items: PackItem[];
}

export interface ProductStock {
  id: string;
  status: string;
  stock_kg: number;
  name: string;
}

/**
 * Compara el pack vs comprar 1 kg mínimo de cada producto único.
 * El valor real del pack es que te permite probar variedad
 * sin comprar 1 kg de cada producto.
 */
export function computeSavings(pack: Pack): {
  sueltoTotal: number;
  savings: number;
  savingsPct: number;
} {
  const uniqueProducts = new Map<string, number>();
  for (const item of pack.items) {
    uniqueProducts.set(item.productId, item.pricePerKg);
  }
  const sueltoTotal = Array.from(uniqueProducts.values()).reduce(
    (sum, pricePerKg) => sum + pricePerKg * 1,
    0
  );
  const savings = sueltoTotal - pack.price;
  const savingsPct = sueltoTotal > 0 ? Math.round((savings / sueltoTotal) * 100) : 0;
  return { sueltoTotal: Math.round(sueltoTotal), savings: Math.round(savings), savingsPct };
}

/** Total kg in a pack */
export function totalKg(pack: Pack): number {
  return +pack.items.reduce((sum, i) => sum + i.kg, 0).toFixed(2);
}

/**
 * Consolidate BOM: sum kg for the same productId (in case a product
 * appears multiple times in a pack's item list).
 * Returns a Map<productId, { name, totalKg }>.
 */
export function consolidatedBOM(pack: Pack): Map<string, { name: string; totalKg: number }> {
  const bom = new Map<string, { name: string; totalKg: number }>();
  for (const item of pack.items) {
    const existing = bom.get(item.productId);
    if (existing) {
      existing.totalKg = +(existing.totalKg + item.kg).toFixed(3);
    } else {
      bom.set(item.productId, { name: item.name, totalKg: item.kg });
    }
  }
  return bom;
}

/**
 * Bill of Materials availability check.
 *
 * Calculates how many full units of a pack can be assembled from
 * the current stock of its components. This is the MINIMUM of
 * floor(stock_componente / kg_requerido) across all components.
 *
 * A pack is agotado when:
 * - Any component has status === "agotado"
 * - Any component stock_kg < required kg for 1 unit
 * - Result is 0
 */
export function getPackAvailability(
  pack: Pack,
  products: ProductStock[]
): { units: number; limitingComponent: string | null } {
  const bom = consolidatedBOM(pack);
  let minUnits = Infinity;
  let limitingComponent: string | null = null;

  for (const [productId, { name, totalKg: required }] of bom) {
    const product = products.find((p) => p.id === productId);

    // Component not found or explicitly agotado
    if (!product || product.status === "agotado" || product.stock_kg < required) {
      return { units: 0, limitingComponent: name };
    }

    const units = Math.floor(product.stock_kg / required);
    if (units < minUnits) {
      minUnits = units;
      limitingComponent = name;
    }
  }

  const result = minUnits === Infinity ? 0 : minUnits;
  return {
    units: result,
    limitingComponent: result === 0 ? limitingComponent : null,
  };
}

/**
 * Returns per-component stock details for display in PackSheet.
 * Shows each component with how much stock is available and
 * how many pack units that allows.
 */
export function getBOMDetails(
  pack: Pack,
  products: ProductStock[]
): Array<{
  productId: string;
  name: string;
  requiredKg: number;
  stockKg: number;
  status: string;
  unitsAllowed: number;
}> {
  const bom = consolidatedBOM(pack);
  return Array.from(bom.entries()).map(([productId, { name, totalKg: required }]) => {
    const product = products.find((p) => p.id === productId);
    const stockKg = product?.stock_kg ?? 0;
    const status = product?.status ?? "agotado";
    const unitsAllowed =
      status === "agotado" || stockKg < required
        ? 0
        : Math.floor(stockKg / required);
    return { productId, name, requiredKg: required, stockKg, status, unitsAllowed };
  });
}
