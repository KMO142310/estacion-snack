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
 * Format quantity as "bolsa(s)" para UI más fiel al producto.
 * 1 → "1 bolsa", 2 → "2 bolsas".
 */
export function fmtBolsas(qty: number): string {
  return qty === 1 ? "1 bolsa" : `${qty} bolsas`;
}

/**
 * Cantidad de bolsas a comprar (chips de selector).
 * El producto se vende en bolsa sellada de formato fijo (1 kg o 500 g),
 * así que los chips son 1, 2, 3, 5 bolsas.
 */
export function getChips(_minUnitKg: number): number[] {
  return [1, 2, 3, 5];
}

/**
 * Display price + format label.
 *
 * Para productos con bolsa sellada de 1 kg: "$9.000 · Bolsa de 1 kg".
 * Para Chuby Bardú (500 g): muestra el precio EFECTIVO de la bolsa
 * (pricePerKg × 0.5) con label "Bolsa de 500 g".
 *
 * El formato proviene de products.json (`format_short`). Si no está
 * disponible, se infiere de min_unit_kg (compat con tipos legacy).
 */
export function fmtDisplayPrice(
  pricePerKg: number,
  minUnitKg: number,
  formatShort?: string,
): { price: string; unit: string } {
  const sizeKg = minUnitKg;
  const label = formatShort ?? (sizeKg < 1 ? `${Math.round(sizeKg * 1000)} g` : `${sizeKg} kg`);
  return {
    price: fmt(pricePerKg * sizeKg),
    unit: `Bolsa · ${label}`,
  };
}
