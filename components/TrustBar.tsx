export default function TrustBar() {
  return (
    <section
      aria-label="Por qué elegirnos"
      style={{ background: "#fff", padding: "1.75rem 1.25rem" }}
    >
      <p style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        gap: "0.75rem", flexWrap: "wrap",
        fontFamily: "var(--font-body)", fontSize: 13, color: "#5A1F1A",
        textAlign: "center", maxWidth: 600, margin: "0 auto",
      }}>
        <span>Por kilo</span>
        <span style={{ color: "rgba(90,31,26,0.2)" }}>·</span>
        <span>Martes a sábado 19:30–21:00</span>
        <span style={{ color: "rgba(90,31,26,0.2)" }}>·</span>
        <span>Pide por WhatsApp</span>
      </p>
    </section>
  );
}
