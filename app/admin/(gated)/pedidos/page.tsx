import { adminListOrders } from "@/lib/supabase/admin";
import PedidosFilter from "./PedidosFilter";

export const revalidate = 0;

export default async function PedidosPage() {
  const orders = await adminListOrders();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 4 }}>
          Pedidos
        </h1>
        <p style={{ fontSize: 14, color: "#5F5A52" }}>
          Los últimos 100 pedidos. Filtra por estado, haz clic para ver detalle.
        </p>
      </div>

      {orders.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid rgba(0,0,0,.06)", padding: 48, textAlign: "center" }}>
          <p style={{ fontWeight: 700 }}>Aún no hay pedidos</p>
          <p style={{ fontSize: 13, color: "#5F5A52", marginTop: 4 }}>Cuando lleguen aparecerán aquí.</p>
        </div>
      ) : (
        <PedidosFilter orders={orders} />
      )}
    </div>
  );
}
