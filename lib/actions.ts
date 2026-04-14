"use server";

import { createClient } from "./supabase/server";
import { captureOrderIntent, type CaptureOrderItem, type CaptureOrderDelivery } from "./supabase/admin";
import productsData from "@/data/products.json";
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

// Fallback estático — cuando Supabase no responde, usamos data/products.json
// directamente (fuente única de verdad; antes existía lib/products.ts con seed
// duplicado que drifteaba).
const STATIC_PRODUCTS: Product[] = productsData.map((p) =>
  withCatLabel(p as unknown as Record<string, unknown>)
);

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order");

    if (error || !data?.length) {
      return STATIC_PRODUCTS;
    }

    return (data as Record<string, unknown>[]).map(withCatLabel);
  } catch {
    return STATIC_PRODUCTS;
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
      return STATIC_PRODUCTS.find((p) => p.slug === slug) ?? null;
    }
    return withCatLabel(data as Record<string, unknown>);
  } catch {
    return STATIC_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

/**
 * Captures a pending order intent before the customer opens WhatsApp.
 * Fire-and-forget style: best-effort logging so the business can analyze
 * what's being bought. Never blocks the WhatsApp flow.
 */
export async function captureOrder(
  items: CaptureOrderItem[],
  notes?: string,
  delivery?: CaptureOrderDelivery,
): Promise<{ ok: boolean; orderId?: string; error?: string }> {
  return captureOrderIntent(items, notes ?? null, delivery);
}
