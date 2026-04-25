"use client";

/**
 * Sección manifiesto — versión sobria.
 * Sin KmStone, sin rieles decorativos, sin "ramal San Fernando-Pichilemu".
 * El concepto ferroviario ya está en el nombre y el logo; aquí dejamos que
 * el copy hable del producto, no del nombre del producto.
 */
export default function StationManifesto() {
  return (
    <section aria-label="Sobre nosotros" className="sm">
      <div className="sm-inner">
        <p className="sm-eyebrow">Santa Cruz · Valle de Colchagua</p>

        <h2 className="sm-title">
          No es <em>granel</em>,<br />
          ni es <em>gourmet</em>.<br />
          Es la <em>bolsa</em> que pediste.
        </h2>

        <div className="sm-prose">
          <p>
            Empezamos vendiendo frutos secos sueltos a los vecinos. Nos cansamos
            de la pesa del mostrador y del «te dejo unos gramitos más». Hoy todo
            sale en bolsa sellada al vacío, formato fijo: 1 kilo, o 500 g si es
            Chuby Bardú. La que pediste es la que llega.
          </p>
          <p>
            Sin checkout con tarjeta, sin cuenta, sin newsletter que no pediste.
            El pedido se confirma por WhatsApp con una persona que responde —
            si algo sale mal, te llega directo.
          </p>
        </div>

        <dl className="sm-stats">
          <div className="sm-stat">
            <dt>Formato</dt>
            <dd>Bolsa sellada</dd>
          </div>
          <div className="sm-stat">
            <dt>Cobertura</dt>
            <dd>4 comunas</dd>
          </div>
          <div className="sm-stat">
            <dt>Despacho</dt>
            <dd>Mar — Sáb</dd>
          </div>
        </dl>
      </div>

      <style>{`
        .sm {
          position: relative;
          background: #5A1F1A;
          color: #F4EADB;
          padding: 4rem 1.5rem;
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
          max-width: 760px;
          margin: 0 auto;
          position: relative;
        }

        .sm-eyebrow {
          font-family: var(--font-body);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(244,234,219,0.6);
          margin: 0 0 1.5rem;
        }

        .sm-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(2.1rem, 7vw, 4rem);
          line-height: 1;
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
          margin-bottom: 2.5rem;
        }
        .sm-prose p {
          font-family: var(--font-body);
          font-size: clamp(0.95rem, 1.5vw, 1.0625rem);
          line-height: 1.7;
          color: rgba(244,234,219,0.82);
          margin: 0 0 1rem;
        }
        .sm-prose p:last-child { margin-bottom: 0; }

        .sm-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin: 0;
          padding-top: 1.75rem;
          border-top: 1px solid rgba(244,234,219,0.14);
        }
        .sm-stat { margin: 0; min-width: 0; }
        .sm-stat dt {
          font-family: var(--font-body);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(244,234,219,0.5);
          margin-bottom: 6px;
        }
        .sm-stat dd {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(1.05rem, 2.6vw, 1.4rem);
          color: #F4EADB;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        @media (min-width: 768px) {
          .sm { padding: 6rem 2.5rem; }
        }
      `}</style>
    </section>
  );
}
