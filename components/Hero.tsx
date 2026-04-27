"use client";

import Image from "next/image";
import productsData from "@/data/products.json";
import { fmt } from "@/lib/cart-utils";

interface HeroProps {
  onOrderOpen: () => void;
}

const lead = productsData[0]; // Mix Europeo

/**
 * Hero Apple-style.
 * Referencia: apple.com/store, AirPods page, HomePod page.
 *
 * - Tipografía GIGANTE centrada (h1 hasta 72-96px desktop).
 * - Subhead delgado en gris secundario.
 * - 2 CTAs: pill negro principal + link azul Apple ("Ver detalles ›").
 * - Foto del producto destacado debajo, full bleed con bg #F1ECE2.
 * - Spacing vertical generoso (8rem desktop, 4rem mobile).
 */
export default function Hero({ onOrderOpen: _onOrderOpen }: HeroProps) {
  return (
    <section aria-label="Inicio" className="hero">
      {/* Banner promo top — sutil, gris claro Apple */}
      <div className="hero-promo">
        <span>Despacho martes a sábado · Envío gratis sobre $25.000 · Pago al recibir</span>
      </div>

      {/* Headline + CTAs */}
      <div className="hero-headline">
        <p className="hero-eyebrow">Santa Cruz · Valle de Colchagua</p>
        <h1 className="hero-h1">
          Frutos secos,
          <br />
          <span className="hero-h1-soft">por kilo.</span>
        </h1>
        <p className="hero-sub">
          Bolsa sellada. Pedido por WhatsApp. Despacho local en Colchagua.
        </p>
        <div className="hero-actions">
          <a href="#productos" className="hero-cta-primary">
            Ver productos
          </a>
          <a href="#packs" className="hero-cta-link">
            Ver packs <span aria-hidden="true">›</span>
          </a>
        </div>
      </div>

      {/* Producto destacado — full-bleed gris claro Apple style */}
      <div className="hero-product">
        <div className="hero-product-inner">
          <p className="hero-product-tag">Más pedido</p>
          <h2 className="hero-product-name">{lead.name}</h2>
          <p className="hero-product-price">{fmt(lead.price)} · Bolsa de 1 kg</p>
          <a href="#productos" className="hero-product-link">
            Verlo en el catálogo <span aria-hidden="true">›</span>
          </a>
          <div className="hero-product-image">
            <Image
              src={lead.image_webp_url}
              alt={lead.name}
              fill
              priority
              sizes="(max-width: 768px) 90vw, 600px"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>

      <style>{`
        .hero {
          background: #ffffff;
        }

        /* Banner promo — sutil */
        .hero-promo {
          background: #F1ECE2;
          color: #1d1d1f;
          padding: 10px 1.25rem;
          text-align: center;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: -0.005em;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        }

        /* Headline — Apple landing style */
        .hero-headline {
          max-width: 980px;
          margin: 0 auto;
          padding: 4rem 1.25rem 3rem;
          text-align: center;
        }
        .hero-eyebrow {
          font-family: var(--font-fraunces), Georgia, serif;
          font-style: italic;
          font-size: 15px;
          font-weight: 400;
          color: #A8411A;
          letter-spacing: 0;
          margin: 0 0 1rem;
        }
        .hero-h1 {
          font-size: clamp(2.5rem, 9vw, 5.5rem);
          font-weight: 600;
          line-height: 1.05;
          letter-spacing: -0.022em;
          color: #1d1d1f;
          margin: 0 0 1rem;
        }
        .hero-h1-soft {
          color: #6e6e73;
        }
        .hero-sub {
          font-size: clamp(1rem, 1.6vw, 1.25rem);
          line-height: 1.4;
          font-weight: 400;
          color: #1d1d1f;
          margin: 0 auto 2rem;
          max-width: 540px;
          letter-spacing: -0.011em;
        }
        .hero-actions {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 0.75rem 1.75rem;
          justify-content: center;
          align-items: center;
        }
        .hero-cta-primary {
          display: inline-flex;
          align-items: center;
          padding: 0.85rem 1.5rem;
          background: #1d1d1f;
          color: #ffffff;
          border-radius: 980px;
          font-size: 0.9375rem;
          font-weight: 500;
          letter-spacing: -0.005em;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .hero-cta-primary:hover { background: #424245; }
        .hero-cta-primary:active { transform: scale(0.98); }
        .hero-cta-link {
          font-size: 0.9375rem;
          font-weight: 400;
          color: #A8411A;
          letter-spacing: -0.005em;
          transition: color 0.15s ease;
        }
        .hero-cta-link:hover { color: #7a3013; }

        /* Producto destacado — full-bleed con calidez Colchagua */
        .hero-product {
          background: #F1ECE2;
          background-image: radial-gradient(ellipse at 50% 30%, rgba(168,65,26,0.06) 0%, transparent 70%);
          padding: 3.5rem 1.25rem 0;
          text-align: center;
        }
        .hero-product-inner {
          max-width: 980px;
          margin: 0 auto;
        }
        .hero-product-tag {
          font-family: var(--font-fraunces), Georgia, serif;
          font-style: italic;
          font-size: 14px;
          font-weight: 400;
          color: #A8411A;
          letter-spacing: 0;
          text-transform: none;
          margin: 0 0 0.5rem;
        }
        .hero-product-name {
          font-size: clamp(2rem, 5.5vw, 3.5rem);
          font-weight: 600;
          line-height: 1.05;
          letter-spacing: -0.022em;
          color: #1d1d1f;
          margin: 0 0 0.625rem;
        }
        .hero-product-price {
          font-size: 1.0625rem;
          color: #1d1d1f;
          margin: 0 0 0.875rem;
          font-variant-numeric: tabular-nums;
        }
        .hero-product-link {
          display: inline-block;
          font-size: 0.9375rem;
          font-weight: 400;
          color: #A8411A;
          margin-bottom: 2rem;
          letter-spacing: -0.005em;
        }
        .hero-product-link:hover { color: #7a3013; }
        .hero-product-image {
          position: relative;
          aspect-ratio: 16/10;
          width: 100%;
          max-width: 720px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .hero-headline { padding: 6rem 1.5rem 4rem; }
          .hero-product { padding: 5rem 1.5rem 0; }
        }
        @media (min-width: 1100px) {
          .hero-headline { padding: 7rem 2rem 5rem; }
          .hero-product { padding: 6rem 2rem 0; }
        }
      `}</style>
    </section>
  );
}
