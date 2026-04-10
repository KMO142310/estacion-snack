import { createClient } from "@/lib/supabase/server";
import StockEditor from "./StockEditor";
import type { Product } from "@/lib/types";

export const revalidate = 0;

export default async function ProductosPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 4 }}>
          Productos
        </h1>
        <p style={{ fontSize: 14, color: "#5F5A52" }}>
          Edita el stock directamente. Los cambios se reflejan en la tienda al instante.
        </p>
      </div>
      <StockEditor products={(products ?? []) as Product[]} />
    </div>
  );
}
