/**
 * toolsForActor — el filter que define qué tools puede llamar cada actor.
 *
 * Bug clase 0: si un día borran el `admin_only: true` de update_order_status,
 * cualquier customer puede mutar pedidos. Este test caza esa regresión.
 */
import { describe, it, expect } from "vitest";
import { toolsForActor } from "@/lib/agent/tools";

describe("toolsForActor — gating de tools por actor", () => {
  it("admin recibe TODAS las tools (lectura + mutación + side-effects)", () => {
    const tools = toolsForActor({ kind: "admin" });
    const names = tools.map((t) => t.name);
    // Lectura
    expect(names).toContain("list_orders");
    expect(names).toContain("get_order_details");
    expect(names).toContain("find_customer_by_phone");
    // Mutación
    expect(names).toContain("update_order_status");
    expect(names).toContain("update_product_stock");
    // Side-effects
    expect(names).toContain("notify_owner_whatsapp");
    expect(names).toContain("generate_confirmation_image");
  });

  it("customer NO recibe ninguna tool admin-only (mutaciones bloqueadas a nivel SDK)", () => {
    const tools = toolsForActor({ kind: "customer" });
    const names = tools.map((t) => t.name);
    expect(names).not.toContain("list_orders");
    expect(names).not.toContain("update_order_status");
    expect(names).not.toContain("update_product_stock");
    expect(names).not.toContain("notify_owner_whatsapp");
    expect(names).not.toContain("generate_confirmation_image");
  });

  it("customer SÍ recibe tools de discovery (auto-servicio)", () => {
    const tools = toolsForActor({ kind: "customer" });
    const names = tools.map((t) => t.name);
    expect(names).toContain("get_order_details"); // necesita access_token
    expect(names).toContain("find_customer_by_phone"); // su propio teléfono
  });

  it("toda mutación tiene requires_confirmation: true", () => {
    const tools = toolsForActor({ kind: "admin" });
    const mutators = tools.filter((t) =>
      ["update_order_status", "update_product_stock"].includes(t.name),
    );
    expect(mutators.length).toBe(2);
    for (const m of mutators) {
      expect(m.requires_confirmation).toBe(true);
    }
  });

  it("toda tool tiene name + description + input_schema (contrato SDK)", () => {
    const all = toolsForActor({ kind: "admin" });
    for (const t of all) {
      expect(t.name).toBeTruthy();
      expect(t.description.length).toBeGreaterThan(20);
      expect(t.input_schema).toBeDefined();
      expect(t.input_schema.type).toBe("object");
    }
  });
});
