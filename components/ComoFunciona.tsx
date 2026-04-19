const steps = [
  {
    number: "01",
    title: "Eliges",
    desc: "Abres la mezcla o el pack y agregas lo que quieres pedir.",
  },
  {
    number: "02",
    title: "Revisas",
    desc: "La app arma el resumen y lo dejas listo para WhatsApp.",
  },
  {
    number: "03",
    title: "Confirmas",
    desc: "Coordinamos despacho, horario y forma de pago contigo.",
  },
];

export default function ComoFunciona() {
  return (
    <section aria-label="Cómo funciona" style={{ background: "#FFF9F1", padding: "4rem 16px" }}>
      <div className="container">
        <div style={{ maxWidth: 560, marginBottom: "2rem" }}>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: 11, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: "#A8411A",
            marginBottom: "0.75rem",
          }}>
            Cómo comprar
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(1.75rem, 5vw, 2.4rem)",
              color: "#5A1F1A",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Todo queda resuelto en tres pasos.
          </h2>
        </div>

        <div className="how-grid">
          {steps.map(({ number, title, desc }) => (
            <article key={number} className="how-card">
              <span className="how-number">{number}</span>
              <p className="how-title">{title}</p>
              <p className="how-desc">{desc}</p>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .how-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .how-card {
          background: #fff;
          border: 1px solid rgba(90,31,26,0.08);
          border-radius: 22px;
          padding: 1.25rem;
        }
        .how-number {
          display: inline-block;
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #A8411A;
          margin-bottom: 1rem;
        }
        .how-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 600;
          color: #5A1F1A;
          margin-bottom: 0.45rem;
        }
        .how-desc {
          font-family: var(--font-body);
          font-size: 0.92rem;
          line-height: 1.65;
          color: #5E6B3E;
        }
        @media (min-width: 900px) {
          .how-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>
    </section>
  );
}
