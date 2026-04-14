const steps = [
  {
    number: "01",
    title: "Eliges cuánto.",
    desc: "Tocas la mezcla, eliges los kilos, lo sumas al pedido. Desde 1 kg por producto.",
  },
  {
    number: "02",
    title: "Mandas el resumen.",
    desc: "Se arma solo. Tocas \"pedir por WhatsApp\" y te llevamos ahí con todo escrito.",
  },
  {
    number: "03",
    title: "Llega martes a sábado.",
    desc: "Confirmamos antes por WhatsApp. Pagas al recibir o por transferencia.",
  },
];

export default function ComoFunciona() {
  return (
    <section
      aria-label="Cómo funciona"
      style={{ background: "#5E6B3E", padding: "5rem 0" }}
    >
      <div className="wrap">
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: 11, fontWeight: 700,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "rgba(244,234,219,0.65)",
          marginBottom: "0.75rem",
        }}>
          Itinerario
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontStyle: "italic",
            fontSize: "clamp(1.75rem, 6vw, 2.5rem)",
            color: "#F4EADB",
            lineHeight: 1.15,
            marginBottom: "2.5rem",
            letterSpacing: "-0.02em",
          }}
        >
          Así llega tu despacho.
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {steps.map(({ number, title, desc }) => (
            <div key={number} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "3.5rem",
                  color: "#A8411A",
                  lineHeight: 1,
                  flexShrink: 0,
                  width: 72,
                }}
                aria-hidden="true"
              >
                {number}
              </span>
              <div style={{ paddingTop: "0.5rem" }}>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "1.25rem",
                    color: "#F4EADB",
                    marginBottom: "0.375rem",
                  }}
                >
                  {title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "rgba(244,234,219,0.78)",
                    lineHeight: 1.65,
                  }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
