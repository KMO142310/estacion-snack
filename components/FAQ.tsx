const faqs = [
  { q: "¿Cómo hago mi pedido?", a: 'Agrega los productos que quieras al carrito, abre el detalle, completa tu nombre y dirección, y toca "Enviar por WhatsApp". Se abre un mensaje listo con todo tu pedido. Solo tienes que mandarlo.' },
  { q: "¿Cuál es el mínimo de compra?", a: "No hay mínimo. Puedes pedir desde 1 kilo de un solo producto. Mientras más kilos pidas, mejor se aprovecha el despacho." },
  { q: "¿Cuándo despachan?", a: "Martes y viernes en Santa Cruz y alrededores. Coordinamos el horario contigo por WhatsApp después de confirmar el pedido." },
  { q: "¿Qué medios de pago aceptan?", a: "Transferencia bancaria o efectivo al momento de recibir el pedido. Te enviamos los datos de la cuenta por WhatsApp cuando confirmes." },
  { q: "¿Puedo agregar más productos después de enviar el pedido?", a: "Sí, siempre que no hayamos salido a despachar. Escríbenos por WhatsApp y te ayudamos a sumar lo que quieras." },
  { q: "¿Cuánto duran los productos?", a: "Los frutos secos duran 2-3 meses guardados en frasco hermético en un lugar fresco y seco. Los dulces y confites duran hasta 6 meses en las mismas condiciones." },
];

export default function FAQ() {
  return (
    <section className="wrap" id="faq" style={{ padding: "48px 0" }}>
      <div style={{ paddingBottom: 20, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 400 }}>
          Preguntas frecuentes
        </h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 720, margin: "0 auto" }}>
        {faqs.map((item) => (
          <details
            key={item.q}
            style={{
              background: "var(--bg)",
              border: "1.5px solid rgba(0,0,0,.08)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <summary style={{
              padding: "18px 20px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              listStyle: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}>
              {item.q}
              <span style={{ fontSize: 22, fontWeight: 400, color: "var(--sub)", flexShrink: 0 }}>+</span>
            </summary>
            <p style={{ padding: "0 20px 18px", fontSize: 14, color: "var(--sub)", lineHeight: 1.6, margin: 0 }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
