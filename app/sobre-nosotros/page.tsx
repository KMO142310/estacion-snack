import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";

export const revalidate = 3600; // 1h — contenido estático
export const metadata: Metadata = {
  title: "Nuestra historia",
  description:
    "Estación Snack nació en Santa Cruz, en el corazón del Valle de Colchagua. Conoce la historia detrás de tus frutos secos favoritos.",
  openGraph: {
    title: "Nuestra historia · Estación Snack",
    description:
      "Frutos secos frescos por kilo desde el corazón del Valle de Colchagua.",
  },
};

const values = [
  {
    title: "Frescura real",
    body: "Compramos en lotes chicos y rotamos stock constantemente. Nada de bodegas llenas de producto viejo.",
  },
  {
    title: "Sin envases innecesarios",
    body: "Vendemos a granel. El cliente trae su recipiente o le entregamos en bolsa kraft. Menos plástico, mismo sabor.",
  },
  {
    title: "Precio justo",
    body: "Margen honesto. Sin tiendas gourmet de por medio. El precio que ves es lo que cuesta, sin sorpresas.",
  },
  {
    title: "Local de verdad",
    body: "Somos de Santa Cruz. Despachamos en las comunas que conocemos. No prometemos lo que no podemos cumplir.",
  },
];

export default function SobreNosotrosPage() {
  return (
    <StaticLayout>
      <main style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div className="wrap">
          {/* Breadcrumb */}
          <nav aria-label="Ruta de navegación" style={{ fontSize: 12, color: "var(--sub)", marginBottom: 32, display: "flex", gap: 6 }}>
            <Link href="/">Inicio</Link>
            <span>›</span>
            <span style={{ color: "var(--text)", fontWeight: 600 }}>Nuestra historia</span>
          </nav>

          {/* Hero */}
          <div style={{ maxWidth: 680, marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--orange)", marginBottom: 12 }}>
              Quiénes somos
            </p>
            <h1 style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: "clamp(36px, 6vw, 56px)",
              lineHeight: 1.05,
              fontWeight: 400,
              marginBottom: 24,
            }}>
              Del Valle de Colchagua a tu mesa
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: "var(--sub)" }}>
              Estación Snack nació en Santa Cruz con una idea simple: traer frutos secos
              frescos, de calidad, sin los márgenes inflados de las tiendas gourmet.
              Vendemos por kilo porque así tiene más sentido — pagás lo que necesitás,
              sin el cartón, sin el plástico, sin el markup del packaging.
            </p>
          </div>

          {/* Historia */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 48,
            marginBottom: 64,
          }} className="about-grid">
            <div>
              <h2 style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontSize: 32,
                fontWeight: 400,
                marginBottom: 20,
              }}>
                El Valle que nos inspira
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--sub)", marginBottom: 16 }}>
                Vivimos en uno de los valles más reconocidos de Chile.
                La tierra aquí tiene historia, los productores cuidan lo que hacen,
                y los vecinos valoran lo artesanal. Eso lo sentimos todos los días.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--sub)", marginBottom: 16 }}>
                No somos una cadena ni un marketplace. Somos una persona eligiendo
                qué entra al catálogo, probando cada lote, decidiendo qué merece
                tu tiempo y tu plata.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--sub)" }}>
                Despachamos los martes y viernes en Santa Cruz y comunas cercanas de O'Higgins.
                Lo coordinamos por WhatsApp porque así funciona acá — con nombre y apellido,
                sin apps raras.
              </p>
            </div>

            <div style={{ background: "var(--orange-soft)", borderRadius: "var(--r-lg)", padding: 32 }}>
              <h2 style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontSize: 28,
                fontWeight: 400,
                marginBottom: 24,
              }}>
                Lo que nos mueve
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {values.map((v) => (
                  <div key={v.title} style={{ display: "flex", gap: 16 }}>
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--orange)",
                      flexShrink: 0,
                      marginTop: 8,
                    }} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{v.title}</div>
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--sub)" }}>{v.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{
            textAlign: "center",
            padding: "48px 24px",
            background: "var(--green-soft)",
            borderRadius: "var(--r-lg)",
          }}>
            <h2 style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: 32,
              fontWeight: 400,
              marginBottom: 12,
            }}>
              ¿Querés saber más?
            </h2>
            <p style={{ fontSize: 16, color: "var(--sub)", marginBottom: 24 }}>
              Escribinos por WhatsApp o mandanos un mensaje. Respondemos en menos de 24 horas hábiles.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/contacto"
                style={{
                  padding: "14px 28px",
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: 12,
                  background: "var(--text)",
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                Contacto
              </Link>
              <Link
                href="/"
                style={{
                  padding: "14px 28px",
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: 12,
                  border: "2px solid var(--text)",
                  color: "var(--text)",
                  textDecoration: "none",
                }}
              >
                Ver productos
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
