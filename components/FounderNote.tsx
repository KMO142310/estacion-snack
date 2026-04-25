"use client";

/**
 * FounderNote — voz personal del operador, no copy genérica de marca.
 * Bloque corto con tono directo + firma. Aporta confianza humana.
 */
export default function FounderNote() {
  return (
    <section aria-label="Nota del operador" className="fn">
      <div className="fn-inner">
        <div className="fn-quote-wrap">
          <span className="fn-quote-mark" aria-hidden="true">«</span>
          <p className="fn-quote">
            Empecé esto porque me cansé de comprar 200 g de almendras
            empaquetadas como si fueran joyas.
            <br />
            Acá te llega la <em>bolsa entera</em>, sellada al vacío,
            al precio que tendría que costar.
          </p>
          <span className="fn-quote-mark fn-quote-mark-close" aria-hidden="true">»</span>
        </div>

        <div className="fn-sig">
          <svg viewBox="0 0 220 50" aria-hidden="true" className="fn-sig-svg">
            {/* Firma estilizada — path "Omar" hecho como si fuera escrito a mano */}
            <path
              d="M 8 35 q 6 -22 22 -22 q 16 0 16 18 q 0 14 -16 14 q -16 0 -16 -14 z"
              fill="none" stroke="#5A1F1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            />
            <path
              d="M 56 35 q 0 -18 12 -18 q 6 0 6 8 l 0 10 q 0 -14 14 -14 q 6 0 6 8 l 0 12"
              fill="none" stroke="#5A1F1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            />
            <path
              d="M 102 18 q -2 16 6 22 q 12 4 14 -10 q 0 -10 -10 -10 q -8 0 -10 6"
              fill="none" stroke="#5A1F1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            />
            <path
              d="M 132 35 l 0 -16 q 0 -8 8 -8 q 6 0 8 4 q 4 -4 8 -4 q 8 0 8 8 l 0 16"
              fill="none" stroke="#5A1F1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Subrayado de firma */}
            <path
              d="M 8 44 Q 80 48, 168 42"
              fill="none" stroke="#B94A1F" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"
            />
          </svg>
          <div className="fn-meta">
            <p className="fn-name">Omar</p>
            <p className="fn-role">Lo que llega a tu casa, lo elegí yo</p>
          </div>
        </div>
      </div>

      <style>{`
        .fn {
          background: #FFF9F1;
          padding: 4rem 1.5rem;
          position: relative;
          border-top: 1px solid rgba(90,31,26,0.08);
          border-bottom: 1px solid rgba(90,31,26,0.08);
        }
        .fn-inner {
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          align-items: flex-start;
        }
        .fn-quote-wrap { position: relative; padding-left: 0; }
        .fn-quote-mark {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 400;
          font-size: 5rem;
          line-height: 0.5;
          color: rgba(168,65,26,0.35);
          display: block;
          margin-bottom: -0.4em;
        }
        .fn-quote-mark-close {
          text-align: right;
          margin-bottom: 0;
          margin-top: -0.2em;
          margin-right: 0.4em;
        }
        .fn-quote {
          font-family: var(--font-display);
          font-weight: 400;
          font-size: clamp(1.35rem, 3.5vw, 2.05rem);
          line-height: 1.32;
          color: #5A1F1A;
          margin: 0;
          letter-spacing: -0.015em;
        }
        .fn-quote em {
          font-style: italic;
          color: #B94A1F;
          font-weight: 500;
        }
        .fn-sig {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .fn-sig-svg {
          width: 130px;
          height: 36px;
          flex-shrink: 0;
        }
        .fn-meta { line-height: 1.3; }
        .fn-name {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.05rem;
          color: #5A1F1A;
          margin: 0;
        }
        .fn-role {
          font-family: var(--font-body);
          font-size: 0.8125rem;
          font-style: italic;
          color: rgba(90,31,26,0.6);
          margin: 0;
        }
        @media (min-width: 768px) {
          .fn { padding: 6rem 2.5rem; }
        }
      `}</style>
    </section>
  );
}
