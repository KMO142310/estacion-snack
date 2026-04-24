// Tira de confianza — 4 trust signals con iconografía sobria.
// Reemplaza al "italic line" anterior con sustancia visual sin saturar.

const items = [
  { label: "Origen", value: "Valle de Colchagua", icon: "pin" as const },
  { label: "Horario", value: "Martes a sábado", icon: "clock" as const },
  { label: "Cobertura", value: "5 comunas en O'Higgins", icon: "truck" as const },
  { label: "Pago", value: "Al recibir o transferencia", icon: "card" as const },
];

function Icon({ kind }: { kind: "pin" | "clock" | "truck" | "card" }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (kind === "pin")   return (<svg {...common}><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z"/><circle cx="12" cy="9" r="2.5"/></svg>);
  if (kind === "clock") return (<svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>);
  if (kind === "truck") return (<svg {...common}><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18.5" r="1.7"/><circle cx="17" cy="18.5" r="1.7"/></svg>);
  return (<svg {...common}><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/><path d="M7 15h3"/></svg>);
}

export default function Benefits() {
  return (
    <section aria-label="Garantías de servicio" className="trust-bar">
      <div className="trust-inner">
        {items.map((item, i) => (
          <div key={item.label} className={`trust-item ${i > 0 ? "trust-item--bordered" : ""}`}>
            <span className="trust-icon" aria-hidden="true"><Icon kind={item.icon} /></span>
            <div className="trust-text">
              <p className="trust-label">{item.label}</p>
              <p className="trust-value">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .trust-bar {
          background: #FFF9F1;
          border-top: 1px solid rgba(90,31,26,0.07);
          border-bottom: 1px solid rgba(90,31,26,0.07);
          padding: 1.1rem 1.25rem;
        }
        .trust-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem 1.5rem;
          align-items: center;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          min-width: 0;
        }
        .trust-icon {
          color: #A8411A;
          flex-shrink: 0;
          display: inline-flex;
        }
        .trust-text {
          min-width: 0;
        }
        .trust-label {
          font-family: var(--font-body);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(90,31,26,0.55);
          margin: 0 0 1px;
          line-height: 1;
        }
        .trust-value {
          font-family: var(--font-body);
          font-size: 12.5px;
          font-weight: 600;
          color: #5A1F1A;
          margin: 0;
          line-height: 1.25;
        }
        @media (min-width: 768px) {
          .trust-bar { padding: 1.25rem 2.5rem; }
          .trust-inner {
            grid-template-columns: repeat(4, 1fr);
            gap: 0;
          }
          .trust-item--bordered {
            border-left: 1px solid rgba(90,31,26,0.1);
            padding-left: 1.5rem;
          }
          .trust-label { font-size: 10px; }
          .trust-value { font-size: 13.5px; }
        }
      `}</style>
    </section>
  );
}
