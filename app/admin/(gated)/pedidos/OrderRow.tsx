"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/lib/admin-actions";
import type { OrderStatus } from "@/lib/types";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_whatsapp: "Pendiente WA",
  confirmed:        "Confirmado",
  preparing:        "Preparando",
  delivered:        "Entregado",
  cancelled:        "Cancelado",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending_whatsapp: "#E8A817",
  confirmed:        "#4A8C3F",
  preparing:        "#FF6B35",
  delivered:        "#5F5A52",
  cancelled:        "#D94B4B",
};

const STATUSES: OrderStatus[] = ["pending_whatsapp", "confirmed", "preparing", "delivered", "cancelled"];

interface OrderItemRow {
  id: string;
  product_name: string;
  qty: number;
  unit_price: number;
  subtotal: number;
}

interface Order {
  id: string;
  created_at: string;
  customer_name: string | null;
  customer_phone: string | null;
  total: number;
  status: OrderStatus;
  notes: string | null;
  order_items: OrderItemRow[];
}

const fmt = (n: number) => "$" + n.toLocaleString("es-CL");
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("es-CL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export default function OrderRow({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const changeStatus = (next: OrderStatus) => {
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, next);
      if (result.ok) setStatus(next);
      else setError(result.error ?? "Error");
    });
  };

  return (
    <div style={{ borderBottom: "1px solid rgba(0,0,0,.04)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "150px 1fr 110px 150px 32px",
          gap: 16,
          padding: "14px 20px",
          alignItems: "center",
          fontSize: 13,
          cursor: "pointer",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <span style={{ color: "#5F5A52" }}>{fmtDate(order.created_at)}</span>
        <div>
          <div style={{ fontWeight: 700 }}>{order.customer_name ?? "—"}</div>
          <div style={{ fontSize: 11, color: "#5F5A52" }}>{order.customer_phone}</div>
        </div>
        <span style={{ fontWeight: 700 }}>{fmt(order.total)}</span>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 11,
          fontWeight: 700,
          color: STATUS_COLOR[status],
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR[status], display: "inline-block" }} />
          {STATUS_LABEL[status]}
        </span>
        <span style={{ fontSize: 11, color: "#5F5A52" }}>{open ? "▴" : "▾"}</span>
      </div>

      {open && (
        <div style={{ background: "#FDFCF8", padding: "16px 20px 20px 20px", borderTop: "1px solid rgba(0,0,0,.04)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#5F5A52", marginBottom: 8 }}>
                Items
              </div>
              {order.order_items.map((it) => (
                <div key={it.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, borderBottom: "1px dashed rgba(0,0,0,.05)" }}>
                  <span>{it.product_name} <span style={{ color: "#5F5A52" }}>× {it.qty} kg</span></span>
                  <strong>{fmt(it.subtotal)}</strong>
                </div>
              ))}
              {order.notes && (
                <div style={{ marginTop: 12, fontSize: 12, color: "#5F5A52" }}>
                  <strong style={{ color: "#1A1816" }}>Notas:</strong> {order.notes}
                </div>
              )}
              <div style={{ marginTop: 8, fontSize: 11, fontFamily: "monospace", color: "#5F5A52" }}>
                ID: {order.id}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#5F5A52", marginBottom: 8 }}>
                Cambiar estado
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => changeStatus(s)}
                    disabled={pending || s === status}
                    style={{
                      padding: "8px 12px",
                      fontSize: 12,
                      fontWeight: 700,
                      borderRadius: 8,
                      border: `2px solid ${s === status ? STATUS_COLOR[s] : "rgba(0,0,0,.1)"}`,
                      background: s === status ? STATUS_COLOR[s] : "#fff",
                      color: s === status ? "#fff" : "#1A1816",
                      cursor: pending || s === status ? "default" : "pointer",
                      opacity: pending ? 0.6 : 1,
                    }}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
              {error && <p style={{ marginTop: 8, fontSize: 12, color: "#D94B4B" }}>{error}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
