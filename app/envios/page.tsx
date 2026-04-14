import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";
import { safeJsonLd } from "@/lib/json-ld";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Envíos y despacho",
  description:
    "Despachamos martes a sábado en Marchigüe, Peralillo, Santa Cruz y Cunaco. Envío gratis sobre $25.000.",
  alternates: { canonical: "/envios" },
  openGraph: {
    title: "Envíos y despacho · Estación Snack",
    description: "Envío gratis sobre $25.000. Martes a sábado 19:30-21:00.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.estacionsnack.cl" },
    { "@type": "ListItem", position: 2, name: "Envíos y despacho", item: "https://www.estacionsnack.cl/envios" },
  ],
};

const zonas = [
  { nombre: "Marchigüe", desc: "Envío $3.000. Gratis sobre $25.000." },
  { nombre: "Peralillo", desc: "Envío $3.000. Gratis sobre $25.000." },
  { nombre: "Santa Cruz", desc: "Envío $2.000. Gratis sobre $25.000." },
  { nombre: "Cunaco", desc: "Envío $3.000. Gratis sobre $25.000." },
];

export default function EnviosPage() {
  return (
    <StaticLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <main style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
        <div className="wrap">
          <nav
            aria-label="Ruta de navegación"
            style={{ fontSize: "0.8125rem", color: "#5E6B3E", marginBottom: "2rem", display: "flex", gap: "0.375rem", fontFamily: "var(--font-body)" }}
          >
            <Link href="/" style={{ color: "#5E6B3E" }}>Inicio</Link>
            <span>›</span>
            <span style={{ color: "#5A1F1A", fontWeight: 600 }}>Envíos</span>
          </nav>

          <div style={{ maxWidth: 640, marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#D0551F", marginBottom: "0.75rem" }}>
              Despacho
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
              Entrega en el valle
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "#5E6B3E", lineHeight: 1.7 }}>
              Despachamos de <strong style={{ color: "#5A1F1A" }}>martes a sábado, de 19:30 a 21:00 hrs</strong>. Coordinamos
              por WhatsApp una vez confirmado el pedido.
            </p>
          </div>

          {/* Zona de cobertura */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(1.375rem, 4vw, 1.75rem)",
              color: "#5A1F1A",
              marginBottom: "1.25rem",
            }}
          >
            Zona de cobertura
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "3rem", maxWidth: 560 }}>
            {zonas.map((z) => (
              <div
                key={z.nombre}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  background: "rgba(122,132,87,0.08)",
                  borderRadius: "12px",
                  border: "1px solid rgba(122,132,87,0.15)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#5E6B3E",
                    flexShrink: 0,
                    marginTop: 5,
                  }}
                />
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9375rem", color: "#5A1F1A", marginBottom: "0.25rem" }}>
                    {z.nombre}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#5E6B3E", lineHeight: 1.55 }}>
                    {z.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Fuera de cobertura */}
          <div
            style={{
              padding: "1.25rem",
              background: "rgba(90,31,26,0.04)",
              borderRadius: "12px",
              borderLeft: "3px solid rgba(90,31,26,0.20)",
              marginBottom: "3rem",
              maxWidth: 560,
            }}
          >
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9375rem", color: "#5A1F1A", marginBottom: "0.375rem" }}>
              ¿Vivís fuera de estas comunas?
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#5E6B3E", lineHeight: 1.65 }}>
              Escríbenos por{" "}
              <a
                href="https://wa.me/56953743338"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#D0551F", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                WhatsApp
              </a>{" "}
              y lo evaluamos juntos.
            </p>
          </div>

          {/* Plazos y derecho a retracto — Ley 19.496 */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(1.375rem, 4vw, 1.75rem)",
              color: "#5A1F1A",
              marginBottom: "1.25rem",
            }}
          >
            Plazos y garantías
          </h2>
          <div style={{ display: "grid", gap: "0.875rem", marginBottom: "3rem", maxWidth: 620 }}>
            <div
              style={{
                padding: "1.25rem",
                background: "#fff",
                borderRadius: "14px",
                border: "1.5px solid rgba(90,31,26,0.08)",
                boxShadow: "0 2px 12px rgba(90,31,26,0.06)",
              }}
            >
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9375rem", color: "#5A1F1A", marginBottom: "0.5rem" }}>
                Plazo de entrega
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#5E6B3E", lineHeight: 1.65 }}>
                Despachamos el martes a sábado siguiente a la confirmación del pedido. Coordinamos la franja horaria por WhatsApp el día del despacho.
              </p>
            </div>
            <div
              style={{
                padding: "1.25rem",
                background: "#fff",
                borderRadius: "14px",
                border: "1.5px solid rgba(90,31,26,0.08)",
                boxShadow: "0 2px 12px rgba(90,31,26,0.06)",
              }}
            >
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9375rem", color: "#5A1F1A", marginBottom: "0.5rem" }}>
                Derecho a retracto
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#5E6B3E", lineHeight: 1.65 }}>
                Según la Ley 19.496, tienes 10 días hábiles desde la recepción para retractarte. Escríbenos por WhatsApp con el producto sin abrir y coordinamos la devolución y restitución del pago.
              </p>
            </div>
            <div
              style={{
                padding: "1.25rem",
                background: "#fff",
                borderRadius: "14px",
                border: "1.5px solid rgba(90,31,26,0.08)",
                boxShadow: "0 2px 12px rgba(90,31,26,0.06)",
              }}
            >
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9375rem", color: "#5A1F1A", marginBottom: "0.5rem" }}>
                Producto en mal estado
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#5E6B3E", lineHeight: 1.65 }}>
                Si algo llega con problema, escríbenos dentro de las 24 horas con foto y lo reemplazamos o devolvemos el pago en la próxima ruta.
              </p>
            </div>
          </div>

          {/* Medios de pago */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(1.375rem, 4vw, 1.75rem)",
              color: "#5A1F1A",
              marginBottom: "1.25rem",
            }}
          >
            Medios de pago
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.875rem", marginBottom: "3rem", maxWidth: 620 }}>
            <div
              style={{
                padding: "1.25rem",
                background: "#fff",
                borderRadius: "14px",
                border: "1.5px solid rgba(90,31,26,0.08)",
                boxShadow: "0 2px 12px rgba(90,31,26,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9375rem", color: "#5A1F1A" }}>
                  Transferencia bancaria
                </p>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    background: "rgba(122,132,87,0.15)",
                    color: "#5E6B3E",
                    borderRadius: "9999px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                  }}
                >
                  Recomendado
                </span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#5E6B3E", lineHeight: 1.65 }}>
                Te pasamos los datos por WhatsApp. Al confirmar la transferencia preparamos el pedido.
              </p>
            </div>
            <div
              style={{
                padding: "1.25rem",
                background: "#fff",
                borderRadius: "14px",
                border: "1.5px solid rgba(90,31,26,0.08)",
                boxShadow: "0 2px 12px rgba(90,31,26,0.06)",
              }}
            >
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9375rem", color: "#5A1F1A", marginBottom: "0.625rem" }}>
                Efectivo contra entrega
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#5E6B3E", lineHeight: 1.65 }}>
                Pagas al recibir el pedido. Sin comisión.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.9375rem",
                padding: "0.875rem 1.75rem",
                borderRadius: "10px",
                background: "#D0551F",
                color: "#F4EADB",
                textDecoration: "none",
              }}
            >
              Ver las mezclas
            </Link>
            <Link
              href="/faq"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.9375rem",
                padding: "0.875rem 1.75rem",
                borderRadius: "10px",
                border: "2px solid rgba(90,31,26,0.20)",
                color: "#5A1F1A",
                textDecoration: "none",
              }}
            >
              Ver preguntas frecuentes
            </Link>
          </div>
        </div>
      </main>
    </StaticLayout>
  );
}
