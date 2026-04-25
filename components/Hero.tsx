"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import productsData from "@/data/products.json";
import { fmt } from "@/lib/cart-utils";

interface HeroProps {
  onOrderOpen: () => void;
}

const lead = productsData[0]; // Mix Europeo

/**
 * Hero rediseñado con DISCIPLINA tipo Aesop / Graza:
 * - Un solo mensaje grande, sin gimmicks compitiendo.
 * - Status bar minimal (solo dot + clock, sin FlipBoard).
 * - Foto sin rotación, sin tags. Composición clean.
 * - Un solo CTA principal.
 * - El restraint es la jerarquía.
 */
export default function Hero({ onOrderOpen: _onOrderOpen }: HeroProps) {
  const [clock, setClock] = useState("");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      setClock(`${hh}:${mm}`);
      // "Abierto" si es martes a sábado, 9:00-20:00 CLT.
      const day = d.getDay();
      const hr = d.getHours();
      setOpen(day >= 2 && day <= 6 && hr >= 9 && hr < 20);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section aria-label="Inicio" className="hero">
      {/* Status bar minimal — solo lo que aporta señal */}
      <div className="hero-bar">
        <div className="hero-bar-left">
          <span className={`hero-led ${open ? "open" : "closed"}`} aria-hidden="true" />
          <span>{open ? "Tomando pedidos ahora" : "Cerrado · WhatsApp deja mensaje"}</span>
        </div>
        <div className="hero-bar-right">
          <span suppressHydrationWarning>{clock || "—:—"}</span>
          <span className="hero-bar-sep" aria-hidden="true">·</span>
          <span>Santa Cruz, CL</span>
        </div>
      </div>

      <div className="hero-grid">
        <div className="hero-text">
          <p className="hero-eyebrow">Frutos secos del Valle de Colchagua</p>

          <h1 className="hero-h1">
            Bolsa sellada,<br />
            <em>cantidad honesta</em>.
          </h1>

          <p className="hero-sub">
            Sin granel, sin pesa de mostrador. La que pedís es la que llega:
            <strong> 1 kilo</strong> (o <strong>500 g</strong> si es Chuby Bardú),
            cerrada al vacío, lista para la mesa.
          </p>

          <a href="#productos" className="hero-cta">
            Ver las 6 bolsas
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <figure className="hero-figure">
          <div className="hero-photo-frame">
            <Image
              src={lead.image_webp_url}
              alt={lead.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <figcaption className="hero-cap">
            <span className="hero-cap-name">{lead.name}</span>
            <span className="hero-cap-meta">{fmt(lead.price)} · Bolsa de 1 kg</span>
          </figcaption>
        </figure>
      </div>

      <style>{`
        .hero {
          background: #F4EADB;
          position: relative;
          padding: 0 1.5rem;
          overflow: hidden;
        }

        /* Status bar minimal */
        .hero-bar {
          max-width: 1280px;
          margin: 0 auto;
          padding: 14px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid rgba(90,31,26,0.1);
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: rgba(90,31,26,0.7);
        }
        .hero-bar-left,
        .hero-bar-right {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .hero-bar-right { font-variant-numeric: tabular-nums; }
        .hero-bar-sep { color: rgba(90,31,26,0.3); }
        .hero-led {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .hero-led.open {
          background: #5E6B3E;
          box-shadow: 0 0 0 3px rgba(94,107,62,0.18);
          animation: hero-led-pulse 2.4s ease-in-out infinite;
        }
        .hero-led.closed {
          background: #B8B8B8;
        }
        @keyframes hero-led-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-led.open { animation: none; }
        }

        /* Grid principal */
        .hero-grid {
          max-width: 1280px;
          margin: 0 auto;
          padding: 4rem 0 5rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }

        .hero-text { min-width: 0; }
        .hero-eyebrow {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #A8411A;
          margin: 0 0 1.5rem;
        }
        .hero-h1 {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(3rem, 11vw, 6.5rem);
          line-height: 0.95;
          letter-spacing: -0.04em;
          color: #5A1F1A;
          margin: 0 0 1.75rem;
        }
        .hero-h1 em {
          font-style: italic;
          font-weight: 400;
          color: #A8411A;
        }
        .hero-sub {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 300;
          font-size: clamp(1.05rem, 2vw, 1.3rem);
          line-height: 1.55;
          color: #5E6B3E;
          max-width: 540px;
          margin: 0 0 2.5rem;
        }
        .hero-sub strong {
          font-style: normal;
          font-weight: 500;
          color: #5A1F1A;
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 1.0625rem;
          color: #F4EADB;
          background: #5A1F1A;
          padding: 1.1rem 1.85rem;
          border-radius: 999px;
          box-shadow: 0 12px 28px -8px rgba(90,31,26,0.45);
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease;
          text-decoration: none;
        }
        .hero-cta svg { transition: transform 0.25s ease; }
        @media (hover: hover) {
          .hero-cta:hover {
            transform: translateY(-3px);
            box-shadow: 0 18px 40px -10px rgba(90,31,26,0.55);
          }
          .hero-cta:hover svg { transform: translateX(4px); }
        }

        /* Figura: foto + caption */
        .hero-figure {
          margin: 0;
          position: relative;
        }
        .hero-photo-frame {
          position: relative;
          aspect-ratio: 4/5;
          background: #EDE4D6;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 30px 60px -28px rgba(90,31,26,0.4);
        }
        .hero-cap {
          margin-top: 14px;
          padding: 0 4px;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 1rem;
          font-family: var(--font-body);
        }
        .hero-cap-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1.05rem;
          color: #5A1F1A;
          letter-spacing: -0.01em;
        }
        .hero-cap-meta {
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(90,31,26,0.6);
          font-variant-numeric: tabular-nums;
        }

        @media (min-width: 900px) {
          .hero { padding: 0 2.5rem; }
          .hero-grid {
            grid-template-columns: 1.05fr 0.95fr;
            gap: 5rem;
            padding: 6rem 0 7rem;
            min-height: calc(100vh - 68px - 50px);
          }
          .hero-photo-frame { aspect-ratio: 4/5.4; }
        }

        @media (min-width: 1200px) {
          .hero-grid {
            grid-template-columns: 1.15fr 0.85fr;
          }
        }
      `}</style>
    </section>
  );
}
