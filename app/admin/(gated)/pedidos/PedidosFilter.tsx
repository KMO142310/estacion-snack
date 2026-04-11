"use client";

import { useState } from "react";
import OrderRow from "./OrderRow";
import type { OrderStatus } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  all:              "Todos",
  pending_whatsapp: "Pendiente",
  confirmed:        "Confirmado",
  preparing:        "Preparando",
  delivered:        "Entregado",
  cancelled:        "Cancelado",
};

const STATUS_COLOR: Record<string, string> = {
  all:              "#1A1816",
  pending_whatsapp: "#E8A817",
  confirmed:        "#4A8C3F",
  preparing:        "#FF6B35",
  delivered:        "#5F5A52",
  cancelled:        "#D94B4B",
};

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

interface Props {
  orders: Order[];
}

export default function PedidosFilter({ orders }: Props) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all"
    ? orders
    : orders.filter((o) => o.status === filter);

  const counts: Record<string, number> = { all: orders.length };
  orders.forEach((o) => {
    counts[o.status] = (counts[o.status] ?? 0) + 1;
  });

  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {Object.keys(STATUS_LABEL).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "8px 14px",
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 20,
              border: `2px solid ${filter === s ? STATUS_COLOR[s] : "rgba(0,0,0,.1)"}`,
              background: filter === s ? STATUS_COLOR[s] : "#fff",
              color: filter === s ? "#fff" : "#5F5A52",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {STATUS_LABEL[s]}
            {counts[s] !== undefined && (
              <span style={{
                minWidth: 18,
                height: 18,
                padding: "0 5px",
                background: filter === s ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.06)",
                borderRadius: 9,
                fontSize: 10,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {counts[s] ?? 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid rgba(0,0,0,.06)", padding: 40, textAlign: "center", color: "#5F5A52", fontSize: 14 }}>
          No hay pedidos con este estado.
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid rgba(0,0,0,.06)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 110px 150px 32px", gap: 16, padding: "12px 20px", background: "#f8f8f6", borderBottom: "1.5px solid rgba(0,0,0,.06)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#5F5A52" }}>
            <span>Fecha</span>
            <span>Cliente</span>
            <span>Total</span>
            <span>Estado</span>
            <span></span>
          </div>
          {filtered.map((o) => (
            <OrderRow key={o.id} order={o} />
          ))}
        </div>
      )}
    </>
  );
}
