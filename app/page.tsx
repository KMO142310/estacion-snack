import { getProducts } from "@/lib/actions";
import { CartProvider } from "@/lib/cart-context";
import PageShell from "@/components/PageShell";

export const revalidate = 60; // ISR: revalidate every 60s

export default async function HomePage() {
  const products = await getProducts();

  return (
    <CartProvider>
      <PageShell products={products} />
    </CartProvider>
  );
}
