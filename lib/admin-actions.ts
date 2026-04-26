"use server";

import { revalidatePath } from "next/cache";
import {
  adminUpdateStock,
  adminUpdateOrderStatus,
  adminUpdateProductActive,
  adminUpdateOrderNotes,
  adminUpsertProduct,
  type ProductUpsertPayload,
} from "./supabase/admin";
import { assertAdmin } from "./auth/assert-admin";
import { runAgent } from "./agent/runner";
import type { AgentMessage, AgentTurnResult } from "./agent/types";
import type { OrderStatus } from "./types";

/**
 * Server action que invoca el agente desde /admin/asistente.
 * Solo admin (assertAdmin throws si no autorizado).
 *
 * Recibe el historial de mensajes desde el cliente y devuelve el turn
 * completo (reply + tool_calls + usage). El cliente decide qué pintar.
 *
 * No streaming en MVP — Anthropic SDK soporta stream pero la UI con
 * tool-use loop es más fácil con respuestas atómicas. Se puede agregar
 * streaming en bloque siguiente.
 */
export async function chatAdmin(
  messages: AgentMessage[],
): Promise<{ ok: true; result: AgentTurnResult } | { ok: false; error: string }> {
  try {
    await assertAdmin();
  } catch (e) {
    // No leak server-side detail al cliente: log internal, devolvé literal.
    console.error("[chatAdmin] assertAdmin failed:", (e as Error).message);
    return { ok: false, error: "No autorizado." };
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "unknown";

  try {
    const result = await runAgent({
      messages,
      ctx: {
        actor: { kind: "admin", email: adminEmail },
        session_id: `admin-${adminEmail}`,
      },
    });
    // Si alguna mutación se ejecutó, revalidar paths admin para que la UI
    // refleje el cambio fuera del chat.
    const hadMutation = result.tool_calls.some(
      (tc) =>
        (tc.name === "update_order_status" || tc.name === "update_product_stock") &&
        !tc.result.is_error &&
        !tc.result.pending_confirmation,
    );
    if (hadMutation) {
      revalidatePath("/admin/pedidos");
      revalidatePath("/admin/productos");
      revalidatePath("/");
    }
    return { ok: true, result };
  } catch (e) {
    console.error("[chatAdmin] runAgent failed:", (e as Error).message);
    // Mensaje genérico al cliente; el detalle queda en server logs.
    return { ok: false, error: "Error en el agente. Intentá de nuevo en un momento." };
  }
}

export async function updateStock(
  productId: string,
  newStock: number,
): Promise<{ ok: boolean; error?: string }> {
  const result = await adminUpdateStock(productId, newStock);
  if (result.ok) {
    revalidatePath("/admin/productos");
    revalidatePath("/");
  }
  return result;
}

export async function updateProductActive(
  productId: string,
  isActive: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const result = await adminUpdateProductActive(productId, isActive);
  if (result.ok) {
    revalidatePath("/admin/productos");
    revalidatePath("/");
  }
  return result;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<{ ok: boolean; error?: string }> {
  const result = await adminUpdateOrderStatus(orderId, status);
  if (result.ok) {
    revalidatePath("/admin/pedidos");
  }
  return result;
}

export async function updateOrderNotes(
  orderId: string,
  notes: string,
): Promise<{ ok: boolean; error?: string }> {
  const result = await adminUpdateOrderNotes(orderId, notes);
  if (result.ok) {
    revalidatePath("/admin/pedidos");
  }
  return result;
}

export async function upsertProduct(
  payload: ProductUpsertPayload,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const result = await adminUpsertProduct(payload);
  if (result.ok) {
    revalidatePath("/admin/productos");
    revalidatePath("/");
    revalidatePath("/sitemap.xml");
  }
  return result;
}
