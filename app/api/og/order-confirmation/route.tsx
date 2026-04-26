import { ImageResponse } from "next/og";
import { adminGetOrderByIdPublic } from "@/lib/supabase/admin";
import { safeEqual } from "@/lib/crypto";

/**
 * Genera una imagen de confirmación 1200×630 (PNG) para enviar al cliente
 * adjunta al mensaje de WhatsApp post-pedido.
 *
 * Diseño: estilo Apple del sitio — fondo crema, texto oscuro, pill buttons.
 * Contenido: "Gracias, <nombre> 🎉" + lista compacta de items + total.
 *
 * Auth: query param `t` debe matchear `orders.access_token` (timing-safe).
 * Sin token válido → 404 (no leak de existencia de la orden).
 *
 * Cache: 1 hora pública. La orden no cambia post-confirmación; si cambia
 * (ej. cancelación), el `confirmed_at` cambia y el access_token rota,
 * invalidando esta URL implícitamente.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SIZE = { width: 1200, height: 630 };

// Helpers (duplicados livianos de cart-utils para evitar bundling client deps).
function fmt(n: number) {
  return `$${n.toLocaleString("es-CL")}`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("order");
  const token = url.searchParams.get("t");

  if (!orderId || !token) {
    return new Response("Missing params", { status: 400 });
  }

  const order = await adminGetOrderByIdPublic(orderId);
  if (!order) {
    return new Response("Not found", { status: 404 });
  }

  // Token validation BEFORE rendering anything (constant-time).
  if (!safeEqual(token, order.access_token)) {
    return new Response("Not found", { status: 404 });
  }

  // Token expiration check.
  if (new Date(order.access_token_expires_at).getTime() < Date.now()) {
    return new Response("Expired", { status: 410 });
  }

  const customerName = (order.customer_name ?? "").trim() || "Cliente";
  const items = order.order_items.slice(0, 6); // top 6 para no overflow
  const overflowCount = order.order_items.length - items.length;

  return new ImageResponse(
    (
      <div
        style={{
          width: SIZE.width,
          height: SIZE.height,
          display: "flex",
          flexDirection: "column",
          background: "#F4EADB",
          padding: "72px 96px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Header brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#5A1F1A",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 44,
              height: 44,
              background: "#5A1F1A",
              color: "#F4EADB",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            ES
          </div>
          Estación Snack
        </div>

        {/* Greeting */}
        <div
          style={{
            display: "flex",
            fontSize: 78,
            fontWeight: 700,
            color: "#1d1d1f",
            letterSpacing: "-0.022em",
            lineHeight: 1.05,
            marginBottom: 12,
            maxWidth: 1000,
          }}
        >
          Gracias, {customerName} 🎉
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#5E6B3E",
            marginBottom: 40,
            lineHeight: 1.4,
          }}
        >
          Tu pedido está confirmado. Te avisamos cuando esté en camino.
        </div>

        {/* Items list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "rgba(255,255,255,0.72)",
            borderRadius: 20,
            padding: "28px 32px",
            marginBottom: 28,
            gap: 10,
          }}
        >
          {items.map((it) => (
            <div
              key={it.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 22,
                color: "#1d1d1f",
              }}
            >
              <span style={{ fontWeight: 500 }}>
                {it.qty > 1 ? `${it.qty}× ` : ""}
                {it.product_name}
              </span>
              <span style={{ fontWeight: 600 }}>{fmt(it.subtotal)}</span>
            </div>
          ))}
          {overflowCount > 0 && (
            <div style={{ display: "flex", fontSize: 18, color: "#86868b", marginTop: 4 }}>
              + {overflowCount} {overflowCount === 1 ? "ítem más" : "ítems más"}
            </div>
          )}
        </div>

        {/* Total */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 32,
            color: "#5A1F1A",
            fontWeight: 700,
            paddingTop: 8,
          }}
        >
          <span>Total</span>
          <span style={{ fontSize: 56, letterSpacing: "-0.02em" }}>{fmt(order.total)}</span>
        </div>

        {/* Footer accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "#A8411A",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...SIZE,
      headers: {
        // 1h pública, 24h SWR. La orden no cambia post-confirmación.
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
