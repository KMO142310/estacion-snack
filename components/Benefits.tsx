export default function Benefits() {
  const items = [
    {
      ico: "⚖️",
      title: "Por kilo, sin envases",
      desc: "Compras lo justo. Stock rotativo — lo que llega esta semana no estuvo meses en bodega.",
    },
    {
      ico: "🚗",
      title: "Te lo llevamos",
      desc: "Despacho en Santa Cruz y alrededores, martes a sábado. Transferencia o efectivo.",
    },
    {
      ico: "💬",
      title: "Pedido en 2 minutos",
      desc: "Armas tu pedido acá y se envía directo a WhatsApp. Sin crear cuenta, sin formularios.",
    },
  ];

  return (
    <section style={{ background: "#F4EADB", padding: "2rem 16px 0.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          background: "rgba(90,31,26,0.08)",
          borderRadius: 14,
          overflow: "hidden",
        }}>
          {items.map((it) => (
            <div
              key={it.title}
              style={{
                background: "#F4EADB",
                padding: "18px 14px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6, lineHeight: 1 }}>{it.ico}</div>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700,
                color: "#5A1F1A", marginBottom: 4, lineHeight: 1.3,
              }}>
                {it.title}
              </p>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: 11, color: "#5E6B3E",
                lineHeight: 1.45, display: "none",
              }}>
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .benefits-desc { display: block !important; }
        }
      `}</style>
    </section>
  );
}
