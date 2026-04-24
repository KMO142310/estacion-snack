const steps = [
  { n: "01", title: "Eliges", desc: "Abres el catálogo y agregas lo que quieres." },
  { n: "02", title: "Revisas", desc: "El resumen queda listo para WhatsApp." },
  { n: "03", title: "Confirmas", desc: "Coordinamos despacho y forma de pago." },
];

export default function ComoFunciona() {
  return (
    <section aria-label="Cómo funciona" className="cf">
      <div className="cf-inner">
        <p className="cf-kicker">Cómo comprar</p>
        <h2 className="cf-title">Tres pasos y listo.</h2>

        <div className="cf-steps">
          {steps.map(({ n, title, desc }) => (
            <div key={n} className="cf-step">
              <span className="cf-n">{n}</span>
              <div>
                <p className="cf-step-title">{title}</p>
                <p className="cf-step-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .cf {
          background: #FFF9F1;
          padding: 5rem 1.25rem;
        }
        .cf-inner {
          max-width: 800px;
          margin: 0 auto;
        }
        .cf-kicker {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #A8411A;
          margin-bottom: 0.75rem;
        }
        .cf-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(1.8rem, 5vw, 2.6rem);
          color: #5A1F1A;
          line-height: 1;
          letter-spacing: -0.03em;
          margin-bottom: 3rem;
        }
        .cf-steps {
          display: grid;
          gap: 0;
        }
        .cf-step {
          display: flex;
          gap: 1.5rem;
          align-items: baseline;
          padding: 1.75rem 0;
          border-bottom: 1px solid rgba(90,31,26,0.08);
        }
        .cf-step:last-child { border-bottom: none; }
        .cf-n {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 2.5rem;
          color: rgba(168,65,26,0.12);
          line-height: 1;
          flex-shrink: 0;
          min-width: 52px;
        }
        .cf-step-title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1.25rem;
          color: #5A1F1A;
          margin-bottom: 4px;
        }
        .cf-step-desc {
          font-family: var(--font-body);
          font-size: 0.9375rem;
          color: #5E6B3E;
          line-height: 1.6;
        }
        @media (min-width: 768px) {
          .cf { padding: 7rem 2.5rem; }
          .cf-steps {
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
          .cf-step {
            flex-direction: column;
            gap: 0.75rem;
            border-bottom: none;
            padding: 0;
          }
          .cf-n { font-size: 3.5rem; }
        }
      `}</style>
    </section>
  );
}
