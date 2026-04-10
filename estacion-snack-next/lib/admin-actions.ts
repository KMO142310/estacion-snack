"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, createClient } from "./supabase/server";
import type { OrderStatus } from "./types";

async function assertAdmin(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!user || user.email !== adminEmail) {
    throw new Error("No autorizado");
  }
}

export async function updateStock(
  productId: string,
  newStock: number
): Promise<{ ok: boolean; error?: string }> {
  try {
    await assertAdmin();
    if (isNaN(newStock) || newStock < 0) {
      return { ok: false, error: "Stock inválido" };
    }
    const supabase = await createAdminClient();
    const { error } = await supabase
      .from("products")
      .update({ stock_kg: newStock })
      .eq("id", productId);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/productos");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ ok: boolean; error?: string }> {
  try {
    await assertAdmin();
    const supabase = await createAdminClient();
    const patch: Record<string, unknown> = { status };
    if (status === "confirmed") patch.confirmed_at = new Date().toISOString();
    const { error } = await supabase
      .from("orders")
      .update(patch)
      .eq("id", orderId);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/pedidos");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
