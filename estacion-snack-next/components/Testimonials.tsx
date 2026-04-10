const reviews = [
  { stars: "★★★★★", text: '"El Mix Europeo es adictivo. Pedí 2 kilos y en la oficina duraron 3 días."', author: "— Camila R., Santa Cruz" },
  { stars: "★★★★★", text: '"Me encanta que puedo pedir por WhatsApp y me llega a la casa. Super práctico."', author: "— Tomás M., Santa Cruz" },
  { stars: "★★★★★", text: '"Los confites Chuby Bardú son los favoritos de mis hijos. Siempre tengo un kilo en la casa."', author: "— Francisca L., Santa Cruz" },
];

export default function Testimonials() {
  return (
    <section aria-label="Testimonios" className="wrap">
      <div style={{ padding: "0 0 20px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 400 }}>
          Lo que dicen nuestros clientes
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, paddingBottom: 48 }}>
        {reviews.map((r) => (
          <div
            key={r.author}
            className="reveal"
            style={{ background: "var(--sand-soft)", borderRadius: "var(--r)", padding: 24 }}
          >
            <div style={{ fontSize: 14, marginBottom: 10, letterSpacing: 2 }}>{r.stars}</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 14, fontStyle: "italic", color: "var(--text)" }}>{r.text}</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--sub)" }}>{r.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
