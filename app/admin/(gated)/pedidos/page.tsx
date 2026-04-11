import { adminListOrders } from "@/lib/supabase/admin";
import OrderRow from "./OrderRow";

export const revalidate = 0;

export default async function PedidosPage() {
  const typed = await adminListOrders();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 4 }}>
          Pedidos
        </h1>
        <p style={{ fontSize: 14, color: "#5F5A52" }}>
          Los últimos 100 pedidos. Haz clic para ver detalle y cambiar estado.
        </p>
      </div>

      {typed.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid rgba(0,0,0,.06)", padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p style={{ fontWeight: 700 }}>Aún no hay pedidos</p>
          <p style={{ fontSize: 13, color: "#5F5A52", marginTop: 4 }}>Cuando lleguen aparecerán aquí.</p>
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
          {typed.map((o) => (
            <OrderRow key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
