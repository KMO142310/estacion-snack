// Tira de confianza — íconos dibujados a trazo irregular sobre filtro "rough"
// (feTurbulence + feDisplacementMap), para evitar la línea de Feather/Heroicons.
// Cada bloque neutraliza una objeción específica del flujo WhatsApp.

const items = [
  { label: "Origen",     value: "Valle de Colchagua",        icon: "grape" as const },
  { label: "Despacho",   value: "Martes a sábado",           icon: "calendar" as const },
  { label: "Llegada",    value: "Santa Cruz y alrededores",  icon: "truck" as const },
  { label: "Pago",       value: "Al recibir o transferencia", icon: "note" as const },
];

function Icon({ kind }: { kind: "grape" | "calendar" | "truck" | "note" }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.85,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    filter: "url(#rough)",
    "aria-hidden": true as const,
  };
  if (kind === "grape") {
    // Racimo colchagüino: hoja arriba, uvas en triángulo invertido
    return (
      <svg {...common}>
        <path d="M22 8 C24 6, 28 7, 29 10 C32 9, 35 12, 33 15" />
        <circle cx="20" cy="20" r="3.2" />
        <circle cx="27" cy="20" r="3.2" />
        <circle cx="23.5" cy="26" r="3.2" />
        <circle cx="17" cy="28" r="3.2" />
        <circle cx="30" cy="28" r="3.2" />
        <circle cx="23.5" cy="34" r="3.2" />
      </svg>
    );
  }
  if (kind === "calendar") {
    // Página de calendario, con marca X en un día
    return (
      <svg {...common}>
        <path d="M10 14 Q10 12, 12 12 L36 12 Q38 12, 38 14 L38 36 Q38 38, 36 38 L12 38 Q10 38, 10 36 Z" />
        <path d="M16 8 L16 16" />
        <path d="M32 8 L32 16" />
        <path d="M10 20 L38 20" />
        <path d="M18 27 L22 31 L30 23" />
      </svg>
    );
  }
  if (kind === "truck") {
    // Camioneta de reparto lateral
    return (
      <svg {...common}>
        <path d="M6 14 L26 14 L26 32 L6 32 Z" />
        <path d="M26 20 L34 20 L40 26 L40 32 L26 32" />
        <circle cx="13" cy="34" r="3.2" />
        <circle cx="33" cy="34" r="3.2" />
        <path d="M10 20 L20 20" />
      </svg>
    );
  }
  // note: billete/boleta
  return (
    <svg {...common}>
      <path d="M8 14 L40 14 L40 34 L8 34 Z" />
      <circle cx="24" cy="24" r="4.5" />
      <path d="M13 20 L13 28" />
      <path d="M35 20 L35 28" />
    </svg>
  );
}

export default function Benefits() {
  return (
    <section aria-label="Garantías de servicio" className="trust-bar">
      {/* Filtro SVG que distorsiona cada trazo; evita la pulcritud de iconos default. */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="1.6" />
          </filter>
        </defs>
      </svg>

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
          border-top: 1px solid rgba(90,31,26,0.08);
          border-bottom: 1px solid rgba(90,31,26,0.08);
          padding: 1.6rem 1.25rem;
          position: relative;
        }
        .trust-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.4rem 1.5rem;
          align-items: center;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          min-width: 0;
        }
        .trust-icon {
          color: #A8411A;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }
        .trust-text { min-width: 0; }
        .trust-label {
          font-family: var(--font-body);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(90,31,26,0.52);
          margin: 0 0 2px;
          line-height: 1;
        }
        .trust-value {
          font-family: var(--font-display);
          font-weight: 500;
          font-size: 0.95rem;
          color: #5A1F1A;
          margin: 0;
          line-height: 1.25;
          letter-spacing: -0.005em;
        }
        @media (min-width: 768px) {
          .trust-bar { padding: 1.75rem 2.5rem; }
          .trust-inner {
            grid-template-columns: repeat(4, 1fr);
            gap: 0;
          }
          .trust-item--bordered {
            border-left: 1px solid rgba(90,31,26,0.1);
            padding-left: 1.75rem;
          }
          .trust-label { font-size: 10px; }
          .trust-value { font-size: 1.02rem; }
        }
      `}</style>
    </section>
  );
}
