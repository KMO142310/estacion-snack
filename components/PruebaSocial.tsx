import metricsData from "@/data/metrics.json";

// PENDIENTE_USUARIO: reemplazar los placeholders de capturas de WhatsApp y UGC
// por material real cuando llegue. Ver instrucciones en PENDIENTE_USUARIO.md.
// El contador de entregas se actualiza en data/metrics.json.

const waChats = [
  {
    name: "Javiera",
    location: "Santa Cruz",
    text: "Oye, el mix europeo me duró 4 días en la oficina. Mándame dos kilos más para el jueves",
  },
  {
    name: "Rodrigo",
    location: "Peralillo",
    text: "Todo llegó perfecto. El pack pica fue el hit de la once familiar. Ya voy a pedir otro.",
  },
];

export default function PruebaSocial() {
  const zones = metricsData.zones.join(", ");

  return (
    <section
      aria-label="Prueba social"
      style={{ background: "#F4EADB", padding: "5rem 0" }}
    >
      <div className="wrap">
        {/* Contador operativo */}
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(3rem, 12vw, 5rem)",
              color: "#5A1F1A",
              lineHeight: 1,
              marginBottom: "0.5rem",
            }}
            aria-label={`${metricsData.deliveries} entregas realizadas`}
          >
            {metricsData.deliveries}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "#5E6B3E",
              lineHeight: 1.55,
            }}
          >
            entregas en {zones}
            <br />
            desde {metricsData.since}.
          </p>
        </div>

        {/* Capturas de WhatsApp — placeholders hasta tener material real */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {waChats.map(({ name, location, text }) => (
            <div
              key={name}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "1.125rem",
                boxShadow: "0 2px 12px rgba(90,31,26,0.06)",
                position: "relative",
              }}
            >
              {/* Header del chat */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.75rem" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#E6D4BE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-body)",
                    color: "#5A1F1A",
                    flexShrink: 0,
                  }}
                >
                  {name[0]}
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", color: "#5A1F1A", lineHeight: 1 }}>
                    {name}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#5E6B3E", lineHeight: 1 }}>
                    {location}
                  </p>
                </div>
              </div>

              {/* Burbuja */}
              <div
                style={{
                  background: "rgba(122,132,87,0.14)",
                  borderRadius: "12px 12px 4px 12px",
                  padding: "0.75rem",
                  display: "inline-block",
                  maxWidth: "85%",
                  float: "right",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "#3A2018",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {text}
                </p>
              </div>
              <div style={{ clear: "both" }} />

              {/* Disclaimer: ejemplos representativos hasta tener capturas reales autorizadas (Ley 19.496 art. 28) */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.6875rem",
                  color: "#5E6B3E",
                  marginTop: "0.625rem",
                  fontStyle: "italic",
                }}
              >
                Ejemplo representativo del tipo de pedido que despachamos.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
