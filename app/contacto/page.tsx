import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbenos por WhatsApp o completa el formulario. Respondemos en menos de 24 horas hábiles.",
  openGraph: {
    title: "Contacto · Estación Snack",
    description: "Contacta con Estación Snack. La vía más rápida es WhatsApp.",
  },
};

const WA_LINK = "https://wa.me/56953743338?text=Hola!%20Tengo%20una%20consulta";

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.estacionsnack.cl" },
    { "@type": "ListItem", position: 2, name: "Contacto", item: "https://www.estacionsnack.cl/contacto" },
  ],
};

export default function ContactoPage() {
  return (
    <StaticLayout>
      <main style={{ paddingTop: 48, paddingBottom: 80 }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <div className="wrap">
          {/* Breadcrumb */}
          <nav aria-label="Ruta de navegación" style={{ fontSize: 12, color: "var(--sub)", marginBottom: 32, display: "flex", gap: 6 }}>
            <Link href="/">Inicio</Link>
            <span>›</span>
            <span style={{ color: "var(--text)", fontWeight: 600 }}>Contacto</span>
          </nav>

          <div style={{ maxWidth: 640, marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--orange)", marginBottom: 12 }}>
              Contacto
            </p>
            <h1 style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: 1.05,
              fontWeight: 400,
              marginBottom: 16,
            }}>
              Hablamos
            </h1>
            <p style={{ fontSize: 16, color: "var(--sub)", lineHeight: 1.6 }}>
              Respondemos en menos de 24 horas hábiles. Para consultas urgentes o pedidos,
              la opción más rápida es WhatsApp.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 40,
          }} className="contact-grid">
            {/* Formulario */}
            <div>
              <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 24, fontWeight: 400, marginBottom: 20 }}>
                Formulario
              </h2>
              <ContactForm />
            </div>

            {/* Info lateral */}
            <div>
              <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 24, fontWeight: 400, marginBottom: 20 }}>
                O escríbenos directo
              </h2>

              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: 20,
                  background: "#dcfce7",
                  borderRadius: "var(--r)",
                  marginBottom: 16,
                  textDecoration: "none",
                  color: "var(--text)",
                  border: "1.5px solid rgba(0,0,0,.06)",
                }}
              >
                <div style={{ width: 44, height: 44, background: "#25D366", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>WhatsApp</div>
                  <div style={{ fontSize: 13, color: "var(--sub)" }}>+56 9 5374 3338 · respuesta en minutos</div>
                </div>
              </a>

              <div style={{ padding: 20, background: "rgba(0,0,0,.02)", borderRadius: "var(--r)", border: "1.5px solid rgba(0,0,0,.06)" }}>
                <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Información</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "var(--sub)" }}>
                  <div><strong style={{ color: "var(--text)" }}>Ubicación</strong><br />Santa Cruz, Región de O'Higgins</div>
                  <div><strong style={{ color: "var(--text)" }}>Horario de atención</strong><br />Martes y viernes · 10:00 – 19:00</div>
                  <div><strong style={{ color: "var(--text)" }}>Despacho</strong><br />Santa Cruz · martes y viernes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 768px) {
            .contact-grid { grid-template-columns: 1.2fr 0.8fr !important; }
          }
        `}</style>
      </main>
    </StaticLayout>
  );
}
