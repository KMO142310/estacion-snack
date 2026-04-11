export default function Benefits() {
  const items = [
    { ico: "⚖️", title: "Compra solo lo que necesitas", desc: "Por kilo, sin envases innecesarios. Stock rotativo: lo que llega esta semana no estuvo meses en una bodega." },
    { ico: "🚗", title: "Te lo llevamos",                desc: "Despacho en Santa Cruz cada martes y viernes. Transferencia o efectivo." },
    { ico: "💬", title: "Pedido en 2 minutos",           desc: "Arma tu pedido acá y se envía directo a nuestro WhatsApp. En 2 minutos, sin crear cuenta." },
  ];

  return (
    <div className="wrap" style={{ padding: "24px 0 40px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 1,
        background: "rgba(0,0,0,.06)",
        borderRadius: "var(--r)",
        overflow: "hidden",
      }}>
        {items.map((it) => (
          <div
            key={it.title}
            style={{
              background: "var(--bg)",
              padding: "24px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 10 }}>{it.ico}</div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{it.title}</h3>
            <p style={{ fontSize: 12, color: "var(--sub)", lineHeight: 1.5 }}>{it.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
