import { notFound } from "next/navigation";
import type { Metadata } from "next";
import productsData from "@/data/products.json";
import ProductDetail from "./ProductDetail";

export const dynamic = "force-static";

type RawProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  cat_label: string;
  price: number;
  unit: string;
  stock_kg: number;
  status: string;
  image_url: string;
  image_webp_url: string;
  image_400_url: string;
  copy: string;
  long_copy?: string;
  badge: string | null;
  sort_order: number;
  min_unit_kg: number;
  occasion?: string | null;
};

const allProducts = productsData as RawProduct[];

export async function generateStaticParams() {
  return allProducts.map((p) => ({ slug: p.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = allProducts.find((p) => p.slug === slug);
  if (!product) {
    return { title: "Producto no encontrado" };
  }
  const title = `${product.name} por kilo`;
  const description =
    product.copy ?? `${product.name} fresco por kilo en Santa Cruz. Pide por WhatsApp.`;
  return {
    title,
    description,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/producto/${product.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = allProducts.find((p) => p.slug === slug);
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
    description: product.copy || product.name,
    image: product.image_url.startsWith("http")
      ? product.image_url
      : `${SITE}${product.image_url}`,
    sku: product.slug,
    category: product.cat_label,
    brand: { "@type": "Brand", name: "Estación Snack" },
    offers: {
      "@type": "Offer",
      priceCurrency: "CLP",
      price: String(product.price),
      availability:
        product.status === "agotado"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: `${SITE}/producto/${product.slug}`,
      seller: {
        "@type": "LocalBusiness",
        "@id": `${SITE}/#business`,
        name: "Estación Snack",
      },
    },
  };

  // Cast to the Product type ProductDetail expects
  const productForDetail = product as unknown as import("@/lib/types").Product;
  const relatedForDetail = related as unknown as import("@/lib/types").Product[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail
        product={productForDetail}
        related={relatedForDetail}
        allProducts={allProducts as unknown as import("@/lib/types").Product[]}
      />
    </>
  );
}
