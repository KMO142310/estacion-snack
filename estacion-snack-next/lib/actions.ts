"use server";

import { createClient } from "./supabase/server";
import { WA, PRODUCTS } from "./products";
import type { Product } from "./types";

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order");

    if (error || !data?.length) {
      return PRODUCTS; // fallback to static seed
    }

    return data as Product[];
  } catch {
    return PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) {
      return PRODUCTS.find((p) => p.slug === slug) ?? null;
    }
    return data as Product;
  } catch {
    return PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function reserveStock(
  sessionId: string,
  productId: string,
  qty: number
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("fn_reserve_stock", {
      p_session_id: sessionId,
      p_product_id: productId,
      p_qty: qty,
    });

    if (error) return { ok: false, error: error.message };
    return { ok: data === true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function placeOrder(params: {
  sessionId: string;
  customerName: string;
  customerPhone: string;
  items: Array<{ product_id: string; qty: number }>;
  notes?: string;
}): Promise<{ ok: boolean; orderId?: string; waUrl?: string; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("fn_place_order", {
      p_session_id: params.sessionId,
      p_customer_name: params.customerName,
      p_customer_phone: params.customerPhone,
      p_items: params.items,
      p_notes: params.notes ?? null,
    });

    if (error) return { ok: false, error: error.message };

    // Build WhatsApp message
    const products = await getProducts();
    const lines = params.items
      .map((item) => {
        const p = products.find((x) => x.id === item.product_id);
        if (!p) return null;
        const sub = p.price * item.qty;
        return `• ${p.name}: ${item.qty} kg — $${sub.toLocaleString("es-CL")}`;
      })
      .filter(Boolean)
      .join("\n");

    const total = params.items.reduce((acc, item) => {
      const p = products.find((x) => x.id === item.product_id);
      return acc + (p ? p.price * item.qty : 0);
    }, 0);

    const site =
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://estacion-snack-next.vercel.app";
    const orderUrl = `${site}/pedido/${data}`;

    const msg = encodeURIComponent(
      `¡Hola! Hago el siguiente pedido 🌰\n\n${lines}\n\nTotal: $${total.toLocaleString("es-CL")}\n\nNombre: ${params.customerName}\nTeléfono: ${params.customerPhone}${params.notes ? `\nNotas: ${params.notes}` : ""}\n\nVer estado del pedido: ${orderUrl}`
    );

    const waUrl = `https://wa.me/${WA}?text=${msg}`;
    return { ok: true, orderId: data, waUrl };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
