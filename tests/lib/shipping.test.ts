import { describe, it, expect } from "vitest";
import { getShippingCost, FREE_SHIPPING_MIN, COMUNAS } from "@/lib/shipping";

describe("getShippingCost — precios marketplace (abril 2026)", () => {
  it("Retiro en local: siempre gratis", () => {
    expect(getShippingCost("Retiro en local", 0)).toBe(0);
    expect(getShippingCost("Retiro en local", 100_000)).toBe(0);
  });

  it("Santa Cruz: $1.000 bajo umbral", () => {
    expect(getShippingCost("Santa Cruz", 5_000)).toBe(1000);
    expect(getShippingCost("Santa Cruz", FREE_SHIPPING_MIN - 1)).toBe(1000);
  });

  it("Palmilla: $2.000 bajo umbral", () => {
    expect(getShippingCost("Palmilla", 10_000)).toBe(2000);
  });

  it("Peralillo: $2.000 bajo umbral", () => {
    expect(getShippingCost("Peralillo", 10_000)).toBe(2000);
  });

  it("Marchigüe: $2.000 bajo umbral", () => {
    expect(getShippingCost("Marchigüe", 10_000)).toBe(2000);
  });

  it("todas las comunas (excepto retiro) son gratis sobre $25.000", () => {
    for (const comuna of COMUNAS) {
      if (comuna === "Retiro en local") continue;
      expect(getShippingCost(comuna, FREE_SHIPPING_MIN)).toBe(0);
      expect(getShippingCost(comuna, FREE_SHIPPING_MIN + 1)).toBe(0);
    }
  });

  it("FREE_SHIPPING_MIN es $25.000", () => {
    expect(FREE_SHIPPING_MIN).toBe(25_000);
  });

  it("COMUNAS incluye 5 zonas: Retiro + 4 comunas", () => {
    expect(COMUNAS).toContain("Retiro en local");
    expect(COMUNAS).toContain("Santa Cruz");
    expect(COMUNAS).toContain("Palmilla");
    expect(COMUNAS).toContain("Peralillo");
    expect(COMUNAS).toContain("Marchigüe");
    expect(COMUNAS).toHaveLength(5);
  });
});
