import { notFound } from "next/navigation";
import type { Metadata } from "next";
import productsData from "@/data/products.json";
import ProductDetail from "./ProductDetail";
import { safeJsonLd } from "@/lib/json-ld";

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

  // Precio válido hasta 30 días desde generación (requerido Google Search Console desde 2023).
  const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

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
      priceValidUntil,
      availability:
        product.status === "agotado"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: `${SITE}/producto/${product.slug}`,
      seller: {
        "@type": "Store",
        "@id": `${SITE}/#business`,
        name: "Estación Snack",
      },
      // Google rich results requiere hasMerchantReturnPolicy desde 2023.
      // 10 días hábiles por Ley 19.496 art. 3 bis.
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "CL",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 10,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 2000,
          currency: "CLP",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "CL",
          addressRegion: "VI",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 2,
            unitCode: "DAY",
          },
        },
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
      { "@type": "ListItem", position: 2, name: "Productos", item: `${SITE}/#productos` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${SITE}/producto/${product.slug}` },
    ],
  };

  // Cast to the Product type ProductDetail expects
  const productForDetail = product as unknown as import("@/lib/types").Product;
  const relatedForDetail = related as unknown as import("@/lib/types").Product[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <ProductDetail
        product={productForDetail}
        related={relatedForDetail}
        allProducts={allProducts as unknown as import("@/lib/types").Product[]}
      />
    </>
  );
}
