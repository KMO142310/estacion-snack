import { describe, it, expect } from "vitest";
import {
  computeSavings,
  totalKg,
  consolidatedBOM,
  getPackAvailability,
  getBOMDetails,
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

describe("getBOMDetails (lo que ve PackSheet por componente)", () => {
  const stock: ProductStock[] = [
    { id: "p1", status: "disponible", stock_kg: 10, name: "Almendra" },
    { id: "p2", status: "disponible", stock_kg: 5, name: "Mix Europeo" },
  ];

  it("retorna una entrada por productId único (consolida duplicados)", () => {
    // samplePack tiene p1 dos veces (0.5 + 0.2). getBOMDetails debe consolidar.
    const details = getBOMDetails(samplePack, stock);
    expect(details).toHaveLength(2);
    const p1 = details.find((d) => d.productId === "p1");
    expect(p1?.requiredKg).toBe(0.7);
    expect(p1?.unitsAllowed).toBe(14); // floor(10/0.7)
  });

  it("componente agotado: unitsAllowed = 0 aunque stock_kg > 0", () => {
    const stockAg: ProductStock[] = [
      { id: "p1", status: "agotado", stock_kg: 100, name: "Almendra" }, // status manda
      { id: "p2", status: "disponible", stock_kg: 5, name: "Mix Europeo" },
    ];
    const details = getBOMDetails(samplePack, stockAg);
    const p1 = details.find((d) => d.productId === "p1");
    expect(p1?.unitsAllowed).toBe(0);
    expect(p1?.status).toBe("agotado");
  });

  it("componente con stock_kg < requiredKg: unitsAllowed = 0", () => {
    const stockShort: ProductStock[] = [
      { id: "p1", status: "disponible", stock_kg: 0.5, name: "Almendra" }, // < 0.7 requerido
      { id: "p2", status: "disponible", stock_kg: 5, name: "Mix Europeo" },
    ];
    const details = getBOMDetails(samplePack, stockShort);
    const p1 = details.find((d) => d.productId === "p1");
    expect(p1?.unitsAllowed).toBe(0);
    expect(p1?.stockKg).toBe(0.5);
  });

  it("componente faltante en stock: stockKg=0, status='agotado', unitsAllowed=0", () => {
    const stockMissing: ProductStock[] = [
      { id: "p2", status: "disponible", stock_kg: 5, name: "Mix Europeo" },
      // p1 no existe
    ];
    const details = getBOMDetails(samplePack, stockMissing);
    const p1 = details.find((d) => d.productId === "p1");
    expect(p1?.stockKg).toBe(0);
    expect(p1?.status).toBe("agotado");
    expect(p1?.unitsAllowed).toBe(0);
  });
});

describe("computeSavings edge cases", () => {
  const overpricedPack: Pack = {
    id: "bad", slug: "bad", name: "Bad Pack", tagline: "", badge: null,
    price: 30000, // más caro que comprar suelto!
    image_url: "", image_webp_url: "", image_400_url: "",
    items: [
      { name: "Almendra", productId: "p1", kg: 1, pricePerKg: 13000 },
      { name: "Mix", productId: "p2", kg: 1, pricePerKg: 9000 },
    ],
  };

  it("pack más caro que sueltos: savings es negativo (no enmascara)", () => {
    const r = computeSavings(overpricedPack);
    // suelto = 22000, pack = 30000 → savings = -8000.
    expect(r.savings).toBe(-8000);
    expect(r.savingsPct).toBe(-36);
  });

  it("pack con un solo producto único: sueltoTotal = pricePerKg de ese producto", () => {
    const monoPack: Pack = {
      id: "m", slug: "m", name: "Mono", tagline: "", badge: null,
      price: 10000,
      image_url: "", image_webp_url: "", image_400_url: "",
      items: [
        { name: "Almendra", productId: "p1", kg: 0.5, pricePerKg: 13000 },
        { name: "Almendra", productId: "p1", kg: 0.5, pricePerKg: 13000 }, // mismo product
      ],
    };
    const r = computeSavings(monoPack);
    expect(r.sueltoTotal).toBe(13000); // 1 producto único × 1 kg de referencia
  });
});
