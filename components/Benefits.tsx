import Scale from "./icons/Scale";
import Truck from "./icons/Truck";
import Chat from "./icons/Chat";

export default function Benefits() {
  const items = [
    { icon: <Scale size={26} />, title: "Por kilo, sin envases" },
    { icon: <Truck size={26} />, title: "Te lo llevamos" },
    { icon: <Chat size={26} />, title: "Pedido en 2 minutos" },
  ];

  return (
    <section style={{ background: "#F4EADB", padding: "1.5rem 16px 0.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 0,
        }}>
          {items.map((it, i) => (
            <div
              key={it.title}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "12px 8px",
                borderRight: i < items.length - 1 ? "1px solid rgba(90,31,26,0.1)" : "none",
              }}
            >
              <div style={{ color: "#D0551F" }}>{it.icon}</div>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600,
                color: "#5A1F1A", textAlign: "center", lineHeight: 1.3,
              }}>
                {it.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
