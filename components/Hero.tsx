"use client";

import Image from "next/image";
import Link from "next/link";
import productsData from "@/data/products.json";
import { fmt } from "@/lib/cart-utils";

interface HeroProps {
  onOrderOpen: () => void;
}

const lead = productsData[0];
const heroSignals = [
  "Bolsa sellada",
  "Despacho local",
  "Pago al recibir",
];

export default function Hero({ onOrderOpen }: HeroProps) {
  return (
    <section aria-label="Inicio" className="hero">
      <div className="hero-promo">
        <span>Santa Cruz y alrededores · Envío gratis sobre $25.000 · Responde una persona</span>
      </div>

      <div className="hero-shell">
        <div className="hero-copy">
          <p className="hero-eyebrow">Santa Cruz · Valle de Colchagua</p>
          <h1 className="hero-title">Frutos secos y dulces por kilo, sin vueltas.</h1>
          <p className="hero-sub">
            Eliges la bolsa, armas el pedido y lo confirmas por WhatsApp.
            Despacho local martes a sábado. Sin cuenta. Sin checkout eterno.
          </p>

          <div className="hero-actions">
            <button type="button" onClick={onOrderOpen} className="hero-cta-primary">
              Armar mi pedido
            </button>
            <a href="#productos" className="hero-cta-secondary">
              Ver catálogo
            </a>
          </div>

          <ul className="hero-signals" aria-label="Ventajas principales">
            {heroSignals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="hero-spotlight">
          <p className="hero-spotlight-kicker">Más pedido esta semana</p>
          <Link href={`/producto/${lead.slug}`} className="hero-product-card">
            <div className="hero-product-copy">
              <p className="hero-product-name">{lead.name}</p>
              <p className="hero-product-price">{fmt(lead.price)} · {lead.format_short ?? "1 kg"}</p>
              <p className="hero-product-blurb">{lead.copy}</p>

              <div className="hero-product-meta">
                <span>Bolsa sellada</span>
                <span>Pedido rápido</span>
                <span>Ver ficha</span>
              </div>
            </div>

            <div className="hero-product-image">
              <Image
                src={lead.image_webp_url}
                alt={`${lead.name} en bolsa sellada`}
                fill
                priority
                sizes="(max-width: 768px) 92vw, 520px"
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>
        </div>
      </div>

      <style>{`
        .hero {
          background:
            radial-gradient(circle at top left, rgba(168, 65, 26, 0.08), transparent 30%),
            linear-gradient(180deg, #FBF8F3 0%, #F7F1E7 100%);
        }

        .hero-promo {
          background: rgba(90, 31, 26, 0.04);
          color: var(--text);
          padding: var(--space-2) var(--edge-pad-mobile);
          text-align: center;
          font-size: var(--fs-xs);
          font-weight: 500;
          letter-spacing: var(--tracking-normal);
          border-bottom: 1px solid var(--line);
        }

        .hero-shell {
          max-width: 1220px;
          margin: 0 auto;
          padding: var(--space-7) var(--edge-pad-mobile) var(--space-8);
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
          align-items: center;
        }

        .hero-copy {
          max-width: 640px;
        }

        .hero-eyebrow {
          margin: 0 0 var(--space-4);
          font-family: var(--font-display);
          font-style: italic;
          font-size: var(--fs-sm);
          color: var(--accent);
        }

        .hero-title {
          margin: 0 0 var(--space-4);
          max-width: 10ch;
          font-size: clamp(2.35rem, 11vw, 5rem);
          line-height: 0.98;
          letter-spacing: -0.04em;
          color: var(--text);
        }

        .hero-sub {
          margin: 0 0 var(--space-6);
          max-width: 56ch;
          font-size: var(--fs-md);
          line-height: 1.6;
          color: var(--text-soft);
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
          align-items: center;
          margin-bottom: var(--space-5);
        }

        .hero-cta-primary,
        .hero-cta-secondary {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 var(--space-5);
          border-radius: var(--radius-full);
          font-size: var(--fs-sm);
          font-weight: 600;
          letter-spacing: var(--tracking-normal);
          transition: transform var(--dur-fast) var(--ease-spring), background var(--dur-base) var(--ease-standard), color var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard);
        }

        .hero-cta-primary {
          background: var(--text);
          color: var(--text-inverse);
          border: none;
          cursor: pointer;
          box-shadow: var(--elev-2);
        }
        .hero-cta-primary:hover { background: var(--burdeo); }
        .hero-cta-primary:active { transform: scale(0.98); }

        .hero-cta-secondary {
          border: 1px solid var(--line-strong);
          color: var(--text);
          background: rgba(255, 255, 255, 0.55);
        }
        .hero-cta-secondary:hover {
          border-color: rgba(168, 65, 26, 0.28);
          color: var(--accent);
        }

        .hero-signals {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          padding: 0;
          margin: 0;
        }
        .hero-signals li {
          padding: 0.6rem 0.95rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.65);
          border: 1px solid rgba(90, 31, 26, 0.08);
          color: var(--text-soft);
          font-size: var(--fs-xs);
          font-weight: 600;
        }

        .hero-spotlight {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .hero-spotlight-kicker {
          margin: 0;
          font-size: var(--fs-xs);
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .hero-product-card {
          display: grid;
          gap: var(--space-5);
          padding: var(--space-5);
          border-radius: 28px;
          background: linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(244,238,227,0.95) 100%);
          border: 1px solid rgba(90, 31, 26, 0.08);
          box-shadow: 0 18px 50px -30px rgba(90, 31, 26, 0.45);
          text-decoration: none;
          color: inherit;
          overflow: hidden;
        }

        .hero-product-copy {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          min-width: 0;
        }

        .hero-product-name {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(1.9rem, 4vw, 2.8rem);
          font-weight: 600;
          line-height: 1;
          letter-spacing: -0.03em;
          color: var(--burdeo);
        }

        .hero-product-price {
          margin: 0;
          font-size: var(--fs-md);
          font-weight: 600;
          color: var(--text);
          font-variant-numeric: tabular-nums;
        }

        .hero-product-blurb {
          margin: var(--space-2) 0 0;
          max-width: 34ch;
          font-size: var(--fs-sm);
          line-height: 1.65;
          color: var(--text-soft);
        }

        .hero-product-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          margin-top: var(--space-3);
        }
        .hero-product-meta span {
          font-size: var(--fs-xs);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(90, 31, 26, 0.75);
        }

        .hero-product-image {
          position: relative;
          min-height: 280px;
          aspect-ratio: 1 / 1;
          border-radius: 20px;
          overflow: hidden;
          background: rgba(244, 238, 227, 0.75);
        }

        @media (min-width: 768px) {
          .hero-promo { padding: var(--space-2) var(--edge-pad-tablet); }
          .hero-shell {
            padding: var(--space-8) var(--edge-pad-tablet) var(--space-9);
          }
          .hero-product-image {
            min-height: 360px;
          }
        }

        @media (min-width: 1100px) {
          .hero-shell {
            grid-template-columns: minmax(0, 1.05fr) minmax(420px, 520px);
            gap: var(--space-7);
            padding: var(--space-8) var(--edge-pad-desktop) var(--space-9);
          }
        }
      `}</style>
    </section>
  );
}
