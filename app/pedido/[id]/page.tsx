import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/server";
import { WA } from "@/lib/products";
import type { OrderStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tu pedido · Estación Snack",
  robots: { index: false, follow: false },
};

export const revalidate = 0;

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_whatsapp: "Pendiente de confirmación",
  confirmed:        "Confirmado",
  preparing:        "En preparación",
  delivered:        "Entregado",
  cancelled:        "Cancelado",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending_whatsapp: "#E8A817",
  confirmed:        "#4A8C3F",
  preparing:        "#FF6B35",
  delivered:        "#1A1816",
  cancelled:        "#D94B4B",
};

const STATUS_COPY: Record<OrderStatus, string> = {
  pending_whatsapp: "Envianos el pedido por WhatsApp para confirmarlo.",
  confirmed:        "Recibimos tu pedido y lo estamos preparando.",
  preparing:        "Estamos armando tu pedido. Lo despachamos martes o viernes.",
  delivered:        "Tu pedido fue entregado. ¡Gracias por confiar en nosotros!",
  cancelled:        "Este pedido fue cancelado. Si fue un error, escribinos por WhatsApp.",
};

const fmt = (n: number) => "$" + n.toLocaleString("es-CL");
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isUuid(id)) notFound();

  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("id, created_at, customer_name, total, subtotal, shipping, status, notes, order_items(id, product_name, qty, unit_price, subtotal)")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const order = data as {
    id: string;
    created_at: string;
    customer_name: string | null;
    total: number;
    subtotal: number;
    shipping: number;
    status: OrderStatus;
    notes: string | null;
    order_items: Array<{ id: string; product_name: string; qty: number; unit_price: number; subtotal: number }>;
  };

  const waMsg = encodeURIComponent(`Hola! Consulto por mi pedido ${order.id.slice(0, 8)}`);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", padding: "32px 20px 48px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--sub)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
          ← Volver a la tienda
        </Link>

        <div style={{
          background: "#fff",
          borderRadius: "var(--r-lg)",
          padding: 28,
          border: "1.5px solid rgba(0,0,0,.06)",
          boxShadow: "0 2px 12px rgba(0,0,0,.04)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--sub)", marginBottom: 6 }}>
            Pedido
          </div>
          <h1 style={{
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontSize: 32,
            fontWeight: 400,
            letterSpacing: "-.01em",
            marginBottom: 4,
          }}>
            {order.customer_name ?? "Cliente"}
          </h1>
          <p style={{ fontSize: 12, color: "var(--sub)", fontFamily: "monospace", marginBottom: 20 }}>
            {order.id}
          </p>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            borderRadius: "var(--r-full)",
            background: STATUS_COLOR[order.status] + "22",
            color: STATUS_COLOR[order.status],
            fontSize: 13,
            fontWeight: 800,
            marginBottom: 16,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[order.status], display: "inline-block" }} />
            {STATUS_LABEL[order.status]}
          </div>

          <p style={{ fontSize: 14, color: "var(--sub)", lineHeight: 1.6, marginBottom: 24 }}>
            {STATUS_COPY[order.status]}
          </p>

          <div style={{ fontSize: 12, color: "var(--sub)", marginBottom: 20 }}>
            Recibido el <strong style={{ color: "var(--text)" }}>{fmtDate(order.created_at)}</strong>
          </div>

          <div style={{ borderTop: "2px solid rgba(0,0,0,.06)", paddingTop: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--sub)", marginBottom: 12 }}>
              Items
            </div>
            {order.order_items.map((it) => (
              <div key={it.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px dashed rgba(0,0,0,.06)", fontSize: 14 }}>
                <span>
                  {it.product_name} <span style={{ color: "var(--sub)" }}>· {it.qty} kg</span>
                </span>
                <strong>{fmt(it.subtotal)}</strong>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "16px 0", borderTop: "3px solid var(--text)" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--sub)" }}>Total</span>
            <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-.02em" }}>{fmt(order.total)}</span>
          </div>

          {order.notes && (
            <div style={{ marginTop: 16, padding: 14, background: "rgba(0,0,0,.03)", borderRadius: 12, fontSize: 13, color: "var(--sub)" }}>
              <strong style={{ color: "var(--text)", display: "block", marginBottom: 4 }}>Notas</strong>
              {order.notes}
            </div>
          )}

          <a
            href={`https://wa.me/${WA}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginTop: 24,
              padding: 16,
              background: "#25D366",
              color: "#fff",
              fontSize: 15,
              fontWeight: 800,
              borderRadius: 14,
            }}
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
