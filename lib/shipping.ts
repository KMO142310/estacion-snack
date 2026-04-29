// Reglas de envío — cumplimiento Ley 19.496 Art. 1 N°2:
// el precio total (incluyendo despacho) debe mostrarse antes del cierre de compra.
// Fuente: https://www.bcn.cl/leychile/navegar?idNorma=61438
//
// Precios oficiales (marketplace abril 2026):
//   Retiro en local      gratis
//   Santa Cruz           $1.000
//   Palmilla             $2.000
//   Peralillo            $2.000
//   Marchigüe            $2.000
//
// Envío gratis sobre $25.000 (excepto Retiro que ya es gratis).

export const FREE_SHIPPING_MIN = 25000;

export const COMUNAS = [
  "Retiro en local",
  "Santa Cruz",
  "Palmilla",
  "Peralillo",
  "Marchigüe",
] as const;
export type Comuna = (typeof COMUNAS)[number];

export const COMUNA_DEFAULT: Comuna = "Retiro en local";

export function getShippingCost(comuna: Comuna, subtotal: number): number {
  if (comuna === "Retiro en local") return 0;
  if (subtotal >= FREE_SHIPPING_MIN) return 0;
  switch (comuna) {
    case "Santa Cruz": return 1000;
    case "Palmilla":   return 2000;
    case "Peralillo":  return 2000;
    case "Marchigüe":  return 2000;
    default:           return 2000;
  }
}
