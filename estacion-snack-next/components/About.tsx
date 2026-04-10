export default function About() {
  return (
    <section aria-label="Acerca de" className="wrap">
      <div style={{ paddingBottom: 48 }}>
        <div>
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 400, marginBottom: 12 }}>
            Detrás de <em className="serif">Estación Snack</em>
          </h2>
          <p style={{ fontSize: 15, color: "var(--sub)", lineHeight: 1.7, marginBottom: 12 }}>
            Somos de Santa Cruz y nos cansamos de los snacks caros en envases chicos. Así que decidimos vender directo: por kilo, sin envases de más, a precio justo.
          </p>
          <p style={{ fontSize: 15, color: "var(--sub)", lineHeight: 1.7, marginBottom: 12 }}>
            Seleccionamos cada producto con criterio artesanal: buscamos frescura, sabor real y calidad consistente para que cada kilo valga la pena.
          </p>
          <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
            {[
              { num: "6",   label: "Productos" },
              { num: "2",   label: "Despachos/semana" },
              { num: "0",   label: "Mínimo de compra" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "var(--orange)" }}>{s.num}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--sub)", textTransform: "uppercase", letterSpacing: ".06em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
