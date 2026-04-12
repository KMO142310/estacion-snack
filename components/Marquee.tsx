const items = [
  "Para la oficina", "Para la once", "Para la carretera",
  "Para la casa", "Para compartir", "Despacho martes a sábado",
  "WhatsApp +56 9 5374 3338",
];

function MarqueeSet() {
  return (
    <div style={{ display: "flex", flexShrink: 0 }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center" }}>
          <span style={{
            whiteSpace: "nowrap",
            padding: "0 12px",
            fontSize: 12,
            fontWeight: 700,
            color: "rgba(255,255,255,.5)",
            letterSpacing: ".05em",
            textTransform: "uppercase",
          }}>
            {item}
          </span>
          <span style={{ color: "rgba(255,255,255,.2)", padding: "0 4px" }}>·</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div style={{ overflow: "hidden", padding: "12px 0", background: "var(--text)" }}>
      <div style={{
        display: "flex",
        width: "max-content",
        animation: "mq-scroll 20s linear infinite",
        willChange: "transform",
      }}>
        <MarqueeSet />
        <MarqueeSet />
        <MarqueeSet />
      </div>
    </div>
  );
}
