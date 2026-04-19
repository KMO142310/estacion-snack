/** Format a CLP price as "$9.000" */
export function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("es-CL");
}

/** Format kg quantity as "500 g", "1 kg", "1,5 kg" */
export function fmtKg(kg: number): string {
  if (kg < 1) return `${Math.round(kg * 1000)} g`;
  return kg === Math.floor(kg)
    ? `${kg} kg`
    : `${kg.toLocaleString("es-CL")} kg`;
}

/**
 * Returns the chip options for a product's quantity selector.
 * For products with min_unit_kg < 1 (e.g. 0.5 for Chuby Bardú),
 * chips start at 0.5 and increment by 0.5.
 */
export function getChips(minUnitKg: number): number[] {
  if (minUnitKg < 1) {
    return [0.5, 1, 1.5, 2];
  }
  return [1, 2, 3, 5];
}

/**
 * Format the display price and unit label for a product.
 * Products with min_unit_kg < 1 show price per portion (e.g. "$4.000 · 500 g")
 * instead of per kg.
 */
export function fmtDisplayPrice(pricePerKg: number, minUnitKg: number): { price: string; unit: string } {
  if (minUnitKg < 1) {
    return {
      price: fmt(pricePerKg * minUnitKg),
      unit: fmtKg(minUnitKg),
    };
  }
  return {
    price: fmt(pricePerKg),
    unit: "1 kg",
  };
}
