import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";

export const metadata: Metadata = {
  title: "Envíos y despacho",
  description:
    "Despachamos los martes y viernes en Santa Cruz y comunas cercanas de la Región de O'Higgins. Conoce las tarifas y zonas de cobertura.",
  openGraph: {
    title: "Envíos y despacho · Estación Snack",
    description:
      "Despacho martes y viernes en Santa Cruz y O'Higgins. Tarifas planas, sin sorpresas.",
  },
};

const ZONAS = [
  {
    zona: "Santa Cruz centro",
    comunas: ["Santa Cruz"],
    precio: "Gratis",
    tiempo: "Mismo día (martes o viernes)",
    nota: "Coordinamos horario por WhatsApp",
    color: "var(--green)",
    soft: "var(--green-soft)",
  },
  {
    zona: "Comunas vecinas",
    comunas: ["Palmilla", "Peralillo", "Nancagua", "Chépica", "Lolol"],
    precio: "$2.500",
    tiempo: "1–2 días hábiles",
    nota: "Despacho martes y viernes",
    color: "var(--orange)",
    soft: "var(--orange-soft)",
  },
  {
    zona: "Resto de O'Higgins",
    comunas: ["San Fernando", "Chimbarongo", "Placilla", "Pumanque", "Marchigüe", "Pichilemu", "Rancagua", "y más"],
    precio: "$3.500",
    tiempo: "2–3 días hábiles",
    nota: "Confirmar disponibilidad por WhatsApp",
    color: "var(--purple)",
    soft: "var(--purple-soft)",
  },
];

const PAGOS = [
  {
    titulo: "Transferencia bancaria",
    desc: "Te pasamos los datos por WhatsApp. Al confirmar la transferencia preparamos el pedido.",
    badge: "Recomendado",
  },
  {
    titulo: "Efectivo contra entrega",
    desc: "Pagás al recibir el pedido. Disponible en todas las zonas de cobertura.",
    badge: null,
  },
];

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
              Envíos a Santa Cruz y O'Higgins
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--sub)" }}>
              Despachamos los <strong>martes y viernes</strong>. Coordinamos el horario de entrega
              por WhatsApp una vez confirmado el pedido.
            </p>
          </div>

          {/* Zonas */}
          <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 20 }}>
            Zonas de cobertura
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
            {ZONAS.map((z) => (
              <div
                key={z.zona}
                style={{
                  display: "grid",
                  gridTemplateColumns: "12px 1fr auto",
                  gap: 16,
                  padding: 20,
                  background: z.soft,
                  borderRadius: "var(--r)",
                  alignItems: "start",
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: z.color, marginTop: 4 }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{z.zona}</div>
                  <div style={{ fontSize: 13, color: "var(--sub)", marginBottom: 6 }}>
                    {z.comunas.join(" · ")}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--sub)" }}>{z.nota}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: z.color }}>{z.precio}</div>
                  <div style={{ fontSize: 11, color: "var(--sub)", marginTop: 2 }}>{z.tiempo}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Fuera de cobertura */}
          <div style={{ padding: 20, background: "rgba(0,0,0,.03)", borderRadius: "var(--r)", marginBottom: 48, borderLeft: "3px solid rgba(0,0,0,.12)" }}>
            <strong style={{ fontSize: 14 }}>¿Vivís fuera de la Región de O'Higgins?</strong>
            <p style={{ fontSize: 14, color: "var(--sub)", marginTop: 4, lineHeight: 1.6 }}>
              Por ahora solo llegamos a O'Higgins. Si querés algo, escríbenos por{" "}
              <a href="https://wa.me/56953743338" target="_blank" rel="noopener noreferrer" style={{ color: "var(--orange)", fontWeight: 700 }}>
                WhatsApp
              </a>{" "}
              y lo evaluamos juntos. Próximamente sumamos más ciudades.
            </p>
          </div>

          {/* Métodos de pago */}
          <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 20 }}>
            Medios de pago
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 40 }}>
            {PAGOS.map((p) => (
              <div key={p.titulo} style={{ padding: 24, background: "#fff", borderRadius: "var(--r)", border: "1.5px solid rgba(0,0,0,.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontWeight: 800, fontSize: 15 }}>{p.titulo}</span>
                  {p.badge && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", background: "var(--green-soft)", color: "var(--green)", borderRadius: "var(--r-full)", textTransform: "uppercase", letterSpacing: ".04em" }}>
                      {p.badge}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 14, color: "var(--sub)", lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Datos bancarios placeholder */}
          <div style={{ padding: 24, background: "var(--orange-soft)", borderRadius: "var(--r)", marginBottom: 48 }}>
            <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>Datos para transferencia</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
              {[
                ["Banco", "[BANCO PENDIENTE]"],
                ["Tipo de cuenta", "[TIPO PENDIENTE]"],
                ["Número", "[NÚMERO PENDIENTE]"],
                ["RUT", "[RUT PENDIENTE]"],
                ["Nombre", "[NOMBRE PENDIENTE]"],
                ["Email", "[EMAIL PENDIENTE]"],
              ].map(([label, val]) => (
                <div key={label}>
                  <span style={{ color: "var(--sub)", display: "inline-block", minWidth: 130 }}>{label}:</span>
                  <strong>{val}</strong>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "var(--sub)", marginTop: 12 }}>
              Envía el comprobante por WhatsApp para confirmar el pedido.
            </p>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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
