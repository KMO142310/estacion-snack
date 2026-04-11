/** Format a CLP price as "$13.000" */
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
 * - min_unit_kg = 0.5 (Chuby Bardú): [0.5, 1, 1.5, 2]
 * - min_unit_kg = 1   (default):      [1, 1.5, 2, 3]
 */
export function getChips(minUnitKg: number): number[] {
  return minUnitKg <= 0.5 ? [0.5, 1, 1.5, 2] : [1, 1.5, 2, 3];
}

/**
 * Snaps a qty to the nearest valid increment (50 g = 0.05 kg),
 * enforcing the product's minimum.
 */
export function normalizeQty(qty: number, minUnitKg: number): number {
  const step = 0.05;
  const snapped = Math.round(qty / step) * step;
  return Math.max(minUnitKg, +snapped.toFixed(3));
}
