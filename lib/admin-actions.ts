"use server";

import { revalidatePath } from "next/cache";
import {
  adminUpdateStock,
  adminUpdateOrderStatus,
  adminUpdateProductActive,
  adminUpdateOrderNotes,
} from "./supabase/admin";
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
