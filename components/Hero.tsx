"use client";

import Image from "next/image";
import productsData from "@/data/products.json";

interface HeroProps {
  onOrderOpen: () => void;
}

const lead = productsData[0]; // Mix Europeo — mejor foto

export default function Hero({ onOrderOpen }: HeroProps) {
  return (
    <section aria-label="Inicio" className="hero">
      <div className="hero-inner">
        <div className="hero-text">
          <h1 className="hero-h1">
            Compra rico.
            <br />
            Pide simple.
          </h1>
          <p className="hero-sub">
            Frutos secos y dulces del Valle de Colchagua, vendidos por kilo.
            Despacho local de martes a sábado.
          </p>
          <a href="#productos" className="hero-cta">
            Ver productos
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </a>
        </div>
        <div className="hero-img-wrap">
          <Image
            src={lead.image_webp_url}
            alt={lead.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      <style>{`
        .hero {
          background: #F7F0E4;
          padding: 2rem var(--edge-pad, 1.25rem) 0;
          overflow: hidden;
        }
        .hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: end;
        }
        .hero-text {
          padding: 1rem 0 2rem;
        }
        .hero-h1 {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(3.2rem, 11vw, 6.5rem);
          line-height: 0.9;
          letter-spacing: -0.045em;
          color: #5A1F1A;
          margin: 0 0 1.5rem;
        }
        .hero-sub {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 300;
          font-size: clamp(1rem, 2.5vw, 1.3rem);
          line-height: 1.5;
          color: #5E6B3E;
          max-width: 420px;
          margin: 0 0 2rem;
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 1rem;
          color: #F4EADB;
          background: #A8411A;
          padding: 1rem 2rem;
          border-radius: 14px;
          box-shadow: 0 8px 24px rgba(168,65,26,0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
        }
        @media (hover: hover) {
          .hero-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(168,65,26,0.35);
          }
        }
        .hero-img-wrap {
          position: relative;
          aspect-ratio: 4/5;
          border-radius: 28px 28px 0 0;
          overflow: hidden;
          background: #EDE4D6;
        }
        @media (min-width: 768px) {
          .hero {
            padding: 0 var(--edge-pad-lg, 2.5rem);
          }
          .hero-inner {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            min-height: 80vh;
          }
          .hero-text {
            padding: 6rem 0 5rem;
          }
          .hero-img-wrap {
            aspect-ratio: auto;
            height: 100%;
            min-height: 500px;
            border-radius: 32px 32px 0 0;
          }
        }
        @media (min-width: 1100px) {
          .hero-inner {
            grid-template-columns: 1.1fr 0.9fr;
          }
          .hero-text {
            padding: 8rem 0 6rem;
          }
        }
      `}</style>
    </section>
  );
}
