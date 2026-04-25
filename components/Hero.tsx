"use client";

import Image from "next/image";
import productsData from "@/data/products.json";

interface HeroProps {
  onOrderOpen: () => void;
}

const featured = productsData.slice(0, 3);

/**
 * Hero retail-clean (referencia: grupoalval.com).
 * - Fondo blanco/off-white.
 * - Sans-serif (sin Fraunces italic).
 * - 3 categorías visuales lado a lado: foco en el catálogo, no en marca.
 * - Sin stickers, sin animaciones decorativas, sin marca-storytelling.
 *   El sitio existe para vender, no para narrar.
 */
export default function Hero({ onOrderOpen }: HeroProps) {
  return (
    <section aria-label="Inicio" className="hero">
      {/* Banner promocional superior — retail standard */}
      <div className="hero-promo">
        <span className="hero-promo-text">
          Despacho martes a sábado · Envío gratis sobre $25.000 · Pago al recibir o transferencia
        </span>
      </div>

      {/* Banner principal con CTAs */}
      <div className="hero-main">
        <div className="hero-main-text">
          <p className="hero-eyebrow">Frutos secos · Santa Cruz</p>
          <h1 className="hero-h1">Bolsa sellada por kilo.</h1>
          <p className="hero-sub">
            Seis productos: cinco en bolsa de 1 kg y Chuby Bardú en bolsa de 500 g.
            Pedido por WhatsApp, llega a tu casa.
          </p>
          <div className="hero-actions">
            <a href="#productos" className="hero-cta hero-cta-primary">Ver catálogo</a>
            <button type="button" onClick={onOrderOpen} className="hero-cta hero-cta-secondary">
              Tu pedido
            </button>
          </div>
        </div>
      </div>

      {/* Tres tiles de categoría — grid clásico de e-commerce */}
      <div className="hero-tiles">
        {featured.map((p) => (
          <a key={p.id} href={`#productos`} className="hero-tile">
            <div className="hero-tile-img">
              <Image
                src={p.image_webp_url}
                alt={p.name}
                fill
                sizes="(max-width: 900px) 100vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="hero-tile-meta">
              <p className="hero-tile-cat">{p.cat_label}</p>
              <p className="hero-tile-name">{p.name}</p>
            </div>
          </a>
        ))}
      </div>

      <style>{`
        .hero {
          background: #FAF9F7;
        }

        .hero-promo {
          background: #000;
          color: #fff;
          padding: 9px 1rem;
          text-align: center;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .hero-promo-text {
          display: inline-block;
        }

        .hero-main {
          padding: 3rem 1rem 2.5rem;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }
        .hero-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #888;
          margin: 0 0 1rem;
        }
        .hero-h1 {
          font-size: clamp(2rem, 6vw, 3.25rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #000;
          margin: 0 0 0.85rem;
        }
        .hero-sub {
          font-size: 1rem;
          line-height: 1.55;
          color: #555;
          max-width: 580px;
          margin: 0 auto 1.75rem;
        }
        .hero-actions {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.85rem 1.6rem;
          border-radius: 4px;
          font-size: 0.9375rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          border: 1.5px solid #000;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
          text-decoration: none;
        }
        .hero-cta-primary {
          background: #000;
          color: #fff;
        }
        .hero-cta-primary:hover { background: #333; }
        .hero-cta-secondary {
          background: transparent;
          color: #000;
        }
        .hero-cta-secondary:hover { background: #000; color: #fff; }

        .hero-tiles {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: #e6e6e6;
          border-top: 1px solid #e6e6e6;
          border-bottom: 1px solid #e6e6e6;
        }
        .hero-tile {
          display: block;
          background: #fff;
          padding: 0;
          color: inherit;
          transition: opacity 0.2s ease;
        }
        .hero-tile:hover { opacity: 0.85; }
        .hero-tile-img {
          position: relative;
          aspect-ratio: 1/1;
          background: #FAF9F7;
        }
        .hero-tile-meta {
          padding: 0.85rem 1rem 1.1rem;
          text-align: center;
        }
        .hero-tile-cat {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #888;
          margin: 0 0 4px;
        }
        .hero-tile-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #000;
          margin: 0;
        }
        @media (min-width: 700px) {
          .hero-tiles { grid-template-columns: repeat(3, 1fr); }
          .hero-main { padding: 4.5rem 1.5rem 3.5rem; }
        }
      `}</style>
    </section>
  );
}
