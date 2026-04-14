// Reglas de envío — cumplimiento Ley 19.496 Art. 1 N°2:
// el precio total (incluyendo despacho) debe mostrarse antes del cierre de compra.
// Fuente: https://www.bcn.cl/leychile/navegar?idNorma=61438

export const FREE_SHIPPING_MIN = 25000;

export const COMUNAS = ["Santa Cruz", "Peralillo", "Marchigüe", "Cunaco"] as const;
export type Comuna = (typeof COMUNAS)[number];

export const COMUNA_DEFAULT: Comuna = "Santa Cruz";

const SANTA_CRUZ_COST = 2000;
const OTRAS_COST = 3000;

/**
 * Calcula el costo de envío dado una comuna y subtotal del pedido.
 * Si el subtotal alcanza FREE_SHIPPING_MIN, el envío es 0.
 */
export function getShippingCost(comuna: Comuna, subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_MIN) return 0;
  return comuna === "Santa Cruz" ? SANTA_CRUZ_COST : OTRAS_COST;
}
