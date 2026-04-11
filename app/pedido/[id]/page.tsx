import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { createHash } from "node:crypto";
import Link from "next/link";
import type { Metadata } from "next";
import {
  adminGetOrderByIdPublic,
  adminLogOrderView,
} from "@/lib/supabase/admin";
import { safeEqual } from "@/lib/crypto";
import { WA } from "@/lib/products";
import type { OrderStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tu pedido · Estación Snack",
  robots: { index: false, follow: false },
};

// Force every request to be dynamic so the token check runs fresh and the
// audit row is written on every view. This route should never be cached.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_whatsapp: "Pendiente de confirmación",
  confirmed: "Confirmado",
  preparing: "En preparación",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending_whatsapp: "#E8A817",
  confirmed: "#4A8C3F",
  preparing: "#FF6B35",
  delivered: "#1A1816",
  cancelled: "#D94B4B",
};

const STATUS_COPY: Record<OrderStatus, string> = {
  pending_whatsapp: "Envianos el pedido por WhatsApp para confirmarlo.",
  confirmed: "Recibimos tu pedido y lo estamos preparando.",
  preparing: "Estamos armando tu pedido. Lo despachamos martes o viernes.",
  delivered: "Tu pedido fue entregado. ¡Gracias por confiar en nosotros!",
  cancelled:
    "Este pedido fue cancelado. Si fue un error, escribinos por WhatsApp.",
};

const fmt = (n: number) => "$" + n.toLocaleString("es-CL");
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

/**
 * Mask a Chilean phone number preserving only country code, mobile prefix,
 * and last 4 digits. `+56 9 5678 1234` → `+56 9 **** 1234`.
 * Never throws; returns "—" on unparseable input.
 */
function maskPhone(phone: string | null): string {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "—";
  const last4 = digits.slice(-4);
  // Chilean mobile: +56 9 XXXX XXXX → show +56 9 **** XXXX
  if (digits.startsWith("569") || digits.startsWith("56")) {
    return `+56 9 **** ${last4}`;
  }
  return `**** ${last4}`;
}

/**
 * Strip things from notes that look like RUT or card numbers before
 * rendering. Keeps the customer's free-text message but redacts anything
 * that patterns as sensitive PII. Not a full XSS guard — JSX already
 * escapes, this is specifically about PII minimization (GDPR §5.1.c).
 */
function sanitizeNotes(notes: string | null): string | null {
  if (!notes) return null;
  let out = notes;
  // Chilean RUT: 12.345.678-9 or 12345678-9 or 12345678-K
  out = out.replace(/\b\d{1,2}\.?\d{3}\.?\d{3}-[0-9kK]\b/g, "[rut redactado]");
  // Credit card number heuristic: 13-19 digits, possibly with spaces/dashes
  out = out.replace(/\b(?:\d[ -]*?){13,19}\b/g, "[número redactado]");
  return out;
}

/** sha256(pepper || value) hex — short, stable, no PII leak. */
function hashWithPepper(value: string | null, pepper: string): string | null {
  if (!value) return null;
  return createHash("sha256").update(pepper).update(value).digest("hex");
}

/** Parse the host out of a Referer header if any. Never stores the full URL. */
function parseRefererHost(referer: string | null): string | null {
  if (!referer) return null;
  try {
    return new URL(referer).host;
  } catch {
    return null;
  }
}

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string | string[] }>;
}) {
  const { id } = await params;
  const { t } = await searchParams;

  // Defense: 404 on any structural issue. We NEVER distinguish between
  // "not found" / "wrong token" / "expired token" because that helps an
  // enumerator map the namespace. OWASP ASVS §4.2.1.
  if (!isUuid(id)) notFound();
  const token = typeof t === "string" ? t : Array.isArray(t) ? t[0] : null;
  if (!token || token.length === 0) notFound();

  const order = await adminGetOrderByIdPublic(id);
  if (!order) notFound();

  // Constant-time compare (lib/crypto.ts:safeEqual) — never use === on
  // tokens. CWE-208 timing side-channel.
  if (!safeEqual(order.access_token, token)) notFound();

  // TTL check: expired tokens are treated identically to wrong tokens.
  const now = Date.now();
  const expiresMs = new Date(order.access_token_expires_at).getTime();
  if (!Number.isFinite(expiresMs) || expiresMs <= now) notFound();

  // Audit write. Fail-closed on missing pepper: if AUDIT_PEPPER is not
  // configured, we render the page WITHOUT writing to audit_log_order_views
  // so customers don't hit 500 on a server misconfig. We log the miss to
  // the server console so the operator notices.
  const pepper = process.env.AUDIT_PEPPER;
  if (!pepper) {
    console.error(
      "[pedido/[id]] AUDIT_PEPPER not configured — audit row NOT written",
    );
  } else {
    try {
      const h = await headers();
      const ip =
        h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        h.get("x-real-ip") ??
        null;
      const ua = h.get("user-agent");
      const referer = h.get("referer");
      await adminLogOrderView(
        order.id,
        hashWithPepper(ip, pepper),
        hashWithPepper(ua, pepper),
        parseRefererHost(referer),
      );
    } catch (err) {
      // Never block the page render on a logging failure.
      console.error("[pedido/[id]] audit log write failed", err);
    }
  }

  const maskedPhone = maskPhone(order.customer_phone);
  const safeNotes = sanitizeNotes(order.notes);
  const waMsg = encodeURIComponent(
    `Hola! Consulto por mi pedido ${order.id.slice(0, 8)}`,
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "32px 20px 48px",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            fontSize: 13,
            color: "var(--sub)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 20,
          }}
        >
          ← Volver a la tienda
        </Link>

        <div
          style={{
            background: "#fff",
            borderRadius: "var(--r-lg)",
            padding: 28,
            border: "1.5px solid rgba(0,0,0,.06)",
            boxShadow: "0 2px 12px rgba(0,0,0,.04)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              color: "var(--sub)",
              marginBottom: 6,
            }}
          >
            Pedido
          </div>
          <h1
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: 32,
              fontWeight: 400,
              letterSpacing: "-.01em",
              marginBottom: 4,
            }}
          >
            {order.customer_name ?? "Cliente"}
          </h1>
          <p
            style={{
              fontSize: 12,
              color: "var(--sub)",
              fontFamily: "monospace",
              marginBottom: 4,
            }}
          >
            {order.id}
          </p>
          <p
            style={{
              fontSize: 12,
              color: "var(--sub)",
              marginBottom: 20,
            }}
          >
            Teléfono: {maskedPhone}
          </p>

          <div
            style={{
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
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: STATUS_COLOR[order.status],
                display: "inline-block",
              }}
            />
            {STATUS_LABEL[order.status]}
          </div>

          <p
            style={{
              fontSize: 14,
              color: "var(--sub)",
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            {STATUS_COPY[order.status]}
          </p>

          <div
            style={{
              fontSize: 12,
              color: "var(--sub)",
              marginBottom: 20,
            }}
          >
            Recibido el{" "}
            <strong style={{ color: "var(--text)" }}>
              {fmtDate(order.created_at)}
            </strong>
          </div>

          <div
            style={{
              borderTop: "2px solid rgba(0,0,0,.06)",
              paddingTop: 20,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".06em",
                color: "var(--sub)",
                marginBottom: 12,
              }}
            >
              Items
            </div>
            {order.order_items.map((it) => (
              <div
                key={it.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px dashed rgba(0,0,0,.06)",
                  fontSize: 14,
                }}
              >
                <span>
                  {it.product_name}{" "}
                  <span style={{ color: "var(--sub)" }}>· {it.qty} kg</span>
                </span>
                <strong>{fmt(it.subtotal)}</strong>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "16px 0",
              borderTop: "3px solid var(--text)",
            }}
          >
            <span
              style={{ fontSize: 13, fontWeight: 700, color: "var(--sub)" }}
            >
              Total
            </span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: "-.02em",
              }}
            >
              {fmt(order.total)}
            </span>
          </div>

          {safeNotes && (
            <div
              style={{
                marginTop: 16,
                padding: 14,
                background: "rgba(0,0,0,.03)",
                borderRadius: 12,
                fontSize: 13,
                color: "var(--sub)",
              }}
            >
              <strong
                style={{
                  color: "var(--text)",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Notas
              </strong>
              {safeNotes}
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
