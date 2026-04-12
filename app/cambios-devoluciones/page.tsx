import type { Metadata } from "next";
import Link from "next/link";
import StaticLayout from "@/components/StaticLayout";

export const metadata: Metadata = {
  title: "Cambios y Devoluciones",
  description: "Política de cambios, devoluciones y derecho a retracto en Estación Snack. Ley 19.496.",
};

const S = { h2: { fontFamily: "var(--font-display)", fontWeight: 600 as const, fontSize: "clamp(1.25rem, 3.5vw, 1.5rem)", color: "#5A1F1A", marginBottom: "0.75rem", marginTop: "2.5rem" }, p: { fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5A1F1A", lineHeight: 1.7, marginBottom: "1rem", opacity: 0.85 }, li: { fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5A1F1A", lineHeight: 1.7, opacity: 0.85, marginBottom: "0.5rem" } };

export default function CambiosDevolucionesPage() {
  return (
    <StaticLayout>
      <main style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <nav aria-label="Ruta" style={{ fontSize: "0.8125rem", color: "#5E6B3E", marginBottom: "2rem", display: "flex", gap: "0.375rem", fontFamily: "var(--font-body)" }}>
            <Link href="/" style={{ color: "#5E6B3E" }}>Inicio</Link><span>›</span><span style={{ color: "#5A1F1A", fontWeight: 600 }}>Cambios y Devoluciones</span>
          </nav>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(1.75rem, 5vw, 2.5rem)", color: "#5A1F1A", marginBottom: "0.5rem" }}>Cambios y Devoluciones</h1>
          <p style={{ ...S.p, fontSize: "0.8125rem", color: "#5E6B3E" }}>Última actualización: abril 2026</p>

          <p style={S.p}>En Estación Snack queremos que quedes conforme con tu pedido. Si algo no salió como esperabas, acá te explicamos cómo resolverlo.</p>

          <h2 style={S.h2}>Derecho a retracto</h2>
          <p style={S.p}>Según el artículo 3 bis de la Ley 19.496, tenés 10 días hábiles desde que recibís el producto para retractarte de tu compra sin necesidad de dar motivo.</p>
          <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <li style={S.li}>El producto debe estar sin abrir, en las mismas condiciones en que lo recibiste.</li>
            <li style={S.li}>Contactanos dentro del plazo de 10 días hábiles.</li>
          </ul>

          <h2 style={S.h2}>Cómo pedir una devolución</h2>
          <ol style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <li style={S.li}>Escribinos por WhatsApp al <a href="https://wa.me/56953743338" style={{ color: "#D0551F", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}>+56 9 5374 3338</a>.</li>
            <li style={S.li}>Indicanos tu nombre, la fecha del pedido y qué producto querés devolver.</li>
            <li style={S.li}>Coordinamos el retiro del producto en la siguiente ruta de despacho (martes a sábado).</li>
            <li style={S.li}>Una vez que recibimos el producto, procesamos el reembolso.</li>
          </ol>

          <h2 style={S.h2}>Cómo te devolvemos el dinero</h2>
          <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <li style={S.li}>Si pagaste por transferencia bancaria: te devolvemos a la misma cuenta.</li>
            <li style={S.li}>Si pagaste en efectivo: te reembolsamos en la siguiente entrega.</li>
            <li style={S.li}>Plazo: dentro de los 5 días hábiles siguientes a que recibamos el producto.</li>
          </ul>

          <h2 style={S.h2}>Producto en mal estado o dañado</h2>
          <p style={S.p}>Si tu pedido llegó con algún problema:</p>
          <ol style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <li style={S.li}>Escribinos por WhatsApp dentro de las 24 horas de recibido.</li>
            <li style={S.li}>Mandanos una foto del producto tal como lo recibiste.</li>
            <li style={S.li}>Te ofrecemos reemplazo o devolución del dinero, lo que prefieras.</li>
            <li style={S.li}>El reemplazo o reembolso se hace en la siguiente ruta de despacho.</li>
          </ol>
          <p style={S.p}>No necesitás devolver el producto dañado para recibir el reemplazo.</p>

          <h2 style={S.h2}>Cambios de producto</h2>
          <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <li style={S.li}>El producto original debe estar sin abrir.</li>
            <li style={S.li}>El cambio puede ser por un producto de igual o mayor valor. Si cuesta más, pagás la diferencia.</li>
            <li style={S.li}>Coordinamos el cambio en la siguiente ruta de despacho.</li>
          </ul>

          <h2 style={S.h2}>Qué productos no se pueden devolver</h2>
          <p style={S.p}>Productos que ya fueron abiertos o consumidos, parcial o totalmente. Nuestros productos se venden a granel y se embalan al momento — una vez abierto el envase no podemos garantizar su integridad.</p>

          <h2 style={S.h2}>Contacto</h2>
          <p style={S.p}>Cualquier duda o reclamo: WhatsApp <a href="https://wa.me/56953743338" style={{ color: "#D0551F", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}>+56 9 5374 3338</a>. También podés presentar un reclamo en <a href="https://www.sernac.cl" target="_blank" rel="noopener noreferrer" style={{ color: "#D0551F", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}>SERNAC</a>.</p>
        </div>
      </main>
    </StaticLayout>
  );
}
