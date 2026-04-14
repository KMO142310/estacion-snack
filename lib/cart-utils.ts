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
 * Formato de venta: 1 kg mínimo, enteros. Sin medios kilos.
 */
export function getChips(_minUnitKg: number): number[] {
  return [1, 2, 3, 5];
}

