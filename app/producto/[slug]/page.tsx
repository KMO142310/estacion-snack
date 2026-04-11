import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getProducts } from "@/lib/actions";
import { CartProvider } from "@/lib/cart-context";
import ProductDetail from "./ProductDetail";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Producto no encontrado · Estación Snack" };
  }
  const title = `${product.name} por kilo · Estación Snack`;
  const description = product.copy ?? `${product.name} fresco por kilo en Santa Cruz. Pide por WhatsApp.`;
  const image = product.image_url;
  return {
    title,
    description,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/producto/${product.slug}`,
      images: image ? [{ url: image, width: 800, height: 800, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
  ]);
  if (!product) notFound();

  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const SITE =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.estacionsnack.cl";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.copy,
    image: product.image_url,
    sku: product.slug,
    category: product.cat_label,
    brand: { "@type": "Brand", name: "Estación Snack" },
    offers: {
      "@type": "Offer",
      priceCurrency: "CLP",
      price: product.price,
      availability:
        product.status === "agotado"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: `${SITE}/producto/${product.slug}`,
    },
  };

  return (
    <CartProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} related={related} />
    </CartProvider>
  );
}
