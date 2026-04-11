const faqs = [
  {
    q: "¿Cómo hago mi pedido?",
    a: 'Agrega los productos al carrito, ingresa tu nombre, celular y comuna, y tocá "Pedir por WhatsApp". Se abre un mensaje con todo tu pedido listo para enviar. Confirmamos por WhatsApp y coordinamos la entrega.',
  },
  {
    q: "¿A qué comunas despachan?",
    a: "Por ahora despachamos dentro de Santa Cruz. Si vivís en otra zona, escríbenos por WhatsApp y lo evaluamos juntos.",
  },
  {
    q: "¿Cuánto cuesta el envío?",
    a: "El envío es gratis. Sin mínimo de compra y sin costo de despacho.",
  },
  {
    q: "¿Cuándo despachan?",
    a: "Los martes y viernes. Coordinamos el horario exacto de entrega por WhatsApp después de confirmar el pedido.",
  },
  {
    q: "¿Qué medios de pago aceptan?",
    a: "Transferencia bancaria o efectivo contra entrega. No cobramos online. Al confirmar el pedido te pasamos los datos bancarios por WhatsApp.",
  },
  {
    q: "¿Cuál es el mínimo de compra?",
    a: "No hay mínimo. Podés pedir desde 0.5 kg de un solo producto.",
  },
  {
    q: "¿Puedo agregar más productos después de enviar el pedido?",
    a: "Sí, siempre que no hayamos salido a despachar. Escríbenos por WhatsApp y lo sumamos al pedido.",
  },
  {
    q: "¿Cuánto duran los productos?",
    a: "Los frutos secos duran 2–3 meses en frasco hermético en lugar fresco y seco. Los dulces y confites duran hasta 6 meses en las mismas condiciones.",
  },
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
