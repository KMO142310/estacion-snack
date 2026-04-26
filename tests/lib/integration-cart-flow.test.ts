/**
 * Integration test — flujo crítico del negocio.
 *
 * Simula: agrego productos + un pack al carrito → calculo total →
 * construyo URL de WhatsApp → verifico que el mensaje contenga lo correcto.
 *
 * Si ALGO de esto se rompe, el cliente recibe un mensaje incorrecto y el
 * operador puede facturar mal. Es el critical path del producto.
 */
import { describe, it, expect } from "vitest";
import { fmt, fmtDisplayPrice } from "@/lib/cart-utils";
import { computeSavings, getPackAvailability, type Pack, type ProductStock } from "@/lib/pack-utils";
import { buildWaUrl } from "@/lib/whatsapp";
import { getShippingCost, FREE_SHIPPING_MIN } from "@/lib/shipping";

const PRODUCTS = [
  { id: "p1", slug: "mix", name: "Mix Europeo", price: 9000, stock_kg: 5, status: "disponible", min_unit_kg: 1, format_short: "1 kg" },
  { id: "p2", slug: "chuby", name: "Chuby Bardú", price: 8000, stock_kg: 3, status: "disponible", min_unit_kg: 0.5, format_short: "500 g" },
  { id: "p3", slug: "almendra", name: "Almendra", price: 13000, stock_kg: 2, status: "disponible", min_unit_kg: 1, format_short: "1 kg" },
];

const PACKS: Pack[] = [
  {
    id: "pk1",
    slug: "pack-clasico",
    name: "Pack Clásico",
    tagline: "",
    badge: null,
    price: 18000,
    image_url: "",
    image_webp_url: "",
    image_400_url: "",
    items: [
      { name: "Almendra", productId: "p3", kg: 1, pricePerKg: 13000 },
      { name: "Mix Europeo", productId: "p1", kg: 1, pricePerKg: 9000 },
    ],
  },
];

const STOCK: ProductStock[] = PRODUCTS.map((p) => ({
  id: p.id, status: p.status, stock_kg: p.stock_kg, name: p.name,
}));

describe("Flujo completo: cart → WA message → factura honesta", () => {
  it("carrito con 1 bolsa Mix + 2 bolsas Chuby + 1 Pack Clásico", () => {
    // Cart simulado (sin store, usando el shape de CartLine).
    const items = [
      { kind: "product" as const, id: "p1", qty: 1, name: "Mix Europeo", pricePerUnit: 9000 },
      { kind: "product" as const, id: "p2", qty: 1, name: "Chuby Bardú", pricePerUnit: 8000 }, // 1 bolsa = 0.5 kg
      { kind: "pack" as const, id: "pk1", qty: 1, name: "Pack Clásico", pricePerUnit: 18000 },
    ];

    // Subtotal manual:
    // - Mix: 9000 × 1 = 9000
    // - Chuby: 8000 × 1 = 8000 (en cart-utils el qty para Chuby debería ser min_unit_kg=0.5,
    //   pero en el cart guardamos qty real en kg. 1 bolsa = 0.5 kg. Si se agregó qty=1, eso
    //   significa "1 kg" o "1 bolsa"? Por contrato actual: qty es kg, así que 1 = 1 kg.)
    //   En la realidad addItem para Chuby pasa qty=0.5 (min_unit_kg). Acá testeo qty=1 (2 bolsas).
    // - Pack: 18000

    // Total: 9000 + 8000 + 18000 = 35000.

    const subtotal = items.reduce((sum, it) => {
      if (it.kind === "product") return sum + (it.pricePerUnit ?? 0) * it.qty;
      return sum + (it.pricePerUnit ?? 0) * it.qty;
    }, 0);
    expect(subtotal).toBe(35000);

    // Envío Santa Cruz: subtotal $35.000 > FREE_SHIPPING_MIN $25.000 → gratis.
    const ship = getShippingCost("Santa Cruz", subtotal);
    expect(ship).toBe(0);
    expect(subtotal).toBeGreaterThan(FREE_SHIPPING_MIN);
  });

  it("WhatsApp message contiene cada item con precio correcto + total bold", () => {
    const items = [
      { kind: "product" as const, id: "p1", qty: 1, name: "Mix Europeo", pricePerUnit: 9000 },
      { kind: "pack" as const, id: "pk1", qty: 1, name: "Pack Clásico", pricePerUnit: 18000 },
    ];
    const url = buildWaUrl(
      items,
      PRODUCTS,
      PACKS,
      undefined,
      undefined,
      { comuna: "Santa Cruz", shipping: 0, total: 27000 },
    );
    const msg = decodeURIComponent(url.split("?text=")[1]);
    expect(msg).toContain("Mix Europeo");
    expect(msg).toContain("$9.000");
    expect(msg).toContain("Pack Clásico");
    expect(msg).toContain("$18.000");
    expect(msg).toContain("Subtotal: $27.000");
    expect(msg).toContain("Envío: gratis");
    expect(msg).toContain("*Total: $27.000*");
  });

  it("Pack BOM line aparece en el mensaje (operador puede verificar stock)", () => {
    const url = buildWaUrl(
      [{ kind: "pack", id: "pk1", qty: 1, name: "Pack Clásico", pricePerUnit: 18000 }],
      PRODUCTS,
      PACKS,
    );
    const msg = decodeURIComponent(url.split("?text=")[1]);
    // El operador necesita ver: "1 kg Almendra + 1 kg Mix Europeo" para preparar.
    expect(msg).toMatch(/> 1 kg Almendra \+ 1 kg Mix Europeo/);
  });

  it("savings reflejados en pack vs sueltos: Pack Clásico ahorra $4000 vs comprar 1kg de cada", () => {
    const result = computeSavings(PACKS[0]);
    // 13000 + 9000 = 22000 sueltos. Pack 18000. Savings 4000.
    expect(result.sueltoTotal).toBe(22000);
    expect(result.savings).toBe(4000);
    expect(result.savingsPct).toBe(18);
  });

  it("Disponibilidad del pack respeta el componente más limitado", () => {
    // Stock real: p3 (Almendra) tiene 2, p1 (Mix) tiene 5. Pack requiere 1 kg de cada.
    // Limita Almendra: floor(2/1) = 2 unidades posibles.
    const av = getPackAvailability(PACKS[0], STOCK);
    expect(av.units).toBe(2);
  });

  it("Display de precio para Chuby Bardú (formato 500 g): muestra precio efectivo de la bolsa", () => {
    // Chuby cuesta $8000/kg. Bolsa = 500 g → cliente paga $4000 por bolsa.
    // Si display mostrara $8000, el cliente se confunde.
    const display = fmtDisplayPrice(8000, 0.5, "500 g");
    expect(display.price).toBe("$4.000");
    expect(display.unit).toBe("Bolsa · 500 g");
  });

  it("fmt aplica separador de miles chileno (punto, no coma)", () => {
    expect(fmt(1234567)).toBe("$1.234.567");
    expect(fmt(9000)).toBe("$9.000");
  });
});
