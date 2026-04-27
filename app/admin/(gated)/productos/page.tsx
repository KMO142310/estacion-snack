import { adminListProducts } from "@/lib/supabase/admin";
import StockEditor from "./StockEditor";

export const revalidate = 0;

export default async function ProductosPage() {
  const products = await adminListProducts();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 4 }}>
          Productos
        </h1>
        <p style={{ fontSize: 14, color: "#5F5A52" }}>
          Edita stock y visibilidad. Los cambios se reflejan en la tienda al instante.
        </p>
      </div>
      <StockEditor products={products} />
    </div>
  );
}
