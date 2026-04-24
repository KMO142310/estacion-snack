"use client";

/**
 * Marquee ferroviario — banda de texto con scroll infinito horizontal.
 * Referencia visual: paneles de información en estaciones + supermercados
 * tradicionales. El CSS-only scroll (transform loop) evita JS ticks.
 */
interface Props {
  items: string[];
  /** Duración de un ciclo completo en segundos. */
  speed?: number;
  background?: string;
  color?: string;
  separatorColor?: string;
  reverse?: boolean;
}

export default function Marquee({
  items,
  speed = 40,
  background = "#5A1F1A",
  color = "#F4EADB",
  separatorColor = "rgba(244,234,219,0.4)",
  reverse = false,
}: Props) {
  // Duplicamos el array para el loop continuo sin corte visible.
  const duplicated = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      style={{
        background,
        color,
        overflow: "hidden",
        padding: "1rem 0",
        borderTop: "1px solid rgba(244,234,219,0.08)",
        borderBottom: "1px solid rgba(244,234,219,0.08)",
      }}
    >
      <div className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}>
        {duplicated.map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-text">{item}</span>
            <span className="marquee-sep" style={{ color: separatorColor }}>
              ✺
            </span>
          </span>
        ))}
      </div>

      <style>{`
        .marquee-track {
          display: inline-flex;
          white-space: nowrap;
          animation: marquee-scroll ${speed}s linear infinite;
          will-change: transform;
        }
        .marquee-reverse {
          animation-direction: reverse;
        }
        .marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 2rem;
          padding-right: 2rem;
        }
        .marquee-text {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(1.25rem, 3vw, 2rem);
          letter-spacing: -0.01em;
          line-height: 1;
        }
        .marquee-sep {
          font-family: var(--font-display);
          font-size: clamp(0.9rem, 2vw, 1.25rem);
        }
        @keyframes marquee-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
