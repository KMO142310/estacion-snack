import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";
import BankCard from "./BankCard";

export const revalidate = 3600; // 1h — contenido estático
export const metadata: Metadata = {
  title: "Envíos y despacho",
  description:
    "Despachamos en Santa Cruz. Entrega coordinada por WhatsApp, martes y viernes. Envío gratis.",
  openGraph: {
    title: "Envíos y despacho · Estación Snack",
    description:
      "Despacho en Santa Cruz, entrega coordinada y gratuita.",
  },
};

export default function EnviosPage() {
  return (
    <StaticLayout>
      <main style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div className="wrap">
          {/* Breadcrumb */}
          <nav aria-label="Ruta de navegación" style={{ fontSize: 12, color: "var(--sub)", marginBottom: 32, display: "flex", gap: 6 }}>
            <Link href="/">Inicio</Link>
            <span>›</span>
            <span style={{ color: "var(--text)", fontWeight: 600 }}>Envíos y despacho</span>
          </nav>

          <div style={{ maxWidth: 640, marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--orange)", marginBottom: 12 }}>
              Despacho
            </p>
            <h1 style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: 1.05,
              fontWeight: 400,
              marginBottom: 16,
            }}>
              Entrega en Santa Cruz
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--sub)" }}>
              Despachamos los <strong>martes y viernes</strong>. Coordinamos el día y horario exacto
              por WhatsApp una vez confirmado el pedido. Sin tarifas de envío: la entrega es siempre gratis.
            </p>
          </div>

          {/* Zona */}
          <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 20 }}>
            Zona de cobertura
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "12px 1fr auto",
              gap: 16,
              padding: 24,
              background: "var(--green-soft)",
              borderRadius: "var(--r)",
              alignItems: "start",
              marginBottom: 48,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--green)", marginTop: 4 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Santa Cruz</div>
              <div style={{ fontSize: 13, color: "var(--sub)", lineHeight: 1.5 }}>
                Coordinamos horario de entrega por WhatsApp tras confirmar el pedido.
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "var(--green)" }}>Gratis</div>
              <div style={{ fontSize: 11, color: "var(--sub)", marginTop: 2 }}>Siempre</div>
            </div>
          </div>

          {/* Fuera de cobertura */}
          <div style={{ padding: 20, background: "rgba(0,0,0,.03)", borderRadius: "var(--r)", marginBottom: 48, borderLeft: "3px solid rgba(0,0,0,.12)" }}>
            <strong style={{ fontSize: 14 }}>¿Vivís fuera de Santa Cruz?</strong>
            <p style={{ fontSize: 14, color: "var(--sub)", marginTop: 4, lineHeight: 1.6 }}>
              Por ahora solo despachamos dentro de Santa Cruz. Si querés algo, escríbenos por{" "}
              <a href={`https://wa.me/56953743338`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--orange)", fontWeight: 700 }}>
                WhatsApp
              </a>{" "}
              y lo evaluamos juntos.
            </p>
          </div>

          {/* Medios de pago */}
          <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 20 }}>
            Medios de pago
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 40 }}>
            <div style={{ padding: 24, background: "#fff", borderRadius: "var(--r)", border: "1.5px solid rgba(0,0,0,.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>Transferencia bancaria</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", background: "var(--green-soft)", color: "var(--green)", borderRadius: "var(--r-full)", textTransform: "uppercase", letterSpacing: ".04em" }}>
                  Recomendado
                </span>
              </div>
              <p style={{ fontSize: 14, color: "var(--sub)", lineHeight: 1.6 }}>
                Te pasamos los datos por WhatsApp. Al confirmar la transferencia preparamos el pedido.
              </p>
            </div>
            <div style={{ padding: 24, background: "#fff", borderRadius: "var(--r)", border: "1.5px solid rgba(0,0,0,.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>Efectivo contra entrega</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--sub)", lineHeight: 1.6 }}>
                Pagás al recibir el pedido.
              </p>
            </div>
          </div>

          {/* Datos bancarios — client component para botón copiar */}
          <BankCard />

          {/* CTA */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 48 }}>
            <Link
              href="/"
              style={{ padding: "14px 28px", fontSize: 15, fontWeight: 700, borderRadius: 12, background: "var(--text)", color: "#fff", textDecoration: "none" }}
            >
              Ver productos
            </Link>
            <Link
              href="/contacto"
              style={{ padding: "14px 28px", fontSize: 15, fontWeight: 700, borderRadius: 12, border: "2px solid var(--text)", color: "var(--text)", textDecoration: "none" }}
            >
              Consultar
            </Link>
          </div>
        </div>
      </main>
    </StaticLayout>
  );
}
