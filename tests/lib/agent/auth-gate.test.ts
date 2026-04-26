/**
 * Auth-gate tests — los tools admin-only DEBEN rechazar contextos customer.
 *
 * Los executors validan ctx.actor.kind ANTES de tocar Supabase,
 * así que estos tests son puros (no mockean nada). Si alguien borra
 * el guard accidentalmente, este test caza la regresión y bloquea el merge.
 */
import { describe, it, expect } from "vitest";
import {
  executeListOrders,
  executeUpdateOrderStatus,
  executeUpdateProductStock,
  executeNotifyOwnerWhatsapp,
  executeGenerateConfirmationImage,
} from "@/lib/agent/executors";
import type { AgentContext } from "@/lib/agent/types";

const customerCtx: AgentContext = {
  actor: { kind: "customer", phone: "56987654321" },
  session_id: "test-session-12345678",
};

describe("Tools admin-only rechazan ctx customer", () => {
  it("list_orders rechaza customer", async () => {
    const res = await executeListOrders({}, customerCtx);
    expect(res.is_error).toBe(true);
    expect(res.content).toMatch(/admin/i);
  });

  it("update_order_status rechaza customer", async () => {
    const res = await executeUpdateOrderStatus(
      { order_id: "abc12345", new_status: "confirmed" },
      customerCtx,
    );
    expect(res.is_error).toBe(true);
    expect(res.content).toMatch(/admin/i);
  });

  it("update_product_stock rechaza customer", async () => {
    const res = await executeUpdateProductStock(
      { slug: "mix-europeo", new_stock_kg: 10 },
      customerCtx,
    );
    expect(res.is_error).toBe(true);
    expect(res.content).toMatch(/admin/i);
  });

  it("notify_owner_whatsapp rechaza customer", async () => {
    const res = await executeNotifyOwnerWhatsapp(
      { order_id: "abc12345" },
      customerCtx,
    );
    expect(res.is_error).toBe(true);
    expect(res.content).toMatch(/admin/i);
  });

  it("generate_confirmation_image rechaza customer", async () => {
    const res = await executeGenerateConfirmationImage(
      { order_id: "abc12345" },
      customerCtx,
    );
    expect(res.is_error).toBe(true);
    expect(res.content).toMatch(/admin/i);
  });
});

describe("Confirm-gate (mutaciones requieren confirmed: true)", () => {
  // Estos tests sólo verifican el shape del schema y la rama early-return.
  // No mockean Supabase porque el rechazo de customer corta antes.

  it("update_order_status con args inválidos rechaza", async () => {
    const adminCtx: AgentContext = {
      actor: { kind: "admin", email: "test@example.com" },
      session_id: "admin-test",
    };
    // status inválido → zod schema rechaza ANTES de tocar DB.
    const res = await executeUpdateOrderStatus(
      { order_id: "abc12345", new_status: "INVALID_STATUS" },
      adminCtx,
    );
    expect(res.is_error).toBe(true);
    expect(res.content).toMatch(/inválido/i);
  });

  it("update_product_stock con stock negativo rechaza", async () => {
    const adminCtx: AgentContext = {
      actor: { kind: "admin", email: "test@example.com" },
      session_id: "admin-test",
    };
    const res = await executeUpdateProductStock(
      { slug: "mix-europeo", new_stock_kg: -5 },
      adminCtx,
    );
    expect(res.is_error).toBe(true);
    expect(res.content).toMatch(/inválido/i);
  });
});
