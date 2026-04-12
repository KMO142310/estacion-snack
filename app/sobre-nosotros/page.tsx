import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Nuestra historia",
  description:
    "Estación Snack nació en Santa Cruz, en el corazón del Valle de Colchagua. Frutos secos frescos por kilo, pesados al momento.",
  openGraph: {
    title: "Nuestra historia · Estación Snack",
    description: "Frutos secos frescos por kilo desde el corazón del Valle de Colchagua.",
  },
};

const values = [
  { title: "Frescura real", body: "Compramos en lotes chicos y rotamos stock constantemente. Nada de bodegas llenas de producto viejo." },
  { title: "Sin envases innecesarios", body: "Vendemos a granel, en bolsa kraft. Menos plástico, mismo sabor." },
  { title: "Precio justo", body: "Margen honesto. Sin tiendas gourmet de por medio. El precio que ves es lo que cuesta." },
  { title: "Local de verdad", body: "Somos de Santa Cruz. Despachamos en las comunas que conocemos. No prometemos lo que no podemos cumplir." },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.estacionsnack.cl" },
    { "@type": "ListItem", position: 2, name: "Nuestra historia", item: "https://www.estacionsnack.cl/sobre-nosotros" },
  ],
};

export default function SobreNosotrosPage() {
  return (
    <StaticLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <main style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
        <div className="wrap">
          <nav
            aria-label="Ruta de navegación"
            style={{ fontSize: "0.8125rem", color: "#5E6B3E", marginBottom: "2rem", display: "flex", gap: "0.375rem", fontFamily: "var(--font-body)" }}
          >
            <Link href="/" style={{ color: "#5E6B3E" }}>Inicio</Link>
            <span>›</span>
            <span style={{ color: "#5A1F1A", fontWeight: 600 }}>Nuestra historia</span>
          </nav>

          {/* Hero */}
          <div style={{ maxWidth: 680, marginBottom: "4rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#D0551F", marginBottom: "0.75rem" }}>
              Quiénes somos
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                lineHeight: 1.08,
                fontWeight: 600,
                color: "#5A1F1A",
                marginBottom: "1.25rem",
              }}
            >
              Del Valle de Colchagua a tu mesa
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1.0625rem", lineHeight: 1.75, color: "#5E6B3E" }}>
              Estación Snack nació en Santa Cruz con una idea simple: traer frutos secos
              frescos, de calidad, sin los márgenes inflados de las tiendas gourmet.
              Vendemos por kilo porque así tiene más sentido — pagás lo que necesitás,
              sin el cartón, sin el plástico, sin el markup del packaging.
            </p>
          </div>

          {/* Historia + valores */}
          <div
            style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "3rem", marginBottom: "4rem" }}
            className="about-grid"
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "clamp(1.375rem, 4vw, 2rem)",
                  color: "#5A1F1A",
                  marginBottom: "1.25rem",
                }}
              >
                El valle que nos inspira
              </h2>
              {[
                "Vivimos en uno de los valles más reconocidos de Chile. La tierra aquí tiene historia, los productores cuidan lo que hacen, y los vecinos valoran lo artesanal. Eso lo sentimos todos los días.",
                "No somos una cadena ni un marketplace. Somos una persona eligiendo qué entra al catálogo, probando cada lote, decidiendo qué merece tu tiempo y tu plata.",
                "Despachamos los martes a sábado en Santa Cruz y comunas cercanas de O'Higgins. Lo coordinamos por WhatsApp porque así funciona acá — con nombre y apellido, sin apps raras.",
              ].map((p, i) => (
                <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", lineHeight: 1.8, color: "#5E6B3E", marginBottom: "1rem" }}>{p}</p>
              ))}
            </div>

            <div
              style={{
                background: "rgba(208,85,31,0.06)",
                borderRadius: "20px",
                padding: "2rem",
                border: "1px solid rgba(208,85,31,0.12)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "1.5rem",
                  color: "#5A1F1A",
                  marginBottom: "1.5rem",
                }}
              >
                Lo que nos mueve
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {values.map((v) => (
                  <div key={v.title} style={{ display: "flex", gap: "1rem" }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#D0551F",
                        flexShrink: 0,
                        marginTop: 7,
                      }}
                    />
                    <div>
                      <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9375rem", color: "#5A1F1A", marginBottom: "0.25rem" }}>{v.title}</p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", lineHeight: 1.65, color: "#5E6B3E" }}>{v.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1.5rem",
              background: "rgba(122,132,87,0.08)",
              borderRadius: "20px",
              border: "1px solid rgba(122,132,87,0.15)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "clamp(1.375rem, 4vw, 2rem)",
                color: "#5A1F1A",
                marginBottom: "0.75rem",
              }}
            >
              ¿Querés saber más?
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5E6B3E", marginBottom: "1.75rem", lineHeight: 1.65 }}>
              Escribinos por WhatsApp o a través del formulario. Respondemos en menos de 24 horas hábiles.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://wa.me/56953743338"
                target="_blank"
                rel="noopener noreferrer"
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
                Escribir por WhatsApp
              </a>
              <Link
                href="/"
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
                Ver las mezclas
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 768px) {
            .about-grid { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>
      </main>
    </StaticLayout>
  );
}
