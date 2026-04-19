// Reglas de envío — cumplimiento Ley 19.496 Art. 1 N°2:
// el precio total (incluyendo despacho) debe mostrarse antes del cierre de compra.
// Fuente: https://www.bcn.cl/leychile/navegar?idNorma=61438

export const FREE_SHIPPING_MIN = 25000;

export const COMUNAS = ["Retiro en local", "Santa Cruz", "Palmilla", "Peralillo", "Marchigüe"] as const;
export type Comuna = (typeof COMUNAS)[number];

export const COMUNA_DEFAULT: Comuna = "Retiro en local";

/**
 * Calcula el costo de envío dado una comuna y subtotal del pedido.
 * "Retiro en local" siempre es gratis.
 * Si el subtotal alcanza FREE_SHIPPING_MIN, el envío es 0.
 */
export function getShippingCost(comuna: Comuna, subtotal: number): number {
  if (comuna === "Retiro en local") return 0;
  if (subtotal >= FREE_SHIPPING_MIN) return 0;
  if (comuna === "Santa Cruz") return 1000;
  return 2000;
}
