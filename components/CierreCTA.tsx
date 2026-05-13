"use client";

import Chat from "./icons/Chat";
import ShoppingBag from "./icons/ShoppingBag";

interface CierreCTAProps {
  itemCount: number;
  onOrderOpen: () => void;
}

const WA_LINK = "https://wa.me/56953743338?text=Hola%20Estaci%C3%B3n%20Snack,%20tengo%20una%20consulta";

export default function CierreCTA({ itemCount, onOrderOpen }: CierreCTAProps) {
  return (
    <section aria-label="Cierre de compra" className="closing">
      <div className="closing-inner">
        <div className="closing-copy">
          <p className="closing-kicker">Cierre simple</p>
          <h2 className="closing-title">Arma el pedido acá y lo confirmamos por WhatsApp.</h2>
          <p className="closing-sub">
            Ves precios reales, revisas el total y coordinamos retiro o despacho en Santa Cruz y comunas cercanas.
          </p>

          <div className="closing-actions">
            <button type="button" onClick={onOrderOpen} className="closing-primary">
              <ShoppingBag size={18} />
              <span>{itemCount > 0 ? `Ver mi pedido (${itemCount})` : "Abrir mi pedido"}</span>
            </button>

            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="closing-secondary">
              <Chat size={18} />
              <span>Resolver una duda</span>
            </a>
          </div>
        </div>

        <div className="closing-card">
          <p className="closing-card-label">Despacho local</p>
          <ol className="closing-list">
            <li>Te abrimos WhatsApp con el resumen ya escrito.</li>
            <li>Confirmas la comuna y coordinamos entrega o retiro.</li>
            <li>Pagas con transferencia o al recibir.</li>
          </ol>
          <p className="closing-card-note">
            Santa Cruz · Palmilla · Peralillo · Marchigüe
          </p>
        </div>
      </div>

      <style>{`
        .closing {
          padding: 4rem 1rem 4.5rem;
          background:
            radial-gradient(circle at top right, rgba(168, 65, 26, 0.08), transparent 28%),
            #F1ECE2;
          border-top: 1px solid rgba(26, 24, 21, 0.08);
        }

        .closing-inner {
          max-width: 1120px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          align-items: stretch;
        }

        .closing-copy,
        .closing-card {
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(90, 31, 26, 0.08);
          box-shadow: 0 16px 40px -32px rgba(90, 31, 26, 0.35);
          backdrop-filter: blur(12px);
        }

        .closing-copy {
          padding: 2rem;
        }

        .closing-kicker {
          margin: 0 0 0.85rem;
          font-size: var(--fs-xs);
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .closing-title {
          margin: 0 0 1rem;
          font-size: clamp(2rem, 5vw, 3rem);
          line-height: 1;
          letter-spacing: -0.035em;
          color: var(--burdeo);
        }

        .closing-sub {
          margin: 0;
          max-width: 48ch;
          font-size: var(--fs-sm);
          line-height: 1.75;
          color: var(--text-soft);
        }

        .closing-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem;
          margin-top: 1.5rem;
        }

        .closing-primary,
        .closing-secondary {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          padding: 0 1.2rem;
          border-radius: var(--radius-full);
          font-size: var(--fs-sm);
          font-weight: 600;
          letter-spacing: var(--tracking-normal);
          transition: transform var(--dur-fast) var(--ease-spring), background var(--dur-base) var(--ease-standard), color var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard);
        }

        .closing-primary {
          border: none;
          background: var(--burdeo);
          color: var(--text-inverse);
          cursor: pointer;
        }
        .closing-primary:hover { background: #6b261f; }
        .closing-primary:active { transform: scale(0.98); }

        .closing-secondary {
          background: transparent;
          color: var(--text);
          border: 1px solid rgba(90, 31, 26, 0.16);
          text-decoration: none;
        }
        .closing-secondary:hover {
          color: var(--accent);
          border-color: rgba(168, 65, 26, 0.32);
        }

        .closing-card {
          padding: 1.5rem;
        }

        .closing-card-label {
          margin: 0 0 1rem;
          font-size: var(--fs-xs);
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(90, 31, 26, 0.6);
        }

        .closing-list {
          margin: 0;
          padding-left: 1.15rem;
          display: grid;
          gap: 0.8rem;
          color: var(--burdeo);
          font-size: var(--fs-sm);
          line-height: 1.65;
        }

        .closing-card-note {
          margin: 1rem 0 0;
          color: var(--text-soft);
          font-size: var(--fs-xs);
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        @media (min-width: 900px) {
          .closing {
            padding: 5rem 1.5rem;
          }
          .closing-inner {
            grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
            gap: 1rem;
          }
          .closing-copy {
            padding: 2.35rem;
          }
          .closing-card {
            padding: 2rem;
          }
        }
      `}</style>
    </section>
  );
}
