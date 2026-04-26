// Reglas de envío — cumplimiento Ley 19.496 Art. 1 N°2:
// el precio total (incluyendo despacho) debe mostrarse antes del cierre de compra.
// Fuente: https://www.bcn.cl/leychile/navegar?idNorma=61438
//
// Precios oficiales del operador (abril 2026), basados en costo real
// de bus rural Colchagua + tiempo del operador:
//   Retiro en local      gratis
//   Santa Cruz           $1.500
//   Cunaco               $2.000
//   Palmilla             $2.000
//   Peralillo            $3.000
//   Nancagua             $3.000
//   Marchigüe            $4.000
//
// Envío gratis sobre $25.000 — todas las comunas (excepto Retiro que ya es gratis).

export const FREE_SHIPPING_MIN = 25000;

export const COMUNAS = [
  "Retiro en local",
  "Santa Cruz",
  "Cunaco",
  "Palmilla",
  "Peralillo",
  "Nancagua",
  "Marchigüe",
] as const;
export type Comuna = (typeof COMUNAS)[number];

export const COMUNA_DEFAULT: Comuna = "Retiro en local";

/**
 * Costo de envío por comuna. Si el subtotal alcanza FREE_SHIPPING_MIN,
 * el envío es 0 (excepto Retiro que siempre es gratis).
 */
export function getShippingCost(comuna: Comuna, subtotal: number): number {
  if (comuna === "Retiro en local") return 0;
  if (subtotal >= FREE_SHIPPING_MIN) return 0;
  switch (comuna) {
    case "Santa Cruz": return 1500;
    case "Cunaco":     return 2000;
    case "Palmilla":   return 2000;
    case "Peralillo":  return 3000;
    case "Nancagua":   return 3000;
    case "Marchigüe":  return 4000;
    default:           return 3000;
  }
}
