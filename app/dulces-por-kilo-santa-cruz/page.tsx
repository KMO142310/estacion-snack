import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";
import productsData from "@/data/products.json";
import { safeJsonLd } from "@/lib/json-ld";

const destacados = productsData.filter((product) =>
  ["mani-confitado-tropical", "mani-confitado-rojo", "chuby-bardu", "gomita-osito-docile"].includes(product.slug),
);

export const metadata: Metadata = {
  title: "Dulces por kilo en Santa Cruz, Chile",
  description:
    "Dónde pedir dulces por kilo en Santa Cruz. Maní confitado, gomitas y chocolates por kilo con despacho local y cierre por WhatsApp.",
  alternates: { canonical: "/dulces-por-kilo-santa-cruz" },
  openGraph: {
    title: "Dulces por kilo en Santa Cruz",
    description:
      "Maní confitado, gomitas y chocolates por kilo en Santa Cruz con pedido por WhatsApp y despacho local.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.estacionsnack.cl" },
    { "@type": "ListItem", position: 2, name: "Dulces por kilo en Santa Cruz", item: "https://www.estacionsnack.cl/dulces-por-kilo-santa-cruz" },
  ],
};

export default function DulcesPorKiloSantaCruzPage() {
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
            <span style={{ color: "#5A1F1A", fontWeight: 600 }}>Dulces por kilo en Santa Cruz</span>
          </nav>

          <div style={{ maxWidth: 760, marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#A8411A", marginBottom: "0.75rem" }}>
              Guía local
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.08, fontWeight: 600, color: "#5A1F1A", marginBottom: "1rem" }}>
              Dulces por kilo en Santa Cruz, Chile
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "#5E6B3E", lineHeight: 1.75, marginBottom: "1rem" }}>
              Si estás buscando dulces por kilo en Santa Cruz para la casa, la oficina, un cumpleaños o una mesa dulce, lo más útil es ver productos concretos y no una categoría vacía con texto inflado.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "#5E6B3E", lineHeight: 1.75 }}>
              En Estación Snack mantenemos un catálogo corto: maní confitado, gomitas y chocolates por kilo, con precio visible y cierre simple por WhatsApp.
            </p>
          </div>

          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "#5A1F1A", marginBottom: "1rem" }}>
              Qué dulces se pueden pedir hoy
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
              Cuándo conviene pedir por kilo
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.975rem", color: "#5E6B3E", lineHeight: 1.75, marginBottom: "1rem" }}>
              Pedir dulces por kilo suele tener sentido cuando compras para varios días, para una mesa compartida o para evitar las bolsas chicas del retail. En Santa Cruz eso también importa porque no siempre hay variedad estable de gomitas, chocolates o confitados en un solo lugar.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.975rem", color: "#5E6B3E", lineHeight: 1.75 }}>
              Acá puedes combinar dulces sueltos y packs, revisar el total y coordinar despacho local o retiro sin pasar por un checkout largo.
            </p>
          </section>

          <section style={{ padding: "1.5rem", borderRadius: "22px", background: "rgba(255,249,241,0.95)", border: "1px solid rgba(90,31,26,0.08)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.35rem, 4vw, 1.9rem)", color: "#5A1F1A", marginBottom: "0.9rem" }}>
              Enlaces útiles para seguir comparando
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
              <Link href="/#productos" style={linkPillStyle}>Ver catálogo completo</Link>
              <Link href="/frutos-secos-santa-cruz" style={linkPillStyle}>Ver frutos secos por kilo</Link>
              <Link href="/envios" style={linkPillStyle}>Ver comunas y despacho</Link>
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
