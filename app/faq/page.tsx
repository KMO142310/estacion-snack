import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";
import FAQ from "@/components/FAQ";
import { safeJsonLd } from "@/lib/json-ld";
import { faqs } from "@/data/faq";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Dudas sobre cómo pedir, envíos, pagos y productos. Todo lo que necesitas saber para comprar en Estación Snack.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Preguntas frecuentes · Estación Snack",
    description: "Cómo pedir, envíos, pagos y más sobre Estación Snack.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.estacionsnack.cl" },
    { "@type": "ListItem", position: 2, name: "Preguntas frecuentes", item: "https://www.estacionsnack.cl/faq" },
  ],
};

export default function FaqPage() {
  return (
    <StaticLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <main style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
        <div className="wrap">
          <nav
            aria-label="Ruta de navegación"
            style={{ fontSize: "0.8125rem", color: "#5E6B3E", marginBottom: "2rem", display: "flex", gap: "0.375rem", fontFamily: "var(--font-body)" }}
          >
            <Link href="/" style={{ color: "#5E6B3E" }}>Inicio</Link>
            <span>›</span>
            <span style={{ color: "#5A1F1A", fontWeight: 600 }}>FAQ</span>
          </nav>

          <div style={{ maxWidth: 560, marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#A8411A", marginBottom: "0.75rem" }}>
              Ayuda
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                lineHeight: 1.1,
                fontWeight: 600,
                color: "#5A1F1A",
                marginBottom: "1rem",
              }}
            >
              Preguntas frecuentes
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "#5E6B3E", lineHeight: 1.65 }}>
              Si no encuentras tu respuesta acá, escríbenos por{" "}
              <a
                href="https://wa.me/56953743338"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#A8411A", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                WhatsApp
              </a>.
            </p>
          </div>

          <FAQ />
        </div>
      </main>
    </StaticLayout>
  );
}
