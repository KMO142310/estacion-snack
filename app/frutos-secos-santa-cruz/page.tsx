import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";
import productsData from "@/data/products.json";
import { safeJsonLd } from "@/lib/json-ld";

const destacados = productsData.filter((product) =>
  ["mix-europeo", "almendra-entera"].includes(product.slug),
);

export const metadata: Metadata = {
  title: "Frutos secos por kilo en Santa Cruz, Chile",
  description:
    "Dónde pedir frutos secos por kilo en Santa Cruz. Mix europeo, almendra entera y despacho local en Palmilla, Peralillo y Marchigüe por WhatsApp.",
  alternates: { canonical: "/frutos-secos-santa-cruz" },
  openGraph: {
    title: "Frutos secos por kilo en Santa Cruz",
    description:
      "Compra frutos secos por kilo en Santa Cruz con precio visible, stock real y despacho local por WhatsApp.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.estacionsnack.cl" },
    { "@type": "ListItem", position: 2, name: "Frutos secos por kilo en Santa Cruz", item: "https://www.estacionsnack.cl/frutos-secos-santa-cruz" },
  ],
};

export default function FrutosSecosSantaCruzPage() {
  return (
    <StaticLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <main style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
        <div className="wrap" style={{ maxWidth: 920 }}>
          <nav
            aria-label="Ruta de navegación"
            style={{ fontSize: "0.8125rem", color: "#5E6B3E", marginBottom: "2rem", display: "flex", gap: "0.375rem", flexWrap: "wrap", fontFamily: "var(--font-body)" }}
          >
            <Link href="/" style={{ color: "#5E6B3E" }}>Inicio</Link>
            <span>›</span>
            <span style={{ color: "#5A1F1A", fontWeight: 600 }}>Frutos secos por kilo en Santa Cruz</span>
          </nav>

          <div style={{ maxWidth: 760, marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#A8411A", marginBottom: "0.75rem" }}>
              Guía local
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.08, fontWeight: 600, color: "#5A1F1A", marginBottom: "1rem" }}>
              Frutos secos por kilo en Santa Cruz, Chile
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "#5E6B3E", lineHeight: 1.75, marginBottom: "1rem" }}>
              Si estás buscando frutos secos por kilo en Santa Cruz, la diferencia no está solo en el precio. También importa que veas el stock real, el formato de la bolsa y la comuna donde efectivamente despachan.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "#5E6B3E", lineHeight: 1.75 }}>
              En Estación Snack trabajamos con catálogo simple y cierre por WhatsApp: ves la bolsa, revisas el total y coordinamos entrega en Santa Cruz, Palmilla, Peralillo o Marchigüe.
            </p>
          </div>

          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "#5A1F1A", marginBottom: "1rem" }}>
              Qué revisar antes de pedir
            </h2>
            <div style={{ display: "grid", gap: "0.9rem" }}>
              {[
                "Formato claro: en nuestro caso, la mayoría de los frutos secos van en bolsa de 1 kg.",
                "Precio visible: no hay que escribir para recién saber cuánto cuesta cada producto.",
                "Cobertura real: despachamos en comunas concretas del valle, no a todo Chile.",
                "Cierre directo: el pedido queda en WhatsApp para confirmar hora, comuna y forma de pago.",
              ].map((item) => (
                <div key={item} style={{ padding: "1rem 1.1rem", borderRadius: "14px", background: "rgba(241,236,226,0.75)", border: "1px solid rgba(90,31,26,0.08)", fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5E6B3E", lineHeight: 1.65 }}>
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "#5A1F1A", marginBottom: "1rem" }}>
              Frutos secos que hoy están en el catálogo
            </h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              {destacados.map((product) => (
                <Link
                  key={product.slug}
                  href={`/producto/${product.slug}`}
                  style={{
                    display: "block",
                    padding: "1.2rem 1.25rem",
                    borderRadius: "18px",
                    background: "#fff",
                    border: "1px solid rgba(90,31,26,0.08)",
                    boxShadow: "0 10px 24px -20px rgba(90,31,26,0.25)",
                    textDecoration: "none",
                  }}
                >
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 600, color: "#5A1F1A", marginBottom: "0.35rem" }}>
                    {product.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5E6B3E", lineHeight: 1.65, marginBottom: "0.45rem" }}>
                    {product.copy}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9rem", color: "#A8411A", margin: 0 }}>
                    ${product.price.toLocaleString("es-CL")} · {product.format_short}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "#5A1F1A", marginBottom: "1rem" }}>
              Comunas donde sí coordinamos despacho
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.975rem", color: "#5E6B3E", lineHeight: 1.75, marginBottom: "1rem" }}>
              La mayor parte de los pedidos salen a Santa Cruz. También coordinamos entregas en Palmilla, Peralillo y Marchigüe. Si necesitas revisar costo o franja horaria, puedes mirar la página de <Link href="/envios" style={{ color: "#A8411A", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "3px" }}>envíos y despacho</Link>.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.975rem", color: "#5E6B3E", lineHeight: 1.75 }}>
              El pedido no pasa por un checkout largo: se abre WhatsApp con el resumen y ahí confirmamos comuna, horario, dirección y pago.
            </p>
          </section>

          <section style={{ padding: "1.5rem", borderRadius: "22px", background: "rgba(255,249,241,0.95)", border: "1px solid rgba(90,31,26,0.08)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.35rem, 4vw, 1.9rem)", color: "#5A1F1A", marginBottom: "0.9rem" }}>
              Enlaces útiles para seguir mirando
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
              <Link href="/#productos" style={linkPillStyle}>Ver catálogo completo</Link>
              <Link href="/envios" style={linkPillStyle}>Ver despacho por comuna</Link>
              <Link href="/dulces-por-kilo-santa-cruz" style={linkPillStyle}>Ver dulces por kilo</Link>
              <Link href="/faq" style={linkPillStyle}>Preguntas frecuentes</Link>
            </div>
          </section>
        </div>
      </main>
    </StaticLayout>
  );
}

const linkPillStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "42px",
  padding: "0 1rem",
  borderRadius: "999px",
  border: "1px solid rgba(90,31,26,0.14)",
  color: "#5A1F1A",
  textDecoration: "none",
  fontFamily: "var(--font-body)",
  fontSize: "0.875rem",
  fontWeight: 700,
} as const;
