import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#5A1F1A", padding: "3rem 1.25rem 2rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 600,
          fontSize: "1.25rem", color: "#F4EADB", marginBottom: "0.5rem",
        }}>
          Estación Snack
        </p>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "rgba(244,234,219,0.45)", marginBottom: "2rem",
        }}>
          Santa Cruz · Valle de Colchagua
        </p>

        <nav
          aria-label="Secundaria"
          style={{
            display: "flex", flexWrap: "wrap", gap: "0.5rem 1.25rem",
            justifyContent: "center", fontFamily: "var(--font-body)",
            fontSize: "0.8125rem", color: "rgba(244,234,219,0.65)",
            marginBottom: "1.5rem",
          }}
        >
          <Link href="/#productos" style={{ color: "inherit" }}>Productos</Link>
          <Link href="/envios" style={{ color: "inherit" }}>Envíos</Link>
          <Link href="/faq" style={{ color: "inherit" }}>Preguntas</Link>
          <Link href="/contacto" style={{ color: "inherit" }}>Contacto</Link>
          <Link href="/terminos" style={{ color: "inherit" }}>Términos</Link>
          <Link href="/privacidad" style={{ color: "inherit" }}>Privacidad</Link>
          <a href="https://instagram.com/estacionsnack.sc" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>Instagram</a>
          <a href="https://wa.me/56953743338" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>WhatsApp</a>
        </nav>

        <p style={{
          fontFamily: "var(--font-body)", fontSize: "0.7rem",
          color: "rgba(244,234,219,0.35)", paddingTop: "1rem",
          borderTop: "1px solid rgba(244,234,219,0.08)",
        }}>
          © 2026 Estación Snack
        </p>
      </div>
    </footer>
  );
}
