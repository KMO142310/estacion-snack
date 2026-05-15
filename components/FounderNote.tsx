"use client";

/**
 * FounderNote — bloque humano corto.
 * En mobile prioriza lectura limpia y una sola columna.
 */
export default function FounderNote() {
  return (
    <section aria-label="Nota del operador" className="fn">
      <div className="fn-inner">
        <div className="fn-card">
          <p className="fn-kicker">Nota de Omar</p>

          <div className="fn-copy">
            <p>
              Esto partió por algo simple: quería armar en Santa Cruz un catálogo claro de frutos secos y dulces por kilo, con bolsa sellada, stock real y precio visible.
            </p>
            <p>
              Prefiero vender bien pocas cosas, pero tenerlas claras, responder yo mismo y coordinar cada pedido por WhatsApp sin vueltas.
            </p>
          </div>

          <div className="fn-signoff">
            <div className="fn-avatar" aria-hidden="true">O</div>
            <div className="fn-meta">
              <p className="fn-name">Omar</p>
              <p className="fn-role">Elijo el catálogo, respondo y coordino los despachos</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .fn {
          background:
            radial-gradient(circle at top left, rgba(168,65,26,0.08), transparent 34%),
            linear-gradient(180deg, #FFF9F1 0%, #FCF5EA 100%);
          padding: 3.5rem 1rem;
          border-top: 1px solid rgba(90,31,26,0.08);
          border-bottom: 1px solid rgba(90,31,26,0.08);
        }
        .fn-inner {
          max-width: 760px;
          margin: 0 auto;
        }
        .fn-card {
          padding: 1.4rem 1.15rem 1.2rem;
          border-radius: 26px;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(90,31,26,0.08);
          box-shadow: 0 22px 40px -34px rgba(90,31,26,0.34);
        }
        .fn-kicker {
          margin: 0 0 0.85rem;
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #A8411A;
        }
        .fn-copy {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .fn-copy p {
          margin: 0;
          font-family: var(--font-display);
          font-weight: 500;
          font-size: clamp(1.15rem, 5.2vw, 1.62rem);
          line-height: 1.22;
          letter-spacing: -0.018em;
          color: #5A1F1A;
          text-wrap: pretty;
        }
        .fn-signoff {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(90,31,26,0.1);
        }
        .fn-avatar {
          width: 42px;
          height: 42px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: #5A1F1A;
          color: #F4EADB;
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
        }
        .fn-meta {
          min-width: 0;
        }
        .fn-name {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: #5A1F1A;
        }
        .fn-role {
          margin: 0.15rem 0 0;
          font-family: var(--font-body);
          font-size: 0.8125rem;
          line-height: 1.45;
          color: rgba(90,31,26,0.68);
          text-wrap: balance;
        }

        @media (min-width: 768px) {
          .fn {
            padding: 5rem 1.5rem;
          }
          .fn-card {
            padding: 1.9rem 1.8rem 1.5rem;
            border-radius: 30px;
          }
          .fn-kicker {
            font-size: 0.74rem;
          }
          .fn-copy {
            gap: 1rem;
          }
          .fn-copy p {
            font-size: clamp(1.32rem, 2.5vw, 1.8rem);
            line-height: 1.24;
          }
          .fn-signoff {
            margin-top: 1.5rem;
            padding-top: 1.15rem;
          }
        }
      `}</style>
    </section>
  );
}
