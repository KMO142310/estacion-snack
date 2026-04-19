export default function Benefits() {
  const items = [
    { label: "Desde 1 kg", copy: "Pides lo justo." },
    { label: "WhatsApp directo", copy: "Confirma una persona." },
    { label: "Despacho local", copy: "Martes a sábado." },
  ];

  return (
    <section style={{ background: "#FFF9F1", borderTop: "1px solid rgba(90,31,26,0.08)", borderBottom: "1px solid rgba(90,31,26,0.08)", padding: "1rem 16px" }}>
      <div className="container">
        <div className="benefits-strip">
          {items.map((item) => (
            <div key={item.label} className="benefit-line">
              <p>{item.label}</p>
              <span>{item.copy}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .benefits-strip {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.9rem;
        }
        .benefit-line {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.35rem 0;
          border-bottom: 1px solid rgba(90,31,26,0.08);
        }
        .benefit-line:last-child {
          border-bottom: none;
        }
        .benefit-line p {
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #A8411A;
        }
        .benefit-line span {
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: #5A1F1A;
          font-weight: 600;
          text-align: right;
        }
        @media (min-width: 900px) {
          .benefits-strip {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1.5rem;
          }
          .benefit-line {
            border-bottom: none;
            border-right: 1px solid rgba(90,31,26,0.08);
            padding-right: 1.5rem;
          }
          .benefit-line:last-child {
            border-right: none;
            padding-right: 0;
          }
        }
      `}</style>
    </section>
  );
}
