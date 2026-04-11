import Link from "next/link";
import {
  adminDashboardData,
  type AdminOrderRow,
  type AdminCustomerRow,
} from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/types";

export const revalidate = 0;

type OrderRow = AdminOrderRow;
type CustomerRow = AdminCustomerRow;

const fmt = (n: number) => "$" + n.toLocaleString("es-CL");
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("es-CL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_whatsapp: "Pendiente",
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

export default async function DashboardPage() {
  const { orders: ordersRaw, customers } = await adminDashboardData();

  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const orders = ordersRaw ?? [];
  const custs = customers ?? [];

  const sum = (arr: OrderRow[]) => arr.reduce((a, o) => a + o.total, 0);
  const nonCancelled = orders.filter((o) => o.status !== "cancelled");
  const todayOrders = nonCancelled.filter((o) => o.created_at >= startToday);
  const weekOrders = nonCancelled.filter((o) => o.created_at >= startWeek);
  const monthOrders = nonCancelled;

  const byStatus: Record<string, number> = {};
  orders.forEach((o) => {
    byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
  });

  const topProducts: Record<string, { qty: number; total: number }> = {};
  nonCancelled.forEach((o) => {
    o.order_items?.forEach((it) => {
      if (!topProducts[it.product_name]) topProducts[it.product_name] = { qty: 0, total: 0 };
      topProducts[it.product_name].qty += Number(it.qty);
      topProducts[it.product_name].total += it.subtotal;
    });
  });
  const top = Object.entries(topProducts)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  const newCustomers = custs.filter(
    (c) => c.first_order_at && c.first_order_at >= startWeek
  ).length;

  const recent = orders.slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 32, fontWeight: 400, marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 14, color: "#5F5A52" }}>Resumen del mes en curso</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
        <MetricCard label="Ventas hoy" value={fmt(sum(todayOrders))} sub={`${todayOrders.length} pedidos`} accent="#FF6B35" />
        <MetricCard label="Ventas 7 días" value={fmt(sum(weekOrders))} sub={`${weekOrders.length} pedidos`} accent="#4A8C3F" />
        <MetricCard label="Ventas del mes" value={fmt(sum(monthOrders))} sub={`${monthOrders.length} pedidos`} accent="#7C5CBF" />
        <MetricCard label="Clientes nuevos" value={String(newCustomers)} sub="últimos 7 días" accent="#E8A817" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }} className="dashboard-grid">
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid rgba(0,0,0,.06)", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1.5px solid rgba(0,0,0,.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: ".06em", color: "#5F5A52" }}>Últimos pedidos</strong>
            <Link href="/admin/pedidos" style={{ fontSize: 12, color: "#FF6B35", fontWeight: 700 }}>Ver todos →</Link>
          </div>
          {recent.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#5F5A52", fontSize: 13 }}>Aún no hay pedidos este mes</div>
          ) : recent.map((o) => (
            <div key={o.id} style={{ display: "grid", gridTemplateColumns: "140px 1fr 100px 120px", gap: 12, padding: "12px 20px", borderBottom: "1px solid rgba(0,0,0,.04)", fontSize: 13, alignItems: "center" }}>
              <span style={{ color: "#5F5A52" }}>{fmtDate(o.created_at)}</span>
              <div>
                <div style={{ fontWeight: 700 }}>{o.customer_name ?? "—"}</div>
                <div style={{ fontSize: 11, color: "#5F5A52" }}>{o.customer_phone}</div>
              </div>
              <strong>{fmt(o.total)}</strong>
              <span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[o.status], display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR[o.status], display: "inline-block" }} />
                {STATUS_LABEL[o.status]}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid rgba(0,0,0,.06)", padding: 20 }}>
            <strong style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: ".06em", color: "#5F5A52", display: "block", marginBottom: 14 }}>Pedidos por estado</strong>
            {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => (
              <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: "1px dashed rgba(0,0,0,.05)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: STATUS_COLOR[s] }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR[s], display: "inline-block" }} />
                  {STATUS_LABEL[s]}
                </span>
                <strong>{byStatus[s] ?? 0}</strong>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid rgba(0,0,0,.06)", padding: 20 }}>
            <strong style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: ".06em", color: "#5F5A52", display: "block", marginBottom: 14 }}>Top productos del mes</strong>
            {top.length === 0 ? (
              <div style={{ fontSize: 13, color: "#5F5A52" }}>Sin datos todavía</div>
            ) : top.map(([name, stats], i) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: "1px dashed rgba(0,0,0,.05)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 18, fontSize: 11, color: "#5F5A52" }}>#{i + 1}</span>
                  <span style={{ fontWeight: 700 }}>{name}</span>
                </span>
                <span style={{ color: "#5F5A52" }}>
                  {stats.qty} kg · <strong style={{ color: "#1A1816" }}>{fmt(stats.total)}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function MetricCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid rgba(0,0,0,.06)", padding: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#5F5A52", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-.02em", color: accent, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "#5F5A52" }}>{sub}</div>
    </div>
  );
}
