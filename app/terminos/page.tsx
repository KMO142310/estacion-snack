import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de compra en Estación Snack. Venta a granel, despacho en el Valle de Colchagua.",
};

const S = { h2: { fontFamily: "var(--font-display)", fontWeight: 600 as const, fontSize: "clamp(1.25rem, 3.5vw, 1.5rem)", color: "#5A1F1A", marginBottom: "0.75rem", marginTop: "2.5rem" }, p: { fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5A1F1A", lineHeight: 1.7, marginBottom: "1rem", opacity: 0.85 }, li: { fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5A1F1A", lineHeight: 1.7, opacity: 0.85, marginBottom: "0.5rem" } };

export default function TerminosPage() {
  return (
    <StaticLayout>
      <main style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <nav aria-label="Ruta" style={{ fontSize: "0.8125rem", color: "#5E6B3E", marginBottom: "2rem", display: "flex", gap: "0.375rem", fontFamily: "var(--font-body)" }}>
            <Link href="/" style={{ color: "#5E6B3E" }}>Inicio</Link><span>›</span><span style={{ color: "#5A1F1A", fontWeight: 600 }}>Términos y Condiciones</span>
          </nav>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(1.75rem, 5vw, 2.5rem)", color: "#5A1F1A", marginBottom: "0.5rem" }}>Términos y Condiciones</h1>
          <p style={{ ...S.p, fontSize: "0.8125rem", color: "#5E6B3E" }}>Última actualización: abril 2026</p>

          <p style={S.p}>Estos términos regulan la compra de productos en Estación Snack (estacionsnack.cl), operada desde Santa Cruz, Región de O&apos;Higgins, Chile. Al hacer un pedido, aceptas estas condiciones.</p>

          <h2 style={S.h2}>Qué es Estación Snack</h2>
          <p style={S.p}>Somos una tienda de frutos secos, snacks y mezclas que vende por kilo. Los productos vienen en bolsas de 1 kg con cierre, armadas por nosotros. No son envases sellados de fábrica.</p>

          <h2 style={S.h2}>Cómo funciona un pedido</h2>
          <ol style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <li style={S.li}>Eliges los productos y cantidades en estacionsnack.cl.</li>
            <li style={S.li}>Tocas &quot;Confirmar por WhatsApp&quot;. Eso nos envía tu pedido.</li>
            <li style={S.li}>Te respondemos por WhatsApp para confirmar disponibilidad, monto total y coordinar la entrega.</li>
            <li style={S.li}>El pedido queda firme cuando ambas partes confirmamos por WhatsApp.</li>
          </ol>

          <h2 style={S.h2}>Precios y pago</h2>
          <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <li style={S.li}>Todos los precios publicados incluyen IVA.</li>
            <li style={S.li}>Aceptamos transferencia bancaria y efectivo contra entrega.</li>
            <li style={S.li}>El pedido se prepara una vez confirmado el pago por transferencia, o se cobra al momento de la entrega si eliges efectivo.</li>
          </ul>

          <h2 style={S.h2}>Disponibilidad</h2>
          <p style={S.p}>Trabajamos con stock real. Si un producto se agota entre que lo pediste y lo confirmamos, te avisamos y te ofrecemos una alternativa o ajustamos el monto.</p>

          <h2 style={S.h2}>Despacho</h2>
          <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <li style={S.li}>Zona de cobertura: Santa Cruz, Peralillo, Palmilla, Marchigüe y Cunaco.</li>
            <li style={S.li}>Días de despacho: martes a sábado.</li>
            <li style={S.li}>Costo: gratis en compras sobre $25.000. Bajo ese monto: $2.000 (Santa Cruz) o $3.000 (comunas cercanas).</li>
          </ul>

          <h2 style={S.h2}>Derecho a retracto</h2>
          <p style={S.p}>Tienes 10 días hábiles desde que recibes el producto para retractarte de la compra, sin expresar causa, según el artículo 3 bis de la Ley 19.496. El producto debe estar sin abrir y en las mismas condiciones en que lo recibiste. Escríbenos por WhatsApp al +56 9 5374 3338.</p>

          <h2 style={S.h2}>Devolución del pago</h2>
          <p style={S.p}>Si pagaste por transferencia, te devolvemos el monto a la misma cuenta. Si pagaste en efectivo, te lo reembolsamos en la siguiente entrega. Plazo máximo: 5 días hábiles desde que recibimos el producto de vuelta.</p>

          <h2 style={S.h2}>Contacto</h2>
          <p style={S.p}>Cualquier consulta: WhatsApp <a href="https://wa.me/56953743338" style={{ color: "#D0551F", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}>+56 9 5374 3338</a>.</p>
        </div>
      </main>
    </StaticLayout>
  );
}
