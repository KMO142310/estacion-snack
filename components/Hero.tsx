"use client";

import Image from "next/image";
import productsData from "@/data/products.json";
import { fmt } from "@/lib/cart-utils";

interface HeroProps {
  onOrderOpen: () => void;
}

const lead = productsData[0]; // Mix Europeo

/**
 * Hero — base científica.
 * Type scale modular fluido (--fs-*), spacing 8pt, colores OKLCH,
 * motion tokens. Estructura editorial: eyebrow + display H1 + sub
 * de respiración + CTAs claros + producto líder full-bleed.
 */
export default function Hero({ onOrderOpen: _onOrderOpen }: HeroProps) {
  return (
    <section aria-label="Inicio" className="hero">
      <div className="hero-promo">
        <span>Despacho martes a sábado · Envío gratis sobre $25.000 · Pago al recibir</span>
      </div>

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
          background: var(--bg);
        }

        .hero-promo {
          background: var(--surface-1);
          color: var(--text);
          padding: var(--space-2) var(--edge-pad-mobile);
          text-align: center;
          font-size: var(--fs-xs);
          font-weight: 400;
          letter-spacing: var(--tracking-normal);
          border-bottom: 1px solid var(--line);
        }

        .hero-headline {
          max-width: 980px;
          margin: 0 auto;
          padding: var(--space-8) var(--edge-pad-mobile) var(--space-7);
          text-align: center;
        }
        .hero-eyebrow {
          font-family: var(--font-display);
          font-style: italic;
          font-size: var(--fs-sm);
          font-weight: 400;
          color: var(--accent);
          margin: 0 0 var(--space-4);
        }
        .hero-h1 {
          font-size: var(--fs-5xl);
          font-weight: 500;
          line-height: var(--lh-tight);
          letter-spacing: var(--tracking-tight);
          color: var(--text);
          margin: 0 0 var(--space-4);
          font-variation-settings: "opsz" 96, "SOFT" 50;
        }
        .hero-h1-soft {
          color: var(--text-soft);
        }
        .hero-sub {
          font-size: var(--fs-md);
          line-height: var(--lh-snug);
          font-weight: 400;
          color: var(--text);
          margin: 0 auto var(--space-6);
          max-width: 540px;
          letter-spacing: var(--tracking-normal);
        }
        .hero-actions {
          display: inline-flex;
          flex-wrap: wrap;
          gap: var(--space-3) var(--space-6);
          justify-content: center;
          align-items: center;
        }
        .hero-cta-primary {
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          padding: var(--space-3) var(--space-5);
          background: var(--text);
          color: var(--text-inverse);
          border-radius: var(--radius-full);
          font-size: var(--fs-sm);
          font-weight: 500;
          letter-spacing: var(--tracking-normal);
          transition: background var(--dur-base) var(--ease-standard),
                      transform var(--dur-fast) var(--ease-spring);
        }
        .hero-cta-primary:hover { background: var(--burdeo); }
        .hero-cta-primary:active { transform: scale(0.97); }
        .hero-cta-link {
          font-size: var(--fs-sm);
          font-weight: 400;
          color: var(--accent);
          letter-spacing: var(--tracking-normal);
          transition: color var(--dur-fast) var(--ease-standard);
        }
        .hero-cta-link:hover { color: var(--accent-hover); }

        .hero-product {
          background: var(--surface-1);
          background-image: radial-gradient(
            ellipse at 50% 30%,
            color-mix(in oklch, var(--accent) 7%, transparent) 0%,
            transparent 70%
          );
          padding: var(--space-7) var(--edge-pad-mobile) 0;
          text-align: center;
        }
        .hero-product-inner {
          max-width: 980px;
          margin: 0 auto;
        }
        .hero-product-tag {
          font-family: var(--font-display);
          font-style: italic;
          font-size: var(--fs-sm);
          font-weight: 400;
          color: var(--accent);
          margin: 0 0 var(--space-2);
        }
        .hero-product-name {
          font-size: var(--fs-4xl);
          font-weight: 500;
          line-height: var(--lh-tight);
          letter-spacing: var(--tracking-tight);
          color: var(--text);
          margin: 0 0 var(--space-2);
        }
        .hero-product-price {
          font-size: var(--fs-md);
          color: var(--text);
          margin: 0 0 var(--space-3);
          font-variant-numeric: tabular-nums;
        }
        .hero-product-link {
          display: inline-block;
          font-size: var(--fs-sm);
          font-weight: 400;
          color: var(--accent);
          margin-bottom: var(--space-6);
          letter-spacing: var(--tracking-normal);
          transition: color var(--dur-fast) var(--ease-standard);
        }
        .hero-product-link:hover { color: var(--accent-hover); }
        .hero-product-image {
          position: relative;
          aspect-ratio: 16/10;
          width: 100%;
          max-width: 720px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .hero-promo { padding: var(--space-2) var(--edge-pad-tablet); }
          .hero-headline { padding: var(--space-9) var(--edge-pad-tablet) var(--space-8); }
          .hero-product { padding: var(--space-8) var(--edge-pad-tablet) 0; }
        }
        @media (min-width: 1100px) {
          .hero-headline { padding: var(--space-10) var(--edge-pad-desktop) var(--space-9); }
          .hero-product { padding: var(--space-9) var(--edge-pad-desktop) 0; }
        }
      `}</style>
    </section>
  );
}
