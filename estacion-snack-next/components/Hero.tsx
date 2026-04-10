import { WA } from "@/lib/products";

export default function Hero() {
  return (
    <section style={{ textAlign: "center", padding: "48px 0 56px" }}>
      <div
        className="hero-anim-badge"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 18px",
          background: "var(--orange-soft)",
          color: "var(--orange)",
          fontSize: 13,
          fontWeight: 700,
          borderRadius: "var(--r-full)",
          marginBottom: 20,
        }}
      >
        📍 Santa Cruz, Chile
      </div>

      <h1
        className="hero-anim-h1"
        style={{
          fontFamily: "var(--font-dm-serif), Georgia, serif",
          fontSize: "clamp(38px, 7vw, 72px)",
          lineHeight: 0.95,
          letterSpacing: "-.03em",
          marginBottom: 14,
          fontWeight: 400,
        }}
      >
        Tu snack <em style={{ fontStyle: "italic", color: "var(--orange)" }}>favorito,</em>
        <br />sin la bolsa de más
      </h1>

      <p
        className="hero-anim-p"
        style={{
          fontSize: "clamp(15px, 2.5vw, 18px)",
          color: "var(--sub)",
          maxWidth: 480,
          margin: "0 auto 28px",
          lineHeight: 1.6,
        }}
      >
        Frutos secos y dulces frescos por kilo. Elige lo que quieras, arma tu pedido y te lo llevamos a la puerta.
      </p>

      <div
        className="hero-anim-ctas"
        style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}
      >
        <a
          href="#productos"
          style={{
            padding: "14px 32px",
            background: "var(--text)",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            borderRadius: "var(--r-full)",
            border: "3px solid var(--text)",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Ver productos ↓
        </a>
        <a
          href={`https://wa.me/${WA}?text=Hola!%20Quiero%20pedir%20%F0%9F%8C%B0`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "14px 28px",
            background: "transparent",
            color: "var(--text)",
            fontSize: 15,
            fontWeight: 700,
            borderRadius: "var(--r-full)",
            border: "3px solid var(--text)",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          WhatsApp
        </a>
      </div>
    </section>
  );
}
