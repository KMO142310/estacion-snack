import { describe, it, expect } from "vitest";
import { fmt, fmtKg, fmtDisplayPrice, getChips } from "@/lib/cart-utils";

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
  it("para unidad >= 1 kg muestra precio por kilo", () => {
    expect(fmtDisplayPrice(9000, 1)).toEqual({ price: "$9.000", unit: "1 kg" });
  });

  it("para unidad < 1 kg (ej: Chuby Bardú) muestra precio por porción", () => {
    // Chuby Bardú: $4000 por 500g = $8000/kg conceptual, pero display es por porción.
    expect(fmtDisplayPrice(8000, 0.5)).toEqual({ price: "$4.000", unit: "500 g" });
  });
});

describe("getChips (opciones de cantidad)", () => {
  it("para min_unit_kg < 1 parte de 0.5 en incrementos de 0.5", () => {
    expect(getChips(0.5)).toEqual([0.5, 1, 1.5, 2]);
  });

  it("para productos vendidos por kilo entero, chips de 1 en 1 (con salto a 5)", () => {
    expect(getChips(1)).toEqual([1, 2, 3, 5]);
  });
});
