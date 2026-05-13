import Link from "next/link";

const guides = [
  {
    href: "/frutos-secos-santa-cruz",
    eyebrow: "Guía local",
    title: "Frutos secos por kilo en Santa Cruz",
    body:
      "Qué puedes pedir hoy, cómo despachamos en el valle y qué productos conviene mirar primero si buscas almendras, mix o bolsas para la casa.",
  },
  {
    href: "/dulces-por-kilo-santa-cruz",
    eyebrow: "Guía local",
    title: "Dulces por kilo en Santa Cruz",
    body:
      "Maní confitado, gomitas y chocolates por kilo para cumpleaños, sobremesa, oficina o simplemente para tener en la despensa.",
  },
];

export default function LocalSeoSection() {
  return (
    <section className="ls">
      <div className="ls-wrap">
        <div className="ls-copy">
          <p className="ls-kicker">Santa Cruz y Colchagua</p>
          <h2 className="ls-title">Una tienda pensada para Santa Cruz y el valle.</h2>
          <p className="ls-body">
            Estación Snack reúne frutos secos y dulces por kilo con precios visibles, stock real y un catálogo claro para quienes compran desde Santa Cruz y comunas cercanas.
          </p>
          <p className="ls-body">
            Despachamos en Santa Cruz, Palmilla, Peralillo y Marchigüe. Puedes revisar el catálogo, armar el pedido y coordinar todo por WhatsApp.
          </p>
        </div>

        <div className="ls-grid">
          {guides.map((guide) => (
            <Link key={guide.href} href={guide.href} className="ls-card">
              <p className="ls-card-eyebrow">{guide.eyebrow}</p>
              <h3 className="ls-card-title">{guide.title}</h3>
              <p className="ls-card-body">{guide.body}</p>
              <span className="ls-card-link">Abrir guía</span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .ls {
          padding: 4rem 0;
          background: linear-gradient(180deg, rgba(241,236,226,0.72) 0%, rgba(255,249,241,0.96) 100%);
          border-top: 1px solid rgba(90,31,26,0.08);
          border-bottom: 1px solid rgba(90,31,26,0.08);
        }
        .ls-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: grid;
          gap: 1.5rem;
        }
        .ls-copy {
          max-width: 720px;
        }
        .ls-kicker {
          margin: 0 0 0.75rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #A8411A;
        }
        .ls-title {
          margin: 0 0 1rem;
          font-size: clamp(1.8rem, 5vw, 2.75rem);
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #5A1F1A;
        }
        .ls-body {
          margin: 0 0 0.95rem;
          font-size: 0.975rem;
          line-height: 1.75;
          color: #5E6B3E;
          max-width: 62ch;
        }
        .ls-grid {
          display: grid;
          gap: 1rem;
        }
        .ls-card {
          display: block;
          padding: 1.35rem;
          border-radius: 24px;
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(90,31,26,0.08);
          box-shadow: 0 16px 32px -28px rgba(90,31,26,0.28);
          text-decoration: none;
        }
        .ls-card-eyebrow {
          margin: 0 0 0.65rem;
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(168,65,26,0.82);
        }
        .ls-card-title {
          margin: 0 0 0.75rem;
          font-size: 1.2rem;
          line-height: 1.15;
          color: #5A1F1A;
        }
        .ls-card-body {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.65;
          color: #5E6B3E;
        }
        .ls-card-link {
          display: inline-flex;
          margin-top: 1rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: #A8411A;
        }
        @media (min-width: 768px) {
          .ls {
            padding: 5rem 0;
          }
          .ls-wrap {
            padding: 0 1.5rem;
          }
          .ls-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .ls-card {
            padding: 1.6rem;
          }
        }
      `}</style>
    </section>
  );
}
