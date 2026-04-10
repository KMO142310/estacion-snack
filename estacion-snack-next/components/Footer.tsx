export default function Footer() {
  return (
    <footer style={{ background: "var(--text)", color: "rgba(255,255,255,.65)", padding: "48px 0 24px", marginTop: 24 }}>
      <div className="wrap">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 32,
          paddingBottom: 32,
          borderBottom: "1px solid rgba(255,255,255,.08)",
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 24, color: "#fff", marginBottom: 8 }}>
              Estación Snack
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 320 }}>
              Frutos secos y dulces frescos por kilo en Santa Cruz. Sin envases innecesarios, a precio justo.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "#fff", marginBottom: 14, fontWeight: 700 }}>Tienda</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <li><a href="#productos" style={{ color: "rgba(255,255,255,.65)" }}>Productos</a></li>
              <li><a href="#combos" style={{ color: "rgba(255,255,255,.65)" }}>Packs</a></li>
              <li><a href="#faq" style={{ color: "rgba(255,255,255,.65)" }}>Preguntas</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "#fff", marginBottom: 14, fontWeight: 700 }}>Contacto</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <li>+56 9 5374 3338</li>
              <li>Santa Cruz, Chile</li>
              <li>Mar y Vie · 10:00 – 19:00</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "#fff", marginBottom: 14, fontWeight: 700 }}>Legal</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <li>Términos</li>
              <li>Privacidad</li>
            </ul>
          </div>
        </div>
        <div style={{ paddingTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, fontSize: 11, textAlign: "center" }}>
          <span>© 2026 Estación Snack · Santa Cruz, Chile</span>
          <span>Hecho con cariño 🌰</span>
        </div>
      </div>
    </footer>
  );
}
