"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import productsData from "@/data/products.json";
import { fmt } from "@/lib/cart-utils";
import FlipBoard from "./FlipBoard";

interface HeroProps {
  onOrderOpen: () => void;
}

const lead = productsData[0]; // Mix Europeo — mejor foto

// Tablero de salidas: rota cada 3.2s. Homenaje al nombre "Estación".
// Las frases están pensadas para leerse sin cambiar de registro — tono
// despacho, no marketing.
const BOARD_MESSAGES = [
  "SANTA CRUZ · COLCHAGUA",
  "MARTES A SÁBADO",
  "DESPACHO LOCAL",
  "DESDE 1 KG",
] as const;

export default function Hero({ onOrderOpen: _onOrderOpen }: HeroProps) {
  const [boardIndex, setBoardIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setBoardIndex((i) => (i + 1) % BOARD_MESSAGES.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <section aria-label="Inicio" className="hero">
      <div className="hero-inner">
        <div className="hero-text">
          <div className="hero-board" aria-hidden="true">
            <span className="hero-board-dot" />
            <FlipBoard
              text={BOARD_MESSAGES[boardIndex]}
              fontSize={10.5}
              panelHeight={14}
              letterSpacing="0.18em"
              color="rgba(90,31,26,0.72)"
            />
          </div>

          <h1 className="hero-h1">
            Compra rico.
            <br />
            Pide simple.
          </h1>
          <p className="hero-sub">
            Frutos secos y dulces del Valle de Colchagua, vendidos por kilo.
            Despacho local de martes a sábado.
          </p>

          <div className="hero-ctas">
            <a href="#productos" className="hero-cta">
              Ver productos
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            </a>
            <a href="/sobre-nosotros" className="hero-cta-secondary">Sobre nosotros</a>
          </div>

          <div className="hero-meta" aria-label="Información de servicio">
            <span className="hero-meta-item">
              <span className="hero-meta-dot" aria-hidden="true" /> Pedido abierto ahora
            </span>
          </div>
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
          <div className="hero-img-overlay" aria-hidden="true" />
          <figcaption className="hero-caption">
            <span className="hero-caption-kicker">El más pedido</span>
            <span className="hero-caption-name">{lead.name}</span>
            <span className="hero-caption-meta">{fmt(lead.price)} · 1 kg</span>
          </figcaption>
        </div>
      </div>

      <style>{`
        .hero {
          background: #F7F0E4;
          padding: 1.5rem var(--edge-pad, 1.25rem) 0;
          overflow: hidden;
          position: relative;
        }
        .hero::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(90,31,26,0.12), transparent);
          pointer-events: none;
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
          padding: 0.5rem 0 2rem;
        }
        .hero-board {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 6px 12px 6px 10px;
          margin-bottom: 1.25rem;
          background: rgba(90,31,26,0.05);
          border: 1px solid rgba(90,31,26,0.08);
          border-radius: 999px;
        }
        .hero-board-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #A8411A;
          box-shadow: 0 0 0 3px rgba(168,65,26,0.15);
          flex-shrink: 0;
          animation: hero-pulse 2.4s ease-in-out infinite;
        }
        @keyframes hero-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-board-dot { animation: none; }
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
        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem 1.5rem;
          margin-bottom: 1.5rem;
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
        .hero-cta-secondary {
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 600;
          color: #5A1F1A;
          text-decoration: underline;
          text-underline-offset: 5px;
          text-decoration-thickness: 1px;
          text-decoration-color: rgba(90,31,26,0.3);
          transition: text-decoration-color 0.2s ease;
        }
        @media (hover: hover) {
          .hero-cta-secondary:hover {
            text-decoration-color: #A8411A;
          }
        }
        .hero-meta {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          font-family: var(--font-body);
          font-size: 11.5px;
          color: rgba(90,31,26,0.55);
          font-weight: 500;
          letter-spacing: 0.04em;
        }
        .hero-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .hero-meta-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #5E6B3E;
          animation: hero-pulse 2s ease-in-out infinite;
        }
        .hero-img-wrap {
          position: relative;
          aspect-ratio: 4/5;
          border-radius: 28px 28px 0 0;
          overflow: hidden;
          background: #EDE4D6;
        }
        .hero-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.45) 100%);
          pointer-events: none;
        }
        .hero-caption {
          position: absolute;
          left: 1.25rem;
          right: 1.25rem;
          bottom: 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 2px;
          color: #F4EADB;
          pointer-events: none;
        }
        .hero-caption-kicker {
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(244,234,219,0.78);
          margin-bottom: 2px;
        }
        .hero-caption-name {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .hero-caption-meta {
          font-family: var(--font-body);
          font-size: 12.5px;
          font-weight: 500;
          color: rgba(244,234,219,0.78);
          font-variant-numeric: tabular-nums;
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
            padding: 5rem 0 4rem;
          }
          .hero-img-wrap {
            aspect-ratio: auto;
            height: 100%;
            min-height: 500px;
            border-radius: 32px 32px 0 0;
          }
          .hero-caption {
            left: 1.75rem;
            right: 1.75rem;
            bottom: 1.5rem;
          }
          .hero-caption-name {
            font-size: 1.6rem;
          }
        }
        @media (min-width: 1100px) {
          .hero-inner {
            grid-template-columns: 1.1fr 0.9fr;
          }
          .hero-text {
            padding: 7rem 0 5rem;
          }
        }
      `}</style>
    </section>
  );
}
