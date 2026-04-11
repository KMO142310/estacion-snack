"use server";

import { createClient } from "./supabase/server";
import { adminGetOrderAccessToken } from "./supabase/admin";
import { PRODUCTS } from "./products";
import { WA, BANK_INFO } from "./business-info";
import type { Product } from "./types";

const CAT_LABEL: Record<string, string> = {
  frutos: "Frutos secos",
  dulces: "Dulces",
};

// Supabase doesn't store cat_label (it's derived from category).
// This function adds it so callers always get a complete Product.
function withCatLabel(row: Record<string, unknown>): Product {
  return {
    ...row,
    cat_label: CAT_LABEL[row.category as string] ?? String(row.category ?? ""),
  } as Product;
}

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

    return (data as Record<string, unknown>[]).map(withCatLabel);
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
    return withCatLabel(data as Record<string, unknown>);
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
}): Promise<{
  ok: boolean;
  orderId?: string;
  accessToken?: string;
  waUrl?: string;
  error?: string;
}> {
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

    const orderId = data as string;

    // Fetch the access_token that the 0002 migration generated for this row
    // via the default expression on orders.access_token. The server action
    // returns it to the client so the WhatsApp link can carry ?t=<token>.
    // This is a server-to-server call inside the same checkout flow, so
    // adminGetOrderAccessToken is NOT gated by assertAdmin.
    const accessToken = await adminGetOrderAccessToken(orderId);
    if (!accessToken) {
      return { ok: false, error: "token lookup failed" };
    }

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

    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.estacionsnack.cl";
    const orderUrl = `${site}/pedido/${orderId}?t=${encodeURIComponent(accessToken)}`;

    const bankBlock = `\n\n💳 Datos para transferencia:\nBanco: ${BANK_INFO.bank}\nCuenta: ${BANK_INFO.accountType} ${BANK_INFO.accountNumber}\nRUT: ${BANK_INFO.rut}\nNombre: ${BANK_INFO.holder}\nEmail: ${BANK_INFO.email}`;

    const msg = encodeURIComponent(
      `¡Hola! Hago el siguiente pedido 🌰\n\n${lines}\n\nTotal: $${total.toLocaleString("es-CL")}\n\nNombre: ${params.customerName}\nTeléfono: ${params.customerPhone}${params.notes ? `\nNotas: ${params.notes}` : ""}${bankBlock}\n\nVer estado del pedido: ${orderUrl}`,
    );

    const waUrl = `https://wa.me/${WA}?text=${msg}`;
    return { ok: true, orderId, accessToken, waUrl };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
