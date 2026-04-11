import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Dudas sobre cómo pedir, envíos, pagos y productos. Todo lo que necesitás saber para comprar en Estación Snack.",
  openGraph: {
    title: "Preguntas frecuentes · Estación Snack",
    description: "Cómo pedir, envíos, pagos y más sobre Estación Snack.",
  },
};

export default function FaqPage() {
  return (
    <StaticLayout>
      <main style={{ paddingTop: 48, paddingBottom: 80 }}>
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
