import { describe, it, expect } from "vitest";
import { buildWaUrl } from "@/lib/whatsapp";
import type { Pack } from "@/lib/pack-utils";

const products = [
  { id: "p1", name: "Almendra", price: 13000 },
  { id: "p2", name: "Mix Europeo", price: 9000 },
];

const packs: Pack[] = [
  {
    id: "pk1",
    slug: "pack-dulce",
    name: "Pack Dulce",
    tagline: "",
    badge: null,
    price: 16490,
    image_url: "",
    image_webp_url: "",
    image_400_url: "",
    items: [{ name: "Gomitas", productId: "p3", kg: 1, pricePerKg: 7000 }],
  },
];

describe("buildWaUrl", () => {
  it("construye una URL wa.me con texto encoded", () => {
    const url = buildWaUrl([{ kind: "product", id: "p1", qty: 2, name: "Almendra", pricePerUnit: 13000 }], products, packs);
    expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  });

  it("incluye el detalle de cada producto con cantidad y subtotal", () => {
    const url = buildWaUrl(
      [{ kind: "product", id: "p1", qty: 2, name: "Almendra", pricePerUnit: 13000 }],
      products,
      packs,
    );
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    expect(decoded).toContain("Almendra");
    expect(decoded).toContain("2 kg");
    expect(decoded).toContain("$26.000"); // 2 × 13000
  });

  it("encoda correctamente tildes y Ñ (no rompe la URL)", () => {
    const url = buildWaUrl(
      [{ kind: "product", id: "p2", qty: 1, name: "Mix Europeo", pricePerUnit: 9000 }],
      products,
      packs,
      "Mandar con señal para la abuela — gracias ñ",
    );
    // La URL debe ser un URI válido (no crasheo el decoder).
    expect(() => new URL(url)).not.toThrow();
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    expect(decoded).toContain("señal");
    expect(decoded).toContain("abuela");
    expect(decoded).toContain("ñ");
  });

  it("cuando se pasa delivery, incluye subtotal + envío + total explícitos", () => {
    const url = buildWaUrl(
      [{ kind: "product", id: "p1", qty: 1, name: "Almendra", pricePerUnit: 13000 }],
      products,
      packs,
      undefined,
      undefined,
      { comuna: "Santa Cruz", shipping: 1000, total: 14000 },
    );
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    expect(decoded).toContain("Entregar en: Santa Cruz");
    expect(decoded).toContain("Envío: $1.000");
    expect(decoded).toContain("Total: $14.000");
  });

  it("cuando shipping es 0 escribe 'gratis' en vez de '$0'", () => {
    const url = buildWaUrl(
      [{ kind: "product", id: "p1", qty: 2, name: "Almendra", pricePerUnit: 13000 }],
      products,
      packs,
      undefined,
      undefined,
      { comuna: "Retiro en local", shipping: 0, total: 26000 },
    );
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    expect(decoded).toContain("Envío: gratis");
    expect(decoded).not.toContain("Envío: $0");
  });

  it("los packs incluyen BOM breakdown (> Xg de cada componente)", () => {
    const url = buildWaUrl(
      [{ kind: "pack", id: "pk1", qty: 1, name: "Pack Dulce", pricePerUnit: 16490 }],
      products,
      packs,
    );
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    expect(decoded).toContain("Pack Dulce");
    expect(decoded).toContain("> 1 kg Gomitas"); // BOM line prefix
  });
});
