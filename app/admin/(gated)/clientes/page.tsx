import { adminListCustomers } from "@/lib/supabase/admin";

export const revalidate = 0;

export default async function ClientesPage() {
  const customers = await adminListCustomers();

  const fmt = (n: number) => "$" + n.toLocaleString("es-CL");
  const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "2-digit" }) : "—";

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 4 }}>
          Clientes
        </h1>
        <p style={{ fontSize: 14, color: "#5F5A52" }}>
          {customers?.length ?? 0} clientes registrados. Vista completa en Fase 2.
        </p>
      </div>

      {!customers?.length ? (
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid rgba(0,0,0,.06)", padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
          <p style={{ fontWeight: 700 }}>Aún no hay clientes</p>
          <p style={{ fontSize: 13, color: "#5F5A52", marginTop: 4 }}>Aparecerán aquí cuando se haga el primer pedido.</p>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid rgba(0,0,0,.06)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 100px 120px 160px", gap: 16, padding: "12px 20px", background: "#f8f8f6", borderBottom: "1.5px solid rgba(0,0,0,.06)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#5F5A52" }}>
            <span>Cliente</span>
            <span>Teléfono</span>
            <span>Pedidos</span>
            <span>Gasto total</span>
            <span>Último pedido</span>
          </div>
          {customers.map((c) => (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1fr 140px 100px 120px 160px", gap: 16, padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,.04)", alignItems: "center", fontSize: 13 }}>
              <div style={{ fontWeight: 700 }}>{c.name ?? "—"}</div>
              <span style={{ color: "#5F5A52" }}>{c.phone}</span>
              <span style={{ fontWeight: 700 }}>{c.total_orders}</span>
              <span style={{ fontWeight: 700 }}>{fmt(c.total_spent)}</span>
              <span style={{ color: "#5F5A52", fontSize: 12 }}>{fmtDate(c.last_order_at)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
