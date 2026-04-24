"use client";

import KmStone from "./icons/KmStone";

/**
 * Sección-ancla: manifiesto de marca con identidad ferroviaria.
 * Full-bleed burdeo con tipografía grande y composición asimétrica.
 * Referencia: posters de ramales ferroviarios chilenos + imprenta boletos.
 */
export default function StationManifesto() {
  return (
    <section aria-label="Estación Santa Cruz" className="sm">
      <div className="sm-inner">
        <div className="sm-rail" aria-hidden="true">
          <div className="sm-rail-line" />
          <div className="sm-rail-tick" />
          <div className="sm-rail-tick" />
          <div className="sm-rail-tick" />
          <div className="sm-rail-line" />
        </div>

        <div className="sm-content">
          <div className="sm-head">
            <KmStone size={96} />
            <div className="sm-meta">
              <p className="sm-route">Ramal San Fernando — Pichilemu</p>
              <p className="sm-loc">Estación Santa Cruz · Colchagua</p>
            </div>
          </div>

          <h2 className="sm-title">
            No es <em>gourmet</em>.<br />
            Es <em>bueno</em>, y se pide <em>por kilo</em>.
          </h2>

          <div className="sm-prose">
            <p>
              El negocio nace en Santa Cruz. El nombre viene de que el pueblo
              tuvo una estación de verdad — km 35,5 del ramal a Pichilemu,
              hoy silenciada. Lo del kilo es literal: pedís la cantidad que
              querés, no la que alguien decidió por vos empaquetándolo.
            </p>
            <p>
              Sin checkout con tarjeta. Sin cuenta. Sin newsletter que no
              pediste. Confirmás el pedido por WhatsApp con una persona que
              responde, y arreglamos la entrega.
            </p>
          </div>

          <dl className="sm-stats">
            <div className="sm-stat">
              <dt>Desde</dt>
              <dd>1 kg</dd>
            </div>
            <div className="sm-stat">
              <dt>Comunas</dt>
              <dd>5</dd>
            </div>
            <div className="sm-stat">
              <dt>Despacho</dt>
              <dd>Mar – Sáb</dd>
            </div>
          </dl>
        </div>
      </div>

      <style>{`
        .sm {
          position: relative;
          background: #5A1F1A;
          color: #F4EADB;
          padding: 5rem 1.5rem;
          overflow: hidden;
        }
        .sm::before,
        .sm::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(244,234,219,0.18), transparent);
          pointer-events: none;
        }
        .sm::before { top: 0; }
        .sm::after { bottom: 0; }

        .sm-inner {
          max-width: 960px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          position: relative;
        }

        .sm-rail {
          display: none;
        }
        @media (min-width: 900px) {
          .sm-inner {
            grid-template-columns: 60px 1fr;
            gap: 3rem;
          }
          .sm-rail {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding-top: 4rem;
          }
          .sm-rail-line {
            width: 1px;
            flex: 1;
            background: rgba(244,234,219,0.25);
          }
          .sm-rail-tick {
            width: 18px;
            height: 1px;
            background: rgba(244,234,219,0.35);
          }
        }

        .sm-content { min-width: 0; }

        .sm-head {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        .sm-meta p { margin: 0; line-height: 1.4; }
        .sm-route {
          font-family: var(--font-body);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(244,234,219,0.55);
          margin-bottom: 4px !important;
        }
        .sm-loc {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 1.1rem;
          color: #F4EADB;
        }

        .sm-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(2.25rem, 8vw, 4.75rem);
          line-height: 0.98;
          letter-spacing: -0.035em;
          margin: 0 0 2rem;
          color: #F4EADB;
        }
        .sm-title em {
          font-style: italic;
          font-weight: 400;
          color: #E8B87D;
        }

        .sm-prose {
          max-width: 580px;
          margin-bottom: 3rem;
        }
        .sm-prose p {
          font-family: var(--font-body);
          font-size: clamp(0.95rem, 1.5vw, 1.05rem);
          line-height: 1.7;
          color: rgba(244,234,219,0.82);
          margin: 0 0 1rem;
        }
        .sm-prose p:last-child { margin-bottom: 0; }

        .sm-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin: 0;
          padding-top: 2rem;
          border-top: 1px solid rgba(244,234,219,0.14);
        }
        .sm-stat { margin: 0; }
        .sm-stat dt {
          font-family: var(--font-body);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(244,234,219,0.5);
          margin-bottom: 6px;
        }
        .sm-stat dd {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 500;
          font-size: clamp(1.35rem, 3.5vw, 2rem);
          color: #F4EADB;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        @media (min-width: 768px) {
          .sm { padding: 7rem 2.5rem; }
        }
      `}</style>
    </section>
  );
}
