// ============================================================
// lib/supabase/admin.ts — ÚNICO lugar donde vive el service_role client.
//
// SEGURIDAD:
//   Cualquier operación que requiera bypass de RLS pasa por una función
//   NOMBRADA en este archivo. Eso nos permite:
//     1) Auditar en un solo archivo todo lo que "rompe" RLS.
//     2) Inyectar assertAdmin() o validaciones custom en cada función.
//     3) Bloquear vía grep en pre-commit-guard.sh cualquier import de
//        `createAdminClient` fuera de este archivo.
//
//   Si necesitás una operación nueva con service_role:
//     (a) Agregá una función nombrada acá.
//     (b) Si es para admin UI, llamá a assertAdmin() primero.
//     (c) NO importes createAdminClient en otros archivos — el hook de
//         pre-commit te va a bloquear.
//
//   Este patrón asume que SUPABASE_SERVICE_ROLE_KEY puede filtrarse. Con
//   el wrapper centralizado, una filtración tiene impacto acotado a las
//   operaciones definidas acá y cada uso queda auditable por audit_log
//   (ver Bloque 2 parte A).
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { assertAdmin } from "@/lib/auth/assert-admin";
import type { OrderStatus, Product } from "@/lib/types";

/**
 * PRIVATE factory. Do NOT export from this module. If a caller outside
 * this file needs service_role, add a named function here instead.
 */
async function createAdminSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server component read-only context — OK to swallow.
          }
        },
      },
    },
  );
}

// ============================================================
// PUBLIC, admin-gated operations.
// ============================================================

export interface OrderItemRow {
  id: string;
  product_name: string;
  qty: number;
  unit_price: number;
  subtotal: number;
}

export interface AdminOrderRow {
  id: string;
  created_at: string;
  customer_name: string | null;
  customer_phone: string | null;
  total: number;
  subtotal: number;
  shipping: number;
  status: OrderStatus;
  notes: string | null;
  order_items: OrderItemRow[];
}

export interface AdminCustomerRow {
  id: string;
  name: string | null;
  phone: string;
  total_orders: number;
  total_spent: number;
  first_order_at: string | null;
  last_order_at: string | null;
}

/** Admin dashboard: orders del mes + últimos 100 customers. */
export async function adminDashboardData(): Promise<{
  orders: AdminOrderRow[];
  customers: AdminCustomerRow[];
}> {
  await assertAdmin();
  const supabase = await createAdminSupabase();

  const now = new Date();
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [{ data: ordersRaw }, { data: customersRaw }] = await Promise.all([
    supabase
      .from("orders")
      .select(
        "id, created_at, customer_name, customer_phone, total, subtotal, shipping, status, notes, order_items(id, product_name, qty, unit_price, subtotal)",
      )
      .gte("created_at", startMonth)
      .order("created_at", { ascending: false }),
    supabase
      .from("customers")
      .select("id, name, phone, total_orders, total_spent, first_order_at, last_order_at")
      .order("last_order_at", { ascending: false, nullsFirst: false })
      .limit(100),
  ]);

  return {
    orders: (ordersRaw ?? []) as AdminOrderRow[],
    customers: (customersRaw ?? []) as AdminCustomerRow[],
  };
}

/** Admin orders page: últimos 100 pedidos. */
export async function adminListOrders(): Promise<AdminOrderRow[]> {
  await assertAdmin();
  const supabase = await createAdminSupabase();
  const { data } = await supabase
    .from("orders")
    .select(
      "id, created_at, customer_name, customer_phone, total, subtotal, shipping, status, notes, order_items(id, product_name, qty, unit_price, subtotal)",
    )
    .order("created_at", { ascending: false })
    .limit(100);
  return (data ?? []) as AdminOrderRow[];
}

/** Admin customers page: últimos 100 clientes. */
export async function adminListCustomers(): Promise<AdminCustomerRow[]> {
  await assertAdmin();
  const supabase = await createAdminSupabase();
  const { data } = await supabase
    .from("customers")
    .select("*")
    .order("last_order_at", { ascending: false, nullsFirst: false })
    .limit(100);
  return (data ?? []) as AdminCustomerRow[];
}

const CAT_LABEL: Record<string, string> = {
  frutos: "Frutos secos",
  dulces: "Dulces",
};

/** Admin list: todos los productos (incluyendo inactivos), con cat_label derivado. */
export async function adminListProducts(): Promise<Product[]> {
  await assertAdmin();
  const supabase = await createAdminSupabase();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("sort_order");
  return (data ?? []).map((row: Record<string, unknown>) => ({
    ...row,
    cat_label: CAT_LABEL[row.category as string] ?? String(row.category ?? ""),
  })) as Product[];
}

/** Admin update: is_active de un producto. */
export async function adminUpdateProductActive(
  productId: string,
  isActive: boolean,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await assertAdmin();
    const supabase = await createAdminSupabase();
    const { error } = await supabase
      .from("products")
      .update({ is_active: isActive })
      .eq("id", productId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/** Admin update: notas internas de una orden. */
export async function adminUpdateOrderNotes(
  orderId: string,
  notes: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await assertAdmin();
    const supabase = await createAdminSupabase();
    const { error } = await supabase
      .from("orders")
      .update({ notes })
      .eq("id", orderId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export interface ProductUpsertPayload {
  id?: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock_kg: number;
  low_threshold: number;
  image_url: string;
  image_webp_url: string;
  image_400_url: string;
  copy: string;
  badge: string | null;
  color: string;
  sort_order: number;
  long_description?: string | null;
  is_active: boolean;
}

/** Admin create or update a product. If payload.id is set → update; else → insert. */
export async function adminUpsertProduct(
  payload: ProductUpsertPayload,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    await assertAdmin();
    const supabase = await createAdminSupabase();
    const { id, ...fields } = payload;
    if (id) {
      const { error } = await supabase.from("products").update(fields).eq("id", id);
      if (error) return { ok: false, error: error.message };
      return { ok: true, id };
    } else {
      const { data, error } = await supabase.from("products").insert(fields).select("id").maybeSingle();
      if (error) return { ok: false, error: error.message };
      return { ok: true, id: (data as { id: string } | null)?.id };
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/** Admin update: stock_kg de un producto. */
export async function adminUpdateStock(
  productId: string,
  newStock: number,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await assertAdmin();
    if (isNaN(newStock) || newStock < 0) {
      return { ok: false, error: "Stock inválido" };
    }
    const supabase = await createAdminSupabase();
    const { error } = await supabase
      .from("products")
      .update({ stock_kg: newStock })
      .eq("id", productId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/** Admin update: status de una orden. Rota access_token en estados terminales. */
export async function adminUpdateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await assertAdmin();
    const supabase = await createAdminSupabase();
    const patch: Record<string, unknown> = { status };
    if (status === "confirmed") patch.confirmed_at = new Date().toISOString();
    const { error } = await supabase.from("orders").update(patch).eq("id", orderId);
    if (error) return { ok: false, error: error.message };

    // Terminal states: rotate access_token so any leaked /pedido/[id]?t=...
    // link stops working immediately after the order closes.
    if (status === "delivered" || status === "cancelled") {
      await supabase.rpc("fn_rotate_order_access_token", { p_order_id: orderId });
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// ============================================================
// PUBLIC, unauthenticated operations (gated by domain logic, not by admin).
// ============================================================

export interface PublicOrderRow {
  id: string;
  created_at: string;
  customer_name: string | null;
  customer_phone: string | null;
  total: number;
  subtotal: number;
  shipping: number;
  status: OrderStatus;
  notes: string | null;
  access_token: string;
  access_token_expires_at: string;
  order_items: OrderItemRow[];
}

/**
 * Fetch an order by id — used by /pedido/[id] public route. The caller
 * MUST validate the access_token from the query param against
 * `row.access_token` using crypto.timingSafeEqual (see lib/crypto.ts)
 * BEFORE rendering anything, and MUST check `access_token_expires_at`.
 *
 * This does NOT call assertAdmin because the route is customer-facing.
 * The access_token is the authorization credential.
 */
export async function adminGetOrderByIdPublic(
  orderId: string,
): Promise<PublicOrderRow | null> {
  const supabase = await createAdminSupabase();
  const { data } = await supabase
    .from("orders")
    .select(
      "id, created_at, customer_name, customer_phone, total, subtotal, shipping, status, notes, access_token, access_token_expires_at, order_items(id, product_name, qty, unit_price, subtotal)",
    )
    .eq("id", orderId)
    .maybeSingle();
  return (data as PublicOrderRow | null) ?? null;
}

/**
 * Fetch ONLY the access_token for a freshly-placed order. Called by
 * lib/actions.ts:placeOrder right after fn_place_order returns, so the
 * action can include the token in the WhatsApp URL for the customer.
 *
 * No assertAdmin because this is the continuation of an anonymous
 * checkout flow — the caller just created the order and has the order_id
 * in memory, so reading back its token is not an escalation.
 */
export async function adminGetOrderAccessToken(
  orderId: string,
): Promise<string | null> {
  const supabase = await createAdminSupabase();
  const { data } = await supabase
    .from("orders")
    .select("access_token")
    .eq("id", orderId)
    .maybeSingle();
  return (data?.access_token as string | undefined) ?? null;
}

/**
 * Append a row to audit_log_order_views after a successful /pedido/[id]
 * view. Never blocks the response — the caller should try/catch this.
 * Uses fn_log_order_view (SECURITY DEFINER) which is also granted to anon,
 * but routing through the admin wrapper keeps all audit writes in one
 * place for future auditing.
 */
export async function adminLogOrderView(
  orderId: string,
  ipHash: string | null,
  userAgentHash: string | null,
  refererHost: string | null,
): Promise<void> {
  const supabase = await createAdminSupabase();
  await supabase.rpc("fn_log_order_view", {
    p_order_id: orderId,
    p_ip_hash: ipHash,
    p_user_agent_hash: userAgentHash,
    p_referer_host: refererHost,
  });
}

export interface ContactMessageRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
}

/** Admin list: últimos 100 mensajes de contacto, más recientes primero. */
export async function adminListContactMessages(): Promise<ContactMessageRow[]> {
  await assertAdmin();
  const supabase = await createAdminSupabase();
  const { data } = await supabase
    .from("contact_messages")
    .select("id, created_at, name, email, phone, message, read")
    .order("created_at", { ascending: false })
    .limit(100);
  return (data ?? []) as ContactMessageRow[];
}
