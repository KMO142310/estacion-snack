import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "La vía más rápida para contactarnos es WhatsApp. Respondemos en menos de 24 horas hábiles.",
  openGraph: {
    title: "Contacto · Estación Snack",
    description: "Contacta con Estación Snack por WhatsApp. Respondemos rápido.",
  },
};

const WA_LINK = "https://wa.me/56953743338?text=Hola!%20Tengo%20una%20consulta";
const WA_PEDIDO = "https://wa.me/56953743338?text=Hola!%20Quiero%20hacer%20un%20pedido";

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.estacionsnack.cl" },
    { "@type": "ListItem", position: 2, name: "Contacto", item: "https://www.estacionsnack.cl/contacto" },
  ],
};

const opciones = [
  {
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    titulo: "Consultas por WhatsApp",
    desc: "Respondemos en menos de 24 horas hábiles. Para temas urgentes, es la vía más rápida.",
    href: WA_LINK,
    cta: "Abrir WhatsApp",
    primary: true,
  },
  {
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
    titulo: "Hacer un pedido",
    desc: "Si sabés lo que quieres, puedes armar tu pedido directo desde el catálogo y mandarlo por WhatsApp.",
    href: "/",
    cta: "Ir al catálogo",
    primary: false,
  },
];

export default function ContactoPage() {
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
            <span style={{ color: "#5A1F1A", fontWeight: 600 }}>Contacto</span>
          </nav>

          <div style={{ maxWidth: 560, marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#D0551F", marginBottom: "0.75rem" }}>
              Contacto
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
              Hablamos
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "#5E6B3E", lineHeight: 1.7 }}>
              Respondemos rápido. Lo más fácil es escribirnos por WhatsApp —
              lo atiende una persona, no un bot.
            </p>
          </div>

          {/* Opciones de contacto */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", maxWidth: 560, marginBottom: "3rem" }}>
            {opciones.map((op) => (
              <a
                key={op.titulo}
                href={op.href}
                target={op.href.startsWith("http") ? "_blank" : undefined}
                rel={op.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1.25rem",
                  padding: "1.5rem",
                  background: op.primary ? "#D0551F" : "#fff",
                  borderRadius: "16px",
                  border: op.primary ? "none" : "1.5px solid rgba(90,31,26,0.10)",
                  boxShadow: op.primary ? "0 4px 24px rgba(208,85,31,0.25)" : "0 2px 12px rgba(90,31,26,0.06)",
                  textDecoration: "none",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
              >
                <span style={{ color: op.primary ? "#F4EADB" : "#D0551F", flexShrink: 0, marginTop: 2 }}>
                  {op.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: op.primary ? "#F4EADB" : "#5A1F1A",
                      marginBottom: "0.375rem",
                    }}
                  >
                    {op.titulo}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      color: op.primary ? "rgba(244,234,219,0.80)" : "#5E6B3E",
                      lineHeight: 1.6,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {op.desc}
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: op.primary ? "#F4EADB" : "#D0551F",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    {op.cta} →
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Datos directos */}
          <div
            style={{
              padding: "1.5rem",
              background: "rgba(90,31,26,0.04)",
              borderRadius: "14px",
              maxWidth: 560,
            }}
          >
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9375rem", color: "#5A1F1A", marginBottom: "0.875rem" }}>
              Datos de contacto
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#5E6B3E", minWidth: 80 }}>WhatsApp</span>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 600, color: "#5A1F1A", textDecoration: "none" }}>
                  +56 9 5374 3338
                </a>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#5E6B3E", minWidth: 80 }}>Instagram</span>
                <a href="https://instagram.com/estacionsnack.sc" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 600, color: "#5A1F1A", textDecoration: "none" }}>
                  @estacionsnack.sc
                </a>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#5E6B3E", minWidth: 80 }}>Despacho</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5A1F1A" }}>
                  Martes a sábado · Santa Cruz y alrededores
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </StaticLayout>
  );
}
