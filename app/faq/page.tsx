import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";
import FAQ from "@/components/FAQ";

export const revalidate = 3600; // 1h — contenido estático
export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Dudas sobre cómo pedir, envíos, pagos y productos. Todo lo que necesitás saber para comprar en Estación Snack.",
  openGraph: {
    title: "Preguntas frecuentes · Estación Snack",
    description: "Cómo pedir, envíos, pagos y más sobre Estación Snack.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "¿Cómo hago mi pedido?", acceptedAnswer: { "@type": "Answer", text: 'Agrega los productos al carrito, ingresa tu nombre, celular y dirección, y tocá "Pedir por WhatsApp". Se abre un mensaje con todo tu pedido listo para enviar. Confirmamos por WhatsApp y coordinamos la entrega.' } },
    { "@type": "Question", name: "¿A qué comunas despachan?", acceptedAnswer: { "@type": "Answer", text: "Por ahora despachamos dentro de Santa Cruz. Si vivís en otra zona, escríbenos por WhatsApp y lo evaluamos juntos." } },
    { "@type": "Question", name: "¿Cuánto cuesta el envío?", acceptedAnswer: { "@type": "Answer", text: "El envío es gratis. Sin mínimo de compra y sin costo de despacho." } },
    { "@type": "Question", name: "¿Cuándo despachan?", acceptedAnswer: { "@type": "Answer", text: "Los martes y viernes. Coordinamos el horario exacto de entrega por WhatsApp después de confirmar el pedido." } },
    { "@type": "Question", name: "¿Qué medios de pago aceptan?", acceptedAnswer: { "@type": "Answer", text: "Transferencia bancaria o efectivo contra entrega. No cobramos online. Al confirmar el pedido te pasamos los datos bancarios por WhatsApp." } },
    { "@type": "Question", name: "¿Cuál es el mínimo de compra?", acceptedAnswer: { "@type": "Answer", text: "No hay mínimo. Podés pedir desde 0.5 kg de un solo producto." } },
    { "@type": "Question", name: "¿Puedo agregar más productos después de enviar el pedido?", acceptedAnswer: { "@type": "Answer", text: "Sí, siempre que no hayamos salido a despachar. Escríbenos por WhatsApp y lo sumamos al pedido." } },
    { "@type": "Question", name: "¿Cuánto duran los productos?", acceptedAnswer: { "@type": "Answer", text: "Los frutos secos duran 2–3 meses en frasco hermético en lugar fresco y seco. Los dulces y confites duran hasta 6 meses en las mismas condiciones." } },
  ],
};

export default function FaqPage() {
  return (
    <StaticLayout>
      <main style={{ paddingTop: 48, paddingBottom: 80 }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <div className="wrap">
          <nav aria-label="Ruta de navegación" style={{ fontSize: 12, color: "var(--sub)", marginBottom: 32, display: "flex", gap: 6 }}>
            <Link href="/">Inicio</Link>
            <span>›</span>
            <span style={{ color: "var(--text)", fontWeight: 600 }}>Preguntas frecuentes</span>
          </nav>

          <div style={{ maxWidth: 560, marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--orange)", marginBottom: 12 }}>
              Ayuda
            </p>
            <h1 style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: 1.05,
              fontWeight: 400,
              marginBottom: 16,
            }}>
              Preguntas frecuentes
            </h1>
            <p style={{ fontSize: 16, color: "var(--sub)" }}>
              Si no encontrás tu respuesta acá, escríbenos por{" "}
              <a href="https://wa.me/56953743338" target="_blank" rel="noopener noreferrer" style={{ color: "var(--orange)", fontWeight: 700 }}>
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
