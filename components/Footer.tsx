import Link from "next/link";

/**
 * Footer retail-clean (referencia: grupoalval.com).
 * Multi-columna: marca, tienda, contacto, legal. Negro sobre blanco.
 */
export default function Footer() {
  return (
    <footer className="ft">
      <div className="ft-inner">
        <div className="ft-cols">
          <div className="ft-col">
            <p className="ft-brand">Estación Snack</p>
            <p className="ft-tag">
              Frutos secos en bolsa sellada.<br />
              Santa Cruz, Valle de Colchagua.
            </p>
          </div>

          <div className="ft-col">
            <p className="ft-h">Tienda</p>
            <Link href="/#productos">Productos</Link>
            <Link href="/#packs">Packs</Link>
            <Link href="/envios">Envíos</Link>
            <Link href="/faq">Preguntas frecuentes</Link>
          </div>

          <div className="ft-col">
            <p className="ft-h">Contacto</p>
            <a href="https://wa.me/56953743338" target="_blank" rel="noopener noreferrer">WhatsApp +56 9 5374 3338</a>
            <a href="https://instagram.com/estacionsnack.sc" target="_blank" rel="noopener noreferrer">@estacionsnack.sc</a>
            <Link href="/contacto">Formulario</Link>
          </div>

          <div className="ft-col">
            <p className="ft-h">Legal</p>
            <Link href="/terminos">Términos y condiciones</Link>
            <Link href="/privacidad">Privacidad</Link>
            <Link href="/cambios-devoluciones">Cambios y devoluciones</Link>
          </div>
        </div>

        <div className="ft-bottom">
          <p>© 2026 Estación Snack · Santa Cruz, Chile</p>
          <p className="ft-pay">Pago al recibir · Transferencia · WhatsApp</p>
        </div>
      </div>

      <style>{`
        .ft {
          background: #1d1d1f;
          color: rgba(255,255,255,0.85);
          padding: 3rem 1rem 1.5rem;
        }
        .ft-inner { max-width: 1200px; margin: 0 auto; }
        .ft-cols {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .ft-col {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .ft-col a {
          color: rgba(255,255,255,0.65);
          font-size: 0.875rem;
          padding: 2px 0;
          transition: color 0.15s ease;
        }
        .ft-col a:hover { color: #fff; }
        .ft-brand {
          font-family: var(--font-fraunces), Georgia, serif;
          font-size: 1.25rem;
          font-weight: 500;
          color: #fff;
          margin: 0 0 0.4rem;
          letter-spacing: -0.022em;
        }
        .ft-tag {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.55;
          margin: 0;
        }
        .ft-h {
          font-family: var(--font-fraunces), Georgia, serif;
          font-style: italic;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0;
          text-transform: none;
          color: #E8B894;
          margin: 0 0 0.5rem;
        }
        .ft-bottom {
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.45);
        }
        .ft-pay { font-style: italic; }
        @media (min-width: 700px) {
          .ft { padding: 4rem 1.5rem 2rem; }
          .ft-cols {
            grid-template-columns: 1.3fr 1fr 1.2fr 1fr;
            gap: 3rem;
            padding-bottom: 3rem;
          }
          .ft-bottom {
            flex-direction: row;
            justify-content: space-between;
            padding-top: 2rem;
          }
        }
      `}</style>
    </footer>
  );
}
