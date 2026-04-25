import { describe, it, expect } from "vitest";
import { fmt, fmtKg, fmtBolsas, fmtDisplayPrice, getChips } from "@/lib/cart-utils";

describe("fmt (precio CLP)", () => {
  it("formatea con separador de miles chileno (punto)", () => {
    expect(fmt(9000)).toBe("$9.000");
    expect(fmt(1234567)).toBe("$1.234.567");
  });

  it("redondea fracciones", () => {
    expect(fmt(999.4)).toBe("$999");
    expect(fmt(999.6)).toBe("$1.000");
  });

  it("maneja cero y negativos", () => {
    expect(fmt(0)).toBe("$0");
    expect(fmt(-1000)).toBe("$-1.000");
  });
});

describe("fmtKg", () => {
  it("convierte sub-kilo a gramos", () => {
    expect(fmtKg(0.5)).toBe("500 g");
    expect(fmtKg(0.25)).toBe("250 g");
  });

  it("omite decimales para kilos enteros", () => {
    expect(fmtKg(1)).toBe("1 kg");
    expect(fmtKg(5)).toBe("5 kg");
  });

  it("usa coma decimal para kilos fraccionales (locale CL)", () => {
    expect(fmtKg(1.5)).toBe("1,5 kg");
    expect(fmtKg(2.25)).toBe("2,25 kg");
  });
});

describe("fmtDisplayPrice", () => {
  it("bolsa de 1 kg muestra precio total + label 'Bolsa · 1 kg'", () => {
    expect(fmtDisplayPrice(9000, 1)).toEqual({ price: "$9.000", unit: "Bolsa · 1 kg" });
  });

  it("bolsa de 500 g (Chuby Bardú): precio EFECTIVO de la bolsa, no por kg", () => {
    // Chuby: pricePerKg=8000, format 0.5 kg → bolsa cuesta 4.000.
    expect(fmtDisplayPrice(8000, 0.5)).toEqual({ price: "$4.000", unit: "Bolsa · 500 g" });
  });

  it("usa format_short de products.json si está disponible (override)", () => {
    expect(fmtDisplayPrice(9000, 1, "1 kg")).toEqual({ price: "$9.000", unit: "Bolsa · 1 kg" });
    expect(fmtDisplayPrice(8000, 0.5, "500 g")).toEqual({ price: "$4.000", unit: "Bolsa · 500 g" });
  });
});

describe("getChips (cantidad de bolsas)", () => {
  it("siempre retorna [1, 2, 3, 5] (bolsas selladas, formato fijo)", () => {
    // El producto es bolsa sellada de formato fijo (1 kg o 500 g).
    // Los chips son cantidad de BOLSAS, no kg.
    expect(getChips(1)).toEqual([1, 2, 3, 5]);
    expect(getChips(0.5)).toEqual([1, 2, 3, 5]);
  });
});

describe("fmtBolsas (singular/plural)", () => {
  it("1 → '1 bolsa' (singular)", () => {
    expect(fmtBolsas(1)).toBe("1 bolsa");
  });

  it("≥2 → 'N bolsas' (plural)", () => {
    expect(fmtBolsas(2)).toBe("2 bolsas");
    expect(fmtBolsas(5)).toBe("5 bolsas");
    expect(fmtBolsas(10)).toBe("10 bolsas");
  });

  it("0 → '0 bolsas' (no se rompe en edge case)", () => {
    // Aunque 0 bolsas no debería ocurrir en UI normal, queremos que la
    // función sea defensiva si algún cálculo de stock baja a cero.
    expect(fmtBolsas(0)).toBe("0 bolsas");
  });
});

describe("fmtKg edge cases", () => {
  it("0 kg → '0 g' (no muestra '0 kg' que es ambiguo)", () => {
    expect(fmtKg(0)).toBe("0 g");
  });

  it("0.001 kg → '1 g' (mínimo razonable)", () => {
    expect(fmtKg(0.001)).toBe("1 g");
  });

  it("0.999 kg → '999 g' (justo bajo el umbral 1 kg)", () => {
    expect(fmtKg(0.999)).toBe("999 g");
  });

  it("muy grande (50 kg) → '50 kg'", () => {
    expect(fmtKg(50)).toBe("50 kg");
  });
});
