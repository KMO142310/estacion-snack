import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Cómo Estación Snack recopila, usa y protege tus datos personales. Ley 21.719.",
};

const S = { h2: { fontFamily: "var(--font-display)", fontWeight: 600 as const, fontSize: "clamp(1.25rem, 3.5vw, 1.5rem)", color: "#5A1F1A", marginBottom: "0.75rem", marginTop: "2.5rem" }, p: { fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5A1F1A", lineHeight: 1.7, marginBottom: "1rem", opacity: 0.85 }, li: { fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5A1F1A", lineHeight: 1.7, opacity: 0.85, marginBottom: "0.5rem" } };

export default function PrivacidadPage() {
  return (
    <StaticLayout>
      <main style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <nav aria-label="Ruta" style={{ fontSize: "0.8125rem", color: "#5E6B3E", marginBottom: "2rem", display: "flex", gap: "0.375rem", fontFamily: "var(--font-body)" }}>
            <Link href="/" style={{ color: "#5E6B3E" }}>Inicio</Link><span>›</span><span style={{ color: "#5A1F1A", fontWeight: 600 }}>Política de Privacidad</span>
          </nav>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(1.75rem, 5vw, 2.5rem)", color: "#5A1F1A", marginBottom: "0.5rem" }}>Política de Privacidad</h1>
          <p style={{ ...S.p, fontSize: "0.8125rem", color: "#5E6B3E" }}>Última actualización: abril 2026</p>

          <p style={S.p}>En Estación Snack nos tomamos en serio tus datos personales. Esta política explica qué información recopilamos, para qué la usamos y cuáles son tus derechos, en cumplimiento de la Ley 21.719 y la Ley 19.628.</p>

          <h2 style={S.h2}>Quién es responsable de tus datos</h2>
          <p style={S.p}>Estación Snack, con domicilio en Santa Cruz, Región de O&apos;Higgins, Chile. Contacto: WhatsApp +56 9 5374 3338.</p>

          <h2 style={S.h2}>Qué datos recopilamos</h2>
          <p style={{ ...S.p, fontWeight: 600 }}>Datos que nos das al pedir:</p>
          <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <li style={S.li}>Nombre o apodo (como te identificas en WhatsApp).</li>
            <li style={S.li}>Número de teléfono (WhatsApp).</li>
            <li style={S.li}>Dirección de entrega.</li>
            <li style={S.li}>Detalle del pedido y medio de pago elegido.</li>
          </ul>
          <p style={{ ...S.p, fontWeight: 600 }}>Datos automáticos del sitio:</p>
          <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <li style={S.li}>Información de navegación (páginas visitadas, dispositivo, navegador) a través de herramientas de analítica, solo con tu consentimiento.</li>
          </ul>

          <h2 style={S.h2}>Para qué usamos tus datos</h2>
          <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <li style={S.li}><strong>Cumplimiento del pedido</strong>: procesar tu compra, coordinar despacho, gestionar pagos y devoluciones. Base legal: ejecución del contrato.</li>
            <li style={S.li}><strong>Analítica del sitio</strong>: entender cómo se usa el sitio para mejorarlo. Base legal: tu consentimiento, que puedes retirar en cualquier momento.</li>
          </ul>

          <h2 style={S.h2}>Terceros con acceso a datos</h2>
          <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <li style={S.li}><strong>Google Analytics</strong>: analítica de navegación. Solo se activa con tu consentimiento.</li>
            <li style={S.li}><strong>Meta Pixel</strong>: medición de tráfico desde redes sociales. Solo se activa con tu consentimiento.</li>
          </ul>
          <p style={S.p}>Ningún tercero recibe tu nombre, teléfono ni dirección. Los datos de analítica son anonimizados.</p>

          <h2 style={S.h2}>Cookies y rastreo</h2>
          <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <li style={S.li}><strong>Cookies técnicas</strong>: necesarias para que el sitio funcione (por ejemplo, recordar tu carrito). No requieren consentimiento.</li>
            <li style={S.li}><strong>Cookies de analítica</strong>: Google Analytics y Meta Pixel. Se activan solo si aceptas el banner de cookies.</li>
          </ul>

          <h2 style={S.h2}>Cuánto tiempo guardamos tus datos</h2>
          <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <li style={S.li}>Datos de pedidos: 6 meses desde la fecha del pedido.</li>
            <li style={S.li}>Datos de analítica: según la política de retención de cada proveedor.</li>
          </ul>

          <h2 style={S.h2}>Tus derechos (ARCO)</h2>
          <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <li style={S.li}><strong>Acceso</strong>: puedes pedirnos que te digamos qué datos tuyos tenemos.</li>
            <li style={S.li}><strong>Rectificación</strong>: si algún dato está mal, puedes pedir que lo corrijamos.</li>
            <li style={S.li}><strong>Cancelación</strong>: puedes pedir que eliminemos tus datos cuando ya no sean necesarios.</li>
            <li style={S.li}><strong>Oposición</strong>: puedes oponerte al uso de tus datos para un fin específico.</li>
          </ul>
          <p style={S.p}>Para ejercer estos derechos, escríbenos por WhatsApp al <a href="https://wa.me/56953743338" style={{ color: "#D0551F", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}>+56 9 5374 3338</a>. Te respondemos en un plazo máximo de 15 días hábiles.</p>

          <h2 style={S.h2}>Contacto</h2>
          <p style={S.p}>Cualquier duda sobre privacidad: WhatsApp <a href="https://wa.me/56953743338" style={{ color: "#D0551F", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}>+56 9 5374 3338</a>.</p>
        </div>
      </main>
    </StaticLayout>
  );
}
