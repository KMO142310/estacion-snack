import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";
import FAQ from "@/components/FAQ";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Dudas sobre cómo pedir, envíos, pagos y productos. Todo lo que necesitas saber para comprar en Estación Snack.",
  openGraph: {
    title: "Preguntas frecuentes · Estación Snack",
    description: "Cómo pedir, envíos, pagos y más sobre Estación Snack.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "¿Cómo hago mi pedido?", acceptedAnswer: { "@type": "Answer", text: 'Elige los productos, selecciona la cantidad y toca "Agregar al pedido". Cuando estés listo, toca "Confirmar por WhatsApp".' } },
    { "@type": "Question", name: "¿A qué comunas despachan?", acceptedAnswer: { "@type": "Answer", text: "Despachamos en Santa Cruz, Peralillo, Palmilla y Nancagua." } },
    { "@type": "Question", name: "¿Cuánto cuesta el envío?", acceptedAnswer: { "@type": "Answer", text: "Primer envío gratis. Después, gratis en compras sobre $25.000. Bajo ese monto: $2.000 (Santa Cruz) o $2.500 (comunas cercanas)." } },
    { "@type": "Question", name: "¿Cuándo despachan?", acceptedAnswer: { "@type": "Answer", text: "De martes a sábado, entre 19:30 y 21:00 hrs. Coordinamos por WhatsApp." } },
    { "@type": "Question", name: "¿Qué medios de pago aceptan?", acceptedAnswer: { "@type": "Answer", text: "Transferencia bancaria o efectivo contra entrega." } },
    { "@type": "Question", name: "¿Cuál es el mínimo de compra?", acceptedAnswer: { "@type": "Answer", text: "El mínimo por producto es 1 kg. Puedes combinar varios productos." } },
    { "@type": "Question", name: "¿Puedo agregar más productos después de enviar el pedido?", acceptedAnswer: { "@type": "Answer", text: "Sí, siempre que no hayamos salido a despachar." } },
    { "@type": "Question", name: "¿Cuánto duran los productos?", acceptedAnswer: { "@type": "Answer", text: "Los frutos secos duran 2–3 meses en frasco hermético. Los dulces hasta 6 meses." } },
    { "@type": "Question", name: "¿Tengo derecho a retracto?", acceptedAnswer: { "@type": "Answer", text: "Sí. Por Ley 19.496 tienes 10 días hábiles desde la recepción para retractarte y solicitar la devolución del producto sin abrir." } },
  ],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
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
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#D0551F", marginBottom: "0.75rem" }}>
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
                style={{ color: "#D0551F", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}
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
