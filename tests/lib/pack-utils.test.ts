import { describe, it, expect } from "vitest";
import {
  computeSavings,
  totalKg,
  consolidatedBOM,
  getPackAvailability,
  type Pack,
  type ProductStock,
} from "@/lib/pack-utils";

const samplePack: Pack = {
  id: "pack-1",
  slug: "pack-test",
  name: "Pack Test",
  tagline: "",
  badge: null,
  price: 15000,
  image_url: "",
  image_webp_url: "",
  image_400_url: "",
  items: [
    { name: "Almendra", productId: "p1", kg: 0.5, pricePerKg: 13000 },
    { name: "Mix Europeo", productId: "p2", kg: 0.5, pricePerKg: 9000 },
    { name: "Almendra extra", productId: "p1", kg: 0.2, pricePerKg: 13000 }, // mismo producto
  ],
};

describe("computeSavings", () => {
  it("compara pack vs comprar 1 kg de cada producto ÚNICO", () => {
    const r = computeSavings(samplePack);
    // 2 productos únicos a 1 kg c/u: 13000 + 9000 = 22000. Pack cuesta 15000.
    expect(r.sueltoTotal).toBe(22000);
    expect(r.savings).toBe(7000);
    expect(r.savingsPct).toBe(32);
  });
});

describe("totalKg", () => {
  it("suma kg de todos los items aunque se repita el productId", () => {
    expect(totalKg(samplePack)).toBe(1.2); // 0.5 + 0.5 + 0.2
  });
});

describe("consolidatedBOM", () => {
  it("consolida kg de items duplicados bajo el mismo productId", () => {
    const bom = consolidatedBOM(samplePack);
    expect(bom.size).toBe(2); // p1 y p2, no 3
    expect(bom.get("p1")?.totalKg).toBe(0.7); // 0.5 + 0.2
    expect(bom.get("p2")?.totalKg).toBe(0.5);
  });
});

describe("getPackAvailability", () => {
  const stockOk: ProductStock[] = [
    { id: "p1", status: "disponible", stock_kg: 10, name: "Almendra" },
    { id: "p2", status: "disponible", stock_kg: 10, name: "Mix Europeo" },
  ];

  it("con stock suficiente retorna floor(min_ratio) y limitingComponent null", () => {
    const r = getPackAvailability(samplePack, stockOk);
    // p1 requiere 0.7/unidad, stock 10 → 14 unidades posibles.
    // p2 requiere 0.5/unidad, stock 10 → 20 unidades.
    // Limitante conceptual: p1. floor(10/0.7) = 14.
    expect(r.units).toBe(14);
    // El contrato actual: limitingComponent solo se reporta cuando units === 0.
    // En happy path es null (no hay escasez).
    expect(r.limitingComponent).toBeNull();
  });

  it("con un componente agotado retorna 0 unidades", () => {
    const stock: ProductStock[] = [
      { id: "p1", status: "agotado", stock_kg: 0, name: "Almendra" },
      { id: "p2", status: "disponible", stock_kg: 10, name: "Mix Europeo" },
    ];
    const r = getPackAvailability(samplePack, stock);
    expect(r.units).toBe(0);
    expect(r.limitingComponent).toBe("Almendra");
  });

  it("con un componente sin stock suficiente para 1 unidad retorna 0", () => {
    const stock: ProductStock[] = [
      { id: "p1", status: "disponible", stock_kg: 0.3, name: "Almendra" }, // < 0.7 requerido
      { id: "p2", status: "disponible", stock_kg: 10, name: "Mix Europeo" },
    ];
    const r = getPackAvailability(samplePack, stock);
    expect(r.units).toBe(0);
    expect(r.limitingComponent).toBe("Almendra");
  });

  it("con componente faltante en el catálogo retorna 0 (defensivo)", () => {
    const stock: ProductStock[] = [
      { id: "p2", status: "disponible", stock_kg: 10, name: "Mix Europeo" },
      // p1 no existe
    ];
    const r = getPackAvailability(samplePack, stock);
    expect(r.units).toBe(0);
  });
});
