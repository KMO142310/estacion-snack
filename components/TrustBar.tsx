import Scale from "./icons/Scale";
import Truck from "./icons/Truck";
import Chat from "./icons/Chat";

const items = [
  {
    Icon: Scale,
    title: "Pesado al momento",
    desc: "Sin envases industriales.\nSolo lo que pides.",
  },
  {
    Icon: Truck,
    title: "Martes a sábado",
    desc: "Santa Cruz y\nalrededores del valle.",
  },
  {
    Icon: Chat,
    title: "Pedido por WhatsApp",
    desc: "Responde una persona,\nno un bot.",
  },
];

export default function TrustBar() {
  return (
    <section
      aria-label="Por qué elegirnos"
      style={{
        background: "#F4EADB",
        borderBottom: "1px solid rgba(90,31,26,0.10)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "2.5rem 1.25rem",
          gap: "0.5rem",
        }}
      >
        {items.map(({ Icon, title, desc }, i) => (
          <div
            key={title}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "0.5rem 0.5rem",
              borderRight: i < 2 ? "1px solid rgba(122,132,87,0.20)" : "none",
              gap: "0.875rem",
            }}
          >
            <span style={{ color: "#D0551F", display: "flex" }}><Icon size={32} /></span>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#5A1F1A",
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              {title}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: "0.8125rem",
                color: "#5E6B3E",
                lineHeight: 1.5,
                margin: 0,
                whiteSpace: "pre-line",
              }}
            >
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
