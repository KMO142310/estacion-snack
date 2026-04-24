import { describe, it, expect } from "vitest";
import { getShippingCost, FREE_SHIPPING_MIN, COMUNAS } from "@/lib/shipping";

describe("getShippingCost", () => {
  it("retira en local es siempre gratis, incluso con subtotal 0", () => {
    expect(getShippingCost("Retiro en local", 0)).toBe(0);
    expect(getShippingCost("Retiro en local", 100_000)).toBe(0);
  });

  it("Santa Cruz cobra $1000 bajo el umbral de envío gratis", () => {
    expect(getShippingCost("Santa Cruz", 5_000)).toBe(1000);
    expect(getShippingCost("Santa Cruz", FREE_SHIPPING_MIN - 1)).toBe(1000);
  });

  it("Santa Cruz es gratis en el umbral y por encima", () => {
    expect(getShippingCost("Santa Cruz", FREE_SHIPPING_MIN)).toBe(0);
    expect(getShippingCost("Santa Cruz", FREE_SHIPPING_MIN + 1)).toBe(0);
    expect(getShippingCost("Santa Cruz", 100_000)).toBe(0);
  });

  it("Palmilla / Peralillo / Marchigüe cobran $2000 bajo umbral", () => {
    expect(getShippingCost("Palmilla", 10_000)).toBe(2000);
    expect(getShippingCost("Peralillo", 10_000)).toBe(2000);
    expect(getShippingCost("Marchigüe", 10_000)).toBe(2000);
  });

  it("todas las comunas (excepto retiro) aplican el umbral de envío gratis", () => {
    for (const comuna of COMUNAS) {
      if (comuna === "Retiro en local") continue;
      expect(getShippingCost(comuna, FREE_SHIPPING_MIN)).toBe(0);
    }
  });

  it("FREE_SHIPPING_MIN es $25.000 (documentado en Ley 19.496 Art. 1 N°2 cumplimiento)", () => {
    // Este assertion existe para que cualquier cambio al umbral dispare
    // review explícita — está referenciado en el mensaje de WhatsApp y copy.
    expect(FREE_SHIPPING_MIN).toBe(25_000);
  });
});
