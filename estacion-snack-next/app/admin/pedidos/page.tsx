import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

const STATUS_LABEL: Record<string, string> = {
  pending_whatsapp: "Pendiente WA",
  confirmed:        "Confirmado",
  preparing:        "Preparando",
  delivered:        "Entregado",
  cancelled:        "Cancelado",
};
const STATUS_COLOR: Record<string, string> = {
  pending_whatsapp: "#E8A817",
  confirmed:        "#4A8C3F",
  preparing:        "#FF6B35",
  delivered:        "#5F5A52",
  cancelled:        "#D94B4B",
};

export default async function PedidosPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(100);

  const fmt = (n: number) => "$" + n.toLocaleString("es-CL");
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("es-CL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 4 }}>
          Pedidos
        </h1>
        <p style={{ fontSize: 14, color: "#5F5A52" }}>
          Los últimos 100 pedidos. Edición de estados disponible en Fase 2.
        </p>
      </div>

      {!orders?.length ? (
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid rgba(0,0,0,.06)", padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p style={{ fontWeight: 700 }}>Aún no hay pedidos</p>
          <p style={{ fontSize: 13, color: "#5F5A52", marginTop: 4 }}>Cuando lleguen aparecerán aquí.</p>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid rgba(0,0,0,.06)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 100px 120px 120px", gap: 16, padding: "12px 20px", background: "#f8f8f6", borderBottom: "1.5px solid rgba(0,0,0,.06)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#5F5A52" }}>
            <span>Fecha</span>
            <span>Cliente</span>
            <span>Total</span>
            <span>Estado</span>
            <span>ID</span>
          </div>
          {orders.map((o) => (
            <div key={o.id} style={{ display: "grid", gridTemplateColumns: "160px 1fr 100px 120px 120px", gap: 16, padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,.04)", alignItems: "center", fontSize: 13 }}>
              <span style={{ color: "#5F5A52" }}>{fmtDate(o.created_at)}</span>
              <div>
                <div style={{ fontWeight: 700 }}>{o.customer_name ?? "—"}</div>
                <div style={{ fontSize: 11, color: "#5F5A52" }}>{o.customer_phone}</div>
              </div>
              <span style={{ fontWeight: 700 }}>{fmt(o.total)}</span>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                fontWeight: 700,
                color: STATUS_COLOR[o.status] ?? "#5F5A52",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR[o.status], display: "inline-block" }} />
                {STATUS_LABEL[o.status] ?? o.status}
              </span>
              <span style={{ fontSize: 10, color: "#5F5A52", fontFamily: "monospace" }}>{o.id.slice(0, 8)}…</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
