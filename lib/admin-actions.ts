"use server";

import { revalidatePath } from "next/cache";
import { adminUpdateStock, adminUpdateOrderStatus } from "./supabase/admin";
import type { OrderStatus } from "./types";

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
