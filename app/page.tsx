import PageShell from "@/components/PageShell";
import productsData from "@/data/products.json";
import { topFaqs } from "@/data/faq";
import { safeJsonLd } from "@/lib/json-ld";
import { absoluteUrl, buildMetaDescription, SITE_URL } from "@/lib/site";

// Sin Supabase. Sin revalidación. Datos servidos desde data/products.json (build time).
export const dynamic = "force-static";

export default function HomePage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/#catalogo`,
    name: "Catálogo de Estación Snack",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: productsData.length,
    itemListElement: productsData.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/producto/${product.slug}`,
      item: {
        "@type": "Product",
        name: product.name,
        image: absoluteUrl(product.image_url),
        description: buildMetaDescription(product.long_copy ?? product.copy),
        category: product.cat_label,
        offers: {
          "@type": "Offer",
          priceCurrency: "CLP",
          price: String(product.price),
          availability:
            product.status === "agotado"
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
          url: `${SITE_URL}/producto/${product.slug}`,
        },
      },
    })),
  };

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/#home`,
    url: SITE_URL,
    name: "Frutos secos y dulces por kilo en Santa Cruz",
    description:
      "Compra mix, almendras, confites y dulces por kilo en Santa Cruz con despacho local y pedido por WhatsApp.",
    mainEntity: {
      "@id": `${SITE_URL}/#catalogo`,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: topFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <PageShell />
    </>
  );
}
