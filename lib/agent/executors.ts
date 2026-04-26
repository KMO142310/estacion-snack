/**
 * Executors — implementación de cada tool del agente.
 *
 * Cada executor:
 * 1. Valida args con Zod (defense in depth — además del JSON schema en Anthropic).
 * 2. Verifica permisos según AgentContext (admin vs customer).
 * 3. Para mutaciones: revisa `confirmed === true` o responde PENDING_CONFIRMATION.
 * 4. Llama funciones de `lib/supabase/admin.ts` (queries existentes).
 * 5. Retorna `ToolResult` con content (string) + flags.
 */
import { z } from "zod";
import {
  adminListOrders,
  adminGetOrderByIdPublic,
  adminGetOrderAccessToken,
  adminUpdateOrderStatus,
  adminUpdateStock,
  adminListProducts,
  type AdminOrderRow,
} from "@/lib/supabase/admin";
import { safeEqual } from "@/lib/crypto";
import { fmt } from "@/lib/cart-utils";
import { buildWaUrl } from "@/lib/whatsapp";
import productsData from "@/data/products.json";
import packsData from "@/data/packs.json";
import type { Pack } from "@/lib/pack-utils";
import type { OrderStatus } from "@/lib/types";
import type { AgentContext, ToolResult } from "./types";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_whatsapp: "pendiente WhatsApp",
  confirmed: "confirmado",
  preparing: "preparando",
  delivered: "entregado",
  cancelled: "cancelado",
};

/** Normaliza phone a solo dígitos con código país. "987654321" → "56987654321". */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("56")) return digits;
  if (digits.length === 9 && digits.startsWith("9")) return `56${digits}`;
  return digits;
}

/** Masking PII para outputs públicos: +56 9 ••••3338 */
function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return phone;
  return `+${digits.slice(0, 2)} ${digits.slice(2, 3)} ••••${digits.slice(-4)}`;
}

function shortId(id: string): string {
  return id.slice(0, 8);
}

function ok(content: string): ToolResult {
  return { content };
}

function err(message: string): ToolResult {
  return { content: message, is_error: true };
}

function pending(summary: string, next_args: Record<string, unknown>): ToolResult {
  return {
    content: `PENDING_CONFIRMATION: ${summary}`,
    pending_confirmation: { summary, next_args },
  };
}

// ─────── LECTURA ───────

const ListOrdersSchema = z.object({
  status: z.enum(["pending_whatsapp", "confirmed", "preparing", "delivered", "cancelled"]).optional(),
  limit: z.number().int().min(1).max(50).default(10),
  since_days: z.number().int().min(1).max(90).default(30),
});

export async function executeListOrders(
  args: unknown,
  ctx: AgentContext,
): Promise<ToolResult> {
  if (ctx.actor.kind !== "admin") {
    return err("list_orders solo disponible para admin. Como cliente, usá find_customer_by_phone con tu propio teléfono.");
  }
  const parsed = ListOrdersSchema.safeParse(args);
  if (!parsed.success) return err(`Args inválidos: ${parsed.error.message}`);
  const { status, limit, since_days } = parsed.data;

  let orders: AdminOrderRow[];
  try {
    orders = await adminListOrders();
  } catch (e) {
    return err(`Error consultando órdenes: ${(e as Error).message}`);
  }

  const cutoff = Date.now() - since_days * 24 * 60 * 60 * 1000;
  const filtered = orders
    .filter((o) => (status ? o.status === status : true))
    .filter((o) => new Date(o.created_at).getTime() >= cutoff)
    .slice(0, limit);

  if (filtered.length === 0) {
    return ok(
      `No hay órdenes${status ? ` con status "${status}"` : ""} en los últimos ${since_days} días.`,
    );
  }

  const lines = filtered.map((o) => {
    const items = o.order_items
      .map((it) => `${it.qty}× ${it.product_name}`)
      .join(", ");
    return `• ${shortId(o.id)} · ${o.customer_name ?? "sin nombre"} · ${o.customer_phone ?? "sin tel"} · ${STATUS_LABEL[o.status]} · ${fmt(o.total)} · ${items}`;
  });

  return ok(`Encontré ${filtered.length} órden(es):\n${lines.join("\n")}`);
}

const GetOrderSchema = z.object({
  order_id: z.string().min(8, "order_id debe tener al menos 8 chars"),
  access_token: z.string().optional(),
});

export async function executeGetOrderDetails(
  args: unknown,
  ctx: AgentContext,
): Promise<ToolResult> {
  const parsed = GetOrderSchema.safeParse(args);
  if (!parsed.success) return err(`Args inválidos: ${parsed.error.message}`);
  let { order_id } = parsed.data;
  const { access_token } = parsed.data;

  // Si vino forma corta de 8 chars, expandimos buscando en lista admin (solo admin).
  if (order_id.length === 8 && ctx.actor.kind === "admin") {
    try {
      const all = await adminListOrders();
      const match = all.find((o) => o.id.startsWith(order_id));
      if (!match) return err(`No encontré orden con prefijo ${order_id}.`);
      order_id = match.id;
    } catch (e) {
      return err(`Error buscando orden: ${(e as Error).message}`);
    }
  }

  const order = await adminGetOrderByIdPublic(order_id);
  if (!order) return err(`No encontré la orden ${shortId(order_id)}.`);

  // Customer requiere validación de access_token.
  if (ctx.actor.kind === "customer") {
    const expected = await adminGetOrderAccessToken(order_id);
    if (!expected || !access_token || !safeEqual(expected, access_token)) {
      return err("El token no coincide. Verificá el link que recibiste.");
    }
  }

  const items = order.order_items
    .map((it) => `  • ${it.qty}× ${it.product_name} — ${fmt(it.subtotal)}`)
    .join("\n");

  const phoneLine = ctx.actor.kind === "admin"
    ? `Tel: ${order.customer_phone ?? "—"}`
    : `Tel: ${maskPhone(order.customer_phone)}`;

  return ok(
    `📦 Pedido ${shortId(order.id)}\n` +
      `Cliente: ${order.customer_name ?? "—"}\n` +
      `${phoneLine}\n` +
      `Status: ${STATUS_LABEL[order.status]}\n` +
      `Items:\n${items}\n` +
      `Subtotal: ${fmt(order.subtotal)}\n` +
      `Envío: ${order.shipping === 0 ? "gratis" : fmt(order.shipping)}\n` +
      `Total: ${fmt(order.total)}\n` +
      `Notas: ${order.notes ?? "—"}\n` +
      `Fecha: ${new Date(order.created_at).toLocaleString("es-CL")}`,
  );
}

const FindCustomerSchema = z.object({
  phone: z.string().min(8),
});

export async function executeFindCustomerByPhone(
  args: unknown,
  ctx: AgentContext,
): Promise<ToolResult> {
  const parsed = FindCustomerSchema.safeParse(args);
  if (!parsed.success) return err(`Args inválidos: ${parsed.error.message}`);
  const phone = normalizePhone(parsed.data.phone);

  // Customer solo puede buscar SU propio phone.
  if (ctx.actor.kind === "customer") {
    const ownPhone = ctx.actor.phone ? normalizePhone(ctx.actor.phone) : null;
    if (!ownPhone || ownPhone !== phone) {
      return err("Por privacidad solo puedo buscar TUS pedidos. Pasame tu propio número.");
    }
  }

  let orders: AdminOrderRow[];
  try {
    orders = await adminListOrders();
  } catch (e) {
    return err(`Error consultando: ${(e as Error).message}`);
  }

  const matches = orders.filter((o) => o.customer_phone && normalizePhone(o.customer_phone) === phone);
  if (matches.length === 0) {
    return ok(`No encontré pedidos para ${maskPhone(phone)}.`);
  }

  const lines = matches.slice(0, 10).map((o) => {
    const items = o.order_items.map((it) => `${it.qty}× ${it.product_name}`).join(", ");
    return `• ${shortId(o.id)} · ${STATUS_LABEL[o.status]} · ${fmt(o.total)} · ${items}`;
  });

  return ok(
    `Encontré ${matches.length} pedido(s) para ${maskPhone(phone)}:\n${lines.join("\n")}`,
  );
}

// ─────── MUTACIONES (confirm-gated) ───────

const UpdateStatusSchema = z.object({
  order_id: z.string().min(8),
  new_status: z.enum(["confirmed", "preparing", "delivered", "cancelled"]),
  confirmed: z.boolean().default(false),
});

export async function executeUpdateOrderStatus(
  args: unknown,
  ctx: AgentContext,
): Promise<ToolResult> {
  if (ctx.actor.kind !== "admin") {
    return err("update_order_status es admin-only.");
  }
  const parsed = UpdateStatusSchema.safeParse(args);
  if (!parsed.success) return err(`Args inválidos: ${parsed.error.message}`);
  let { order_id } = parsed.data;
  const { new_status, confirmed } = parsed.data;

  // Expandir order_id corto.
  if (order_id.length === 8) {
    const all = await adminListOrders().catch(() => [] as AdminOrderRow[]);
    const match = all.find((o) => o.id.startsWith(order_id));
    if (!match) return err(`No encontré orden con prefijo ${order_id}.`);
    order_id = match.id;
  }

  const order = await adminGetOrderByIdPublic(order_id);
  if (!order) return err(`Orden ${shortId(order_id)} no existe.`);

  const summary = `Cambiar pedido ${shortId(order_id)} (${order.customer_name ?? "sin nombre"}, ${fmt(order.total)}) de "${STATUS_LABEL[order.status]}" → "${STATUS_LABEL[new_status]}".`;

  if (!confirmed) {
    return pending(summary, { order_id, new_status, confirmed: true });
  }

  // adminUpdateOrderStatus no tira: retorna { ok, error? }. Hay que chequearlo.
  const res = await adminUpdateOrderStatus(order_id, new_status).catch(
    (e: unknown) => ({ ok: false as const, error: e instanceof Error ? e.message : String(e) }),
  );
  if (!res.ok) {
    return err(`Falló la mutación: ${res.error ?? "error desconocido"}`);
  }

  return ok(`✓ ${summary}`);
}

const UpdateStockSchema = z.object({
  slug: z.string().min(1),
  new_stock_kg: z.number().min(0).max(999),
  confirmed: z.boolean().default(false),
});

export async function executeUpdateProductStock(
  args: unknown,
  ctx: AgentContext,
): Promise<ToolResult> {
  if (ctx.actor.kind !== "admin") {
    return err("update_product_stock es admin-only.");
  }
  const parsed = UpdateStockSchema.safeParse(args);
  if (!parsed.success) return err(`Args inválidos: ${parsed.error.message}`);
  const { slug, new_stock_kg, confirmed } = parsed.data;

  const products = await adminListProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) return err(`No existe producto con slug "${slug}". Slugs válidos: ${products.map((p) => p.slug).join(", ")}.`);

  const summary = `Cambiar stock de "${product.name}" (slug ${slug}) de ${product.stock_kg} kg → ${new_stock_kg} kg.`;

  if (!confirmed) {
    return pending(summary, { slug, new_stock_kg, confirmed: true });
  }

  // adminUpdateStock no tira: retorna { ok, error? }. Hay que chequearlo.
  const res = await adminUpdateStock(product.id, new_stock_kg).catch(
    (e: unknown) => ({ ok: false as const, error: e instanceof Error ? e.message : String(e) }),
  );
  if (!res.ok) {
    return err(`Falló la actualización: ${res.error ?? "error desconocido"}`);
  }

  return ok(`✓ ${summary}`);
}

// ─────── EFECTOS LATERALES ───────

const BuildWaSchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().min(1),
        bags: z.number().int().min(1).max(20),
      }),
    )
    .min(1),
  comuna: z.string().min(1),
  customer_name: z.string().min(1),
  address_or_reference: z.string().optional(),
  note: z.string().optional(),
});

export async function executeBuildWhatsappOrderMessage(
  args: unknown,
  _ctx: AgentContext,
): Promise<ToolResult> {
  const parsed = BuildWaSchema.safeParse(args);
  if (!parsed.success) return err(`Args inválidos: ${parsed.error.message}`);
  const { items, comuna, customer_name, address_or_reference, note } = parsed.data;

  // Resolver slugs → productos.
  const cartLines = items.map((i) => {
    const p = productsData.find((x) => x.slug === i.slug);
    if (!p) throw new Error(`Producto "${i.slug}" no existe.`);
    const minUnit = p.min_unit_kg ?? 1;
    return {
      kind: "product" as const,
      id: p.id,
      qty: minUnit * i.bags,
      name: p.name,
      pricePerUnit: p.price,
    };
  });

  const productsForUrl = productsData.map((p) => ({ id: p.id, name: p.name, price: p.price }));
  const subtotal = cartLines.reduce((s, l) => s + l.pricePerUnit * l.qty, 0);

  // Calcular shipping según comuna (reusamos shipping.ts via require dinámico para evitar cycle).
  const { getShippingCost } = await import("@/lib/shipping");
  type ComunaT = Parameters<typeof getShippingCost>[0];
  const shipping = getShippingCost(comuna as ComunaT, subtotal);
  const total = subtotal + shipping;

  const noteAugmented = [
    `Cliente: ${customer_name}`,
    address_or_reference ? `Dirección: ${address_or_reference}` : null,
    note ? `Nota: ${note}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const url = buildWaUrl(
    cartLines,
    productsForUrl,
    packsData as Pack[],
    noteAugmented,
    undefined,
    { comuna, shipping, total },
  );

  return ok(
    `URL generada (compartir al cliente):\n${url}\n\n` +
      `Resumen:\n` +
      cartLines.map((l) => `• ${l.qty} kg ${l.name} — ${fmt(l.pricePerUnit * l.qty)}`).join("\n") +
      `\nSubtotal: ${fmt(subtotal)} | Envío ${comuna}: ${shipping === 0 ? "gratis" : fmt(shipping)} | Total: ${fmt(total)}`,
  );
}

const NotifyOwnerSchema = z.object({
  order_id: z.string().min(8),
});

export async function executeNotifyOwnerWhatsapp(
  args: unknown,
  ctx: AgentContext,
): Promise<ToolResult> {
  if (ctx.actor.kind !== "admin") {
    return err("notify_owner_whatsapp es admin-only.");
  }
  const parsed = NotifyOwnerSchema.safeParse(args);
  if (!parsed.success) return err(`Args inválidos: ${parsed.error.message}`);
  let { order_id } = parsed.data;

  if (order_id.length === 8) {
    const all = await adminListOrders().catch(() => [] as AdminOrderRow[]);
    const match = all.find((o) => o.id.startsWith(order_id));
    if (!match) return err(`No encontré orden con prefijo ${order_id}.`);
    order_id = match.id;
  }

  const order = await adminGetOrderByIdPublic(order_id);
  if (!order) return err(`Orden ${shortId(order_id)} no existe.`);

  const ownerPhone = process.env.OWNER_WHATSAPP || "56953743338";
  const items = order.order_items.map((it) => `${it.qty}× ${it.product_name}`).join(", ");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.estacionsnack.cl";
  const text = encodeURIComponent(
    `🛒 Pedido nuevo confirmado\n` +
      `${order.customer_name ?? "—"} (${order.customer_phone ?? "—"})\n` +
      `Items: ${items}\n` +
      `Total: ${fmt(order.total)}\n` +
      `Ver: ${siteUrl}/pedido/${order.id}`,
  );
  const url = `https://wa.me/${ownerPhone}?text=${text}`;

  return ok(
    `URL hacia tu WhatsApp con el resumen:\n${url}\n\n(Tocá el link para abrir WhatsApp con el mensaje pre-armado.)`,
  );
}

const GenerateImageSchema = z.object({
  order_id: z.string().min(8),
});

export async function executeGenerateConfirmationImage(
  args: unknown,
  ctx: AgentContext,
): Promise<ToolResult> {
  if (ctx.actor.kind !== "admin") {
    return err("generate_confirmation_image es admin-only en MVP.");
  }
  const parsed = GenerateImageSchema.safeParse(args);
  if (!parsed.success) return err(`Args inválidos: ${parsed.error.message}`);
  let { order_id } = parsed.data;

  if (order_id.length === 8) {
    const all = await adminListOrders().catch(() => [] as AdminOrderRow[]);
    const match = all.find((o) => o.id.startsWith(order_id));
    if (!match) return err(`No encontré orden con prefijo ${order_id}.`);
    order_id = match.id;
  }

  const token = await adminGetOrderAccessToken(order_id);
  if (!token) return err(`Orden ${shortId(order_id)} sin token (raro — puede ser data legacy).`);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.estacionsnack.cl";
  const imageUrl = `${siteUrl}/api/og/order-confirmation?order=${order_id}&t=${token}`;

  return ok(
    `URL de la imagen de confirmación (1200×630, lista para WhatsApp preview):\n${imageUrl}`,
  );
}

// ─────── DISPATCH ───────

export type Executor = (args: unknown, ctx: AgentContext) => Promise<ToolResult>;

export const EXECUTORS: Record<string, Executor> = {
  list_orders: executeListOrders,
  get_order_details: executeGetOrderDetails,
  find_customer_by_phone: executeFindCustomerByPhone,
  update_order_status: executeUpdateOrderStatus,
  update_product_stock: executeUpdateProductStock,
  build_whatsapp_order_message: executeBuildWhatsappOrderMessage,
  notify_owner_whatsapp: executeNotifyOwnerWhatsapp,
  generate_confirmation_image: executeGenerateConfirmationImage,
};
