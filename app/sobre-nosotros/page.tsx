import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";
import { safeJsonLd } from "@/lib/json-ld";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Nuestra historia",
  description:
    "Estación Snack nació en Santa Cruz, en el corazón del Valle de Colchagua. Frutos secos frescos por kilo, vendidos por kilo.",
  alternates: { canonical: "/sobre-nosotros" },
  openGraph: {
    title: "Nuestra historia · Estación Snack",
    description: "Frutos secos frescos por kilo desde el corazón del Valle de Colchagua.",
  },
};

const values = [
  { title: "Frescura real", body: "Compramos en lotes chicos y rotamos stock constantemente. Nada de bodegas llenas de producto viejo." },
  { title: "Directo, por kilo", body: "Vendemos por kilo. Sin vueltas." },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
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
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#A8411A", marginBottom: "0.75rem", fontVariantNumeric: "tabular-nums" }}>
              Km 35,5 · Bitácora
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
              Del andén a tu mesa.
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1.0625rem", lineHeight: 1.75, color: "#5E6B3E" }}>
              Estación Snack nació en Santa Cruz, en el km 35,5 del antiguo Ramal San Fernando–Pichilemu. La estación dejó de correr trenes hace años; nosotros retomamos la idea del despacho: frutos secos y dulces del valle, por kilo, directo a tu casa. Sin márgenes de tienda gourmet, sin cartón de más, sin apps.
            </p>
          </div>

          {/* Bitácora histórica — hechos verificados del ramal */}
          <div style={{
            background: "#fff",
            border: "1.5px solid rgba(90,31,26,0.1)",
            borderRadius: 16,
            padding: "2rem 1.75rem",
            marginBottom: "4rem",
            maxWidth: 680,
          }}>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#A8411A",
              marginBottom: "1rem",
              fontVariantNumeric: "tabular-nums",
            }}>
              Bitácora del Ramal
            </p>
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.9375rem",
              lineHeight: 1.5,
              color: "#5A1F1A",
              fontVariantNumeric: "tabular-nums",
            }}>
              <li><strong style={{ display: "inline-block", width: 64, color: "#A8411A", fontWeight: 700 }}>1870</strong>Ley que autoriza la construcción del Ramal San Fernando–Pichilemu.</li>
              <li><strong style={{ display: "inline-block", width: 64, color: "#A8411A", fontWeight: 700 }}>1909</strong>La parada &ldquo;Las Trancas&rdquo; pasa a llamarse Estación Paniahue.</li>
              <li><strong style={{ display: "inline-block", width: 64, color: "#A8411A", fontWeight: 700 }}>1926</strong>Inauguración del tramo completo hasta Pichilemu.</li>
              <li><strong style={{ display: "inline-block", width: 64, color: "#A8411A", fontWeight: 700 }}>1934</strong>Paniahue se rebautiza Estación Santa Cruz.</li>
              <li><strong style={{ display: "inline-block", width: 64, color: "#A8411A", fontWeight: 700 }}>1986</strong>Último tren de pasajeros. El ramal cierra al público.</li>
              <li><strong style={{ display: "inline-block", width: 64, color: "#A8411A", fontWeight: 700 }}>2004</strong>Vuelve parcialmente como Tren del Vino.</li>
              <li><strong style={{ display: "inline-block", width: 64, color: "#A8411A", fontWeight: 700 }}>2010</strong>Último servicio. El terremoto lo detiene para siempre.</li>
              <li><strong style={{ display: "inline-block", width: 64, color: "#A8411A", fontWeight: 700 }}>Hoy</strong>Estación Snack. El despacho sigue saliendo — a pie y por WhatsApp.</li>
            </ul>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.6875rem",
              color: "rgba(90,31,26,0.55)",
              marginTop: "1.25rem",
              lineHeight: 1.5,
            }}>
              Fuente: Museo Ramal San Fernando–Pichilemu, EFE Cultura, Memoria Chilena. Este negocio no opera en la estación histórica ni tiene vínculo con EFE — solo toma prestada la idea del km 35,5 como punto de partida.
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
                        background: "#A8411A",
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
              ¿Quieres saber más?
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5E6B3E", marginBottom: "1.75rem", lineHeight: 1.65 }}>
              Escríbenos por WhatsApp o a través del formulario. Respondemos en menos de 24 horas hábiles.
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
                  background: "#A8411A",
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
