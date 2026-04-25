"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import productsData from "@/data/products.json";
import { fmt } from "@/lib/cart-utils";
import Sticker from "./Sticker";
import HandUnderline from "./HandUnderline";

interface HeroProps {
  onOrderOpen: () => void;
}

const lead = productsData[0]; // Mix Europeo

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
      <div className="hero-bar">
        <div className="hero-bar-left">
          <span className={`hero-led ${open ? "open" : "closed"}`} aria-hidden="true" />
          <span>{open ? "Mesa abierta · responde una persona" : "Cerrado · deja mensaje en WhatsApp"}</span>
        </div>
        <div className="hero-bar-right">
          <span suppressHydrationWarning>{clock || "—:—"}</span>
          <span className="hero-bar-sep" aria-hidden="true">·</span>
          <span>Santa Cruz · Colchagua</span>
        </div>
      </div>

      <div className="hero-grid">
        <div className="hero-text">
          <p className="hero-eyebrow">
            <span className="hero-eyebrow-mark" aria-hidden="true" />
            Frutos secos del Valle de Colchagua
          </p>

          <h1 className="hero-h1">
            Lo que <HandUnderline color="#B94A1F" thickness={5}>pediste</HandUnderline>
            <br />
            es <em>lo que llega</em>.
          </h1>

          <p className="hero-sub">
            Bolsa sellada al vacío. <strong>1 kilo</strong> (o <strong>500 g</strong> si es
            Chuby Bardú). Sin granel, sin tarjeta, sin trampa.
            Despacho martes a sábado en cuatro comunas de Colchagua.
          </p>

          <div className="hero-actions">
            <a href="#productos" className="hero-cta">
              Ver las seis bolsas
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#packs" className="hero-link">
              o armar un pack
            </a>
          </div>
        </div>

        <figure className="hero-figure">
          <div className="hero-photo-frame img-warm-frame">
            <Image
              src={lead.image_webp_url}
              alt={lead.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
            <span className="hero-stamp" aria-hidden="true">
              <span className="hero-stamp-kicker">Bolsa destacada</span>
              <span className="hero-stamp-name">{lead.name}</span>
              <span className="hero-stamp-meta">{fmt(lead.price)} · 1 kg sellado</span>
            </span>
          </div>

          {/* Stickers flotantes — afuera del .hero-photo-frame (que tiene overflow:hidden).
              Anclados al .hero-figure (relative) para asomar fuera del marco. */}
          <span className="hero-sticker hero-sticker-1">
            <Sticker tone="terracota" rotate={-8} size="md" variant="badge">
              ✓ Sellado al vacío
            </Sticker>
          </span>
          <span className="hero-sticker hero-sticker-2">
            <Sticker tone="oliva" rotate={6} size="sm" variant="label">
              Hecho acá
            </Sticker>
          </span>
          <span className="hero-sticker hero-sticker-3">
            <Sticker tone="crema" rotate={-3} size="sm" variant="tag">
              Sin RUT empresa
            </Sticker>
          </span>
          <figcaption className="hero-cap">
            <span className="hero-cap-name">{lead.name}</span>
            <span className="hero-cap-meta">Almendra · nuez · avellana europea · maní sin sal</span>
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
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-body);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #A8411A;
          margin: 0 0 1.5rem;
        }
        .hero-eyebrow-mark {
          display: inline-block;
          width: 22px;
          height: 1px;
          background: currentColor;
          opacity: 0.55;
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
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem 1.5rem;
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
        .hero-link {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 0.975rem;
          color: #5A1F1A;
          text-decoration: underline;
          text-underline-offset: 5px;
          text-decoration-thickness: 1px;
          text-decoration-color: rgba(90,31,26,0.35);
          transition: text-decoration-color 0.2s ease, color 0.2s ease;
        }
        @media (hover: hover) {
          .hero-link:hover { color: #A8411A; text-decoration-color: #A8411A; }
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
          border-radius: 4px;
          overflow: hidden;
          box-shadow:
            0 1px 0 rgba(90,31,26,0.08),
            0 30px 60px -28px rgba(90,31,26,0.4),
            inset 0 0 0 1px rgba(90,31,26,0.06);
        }
        /* Sello estilo papeleta de despacho sobrepuesto a la foto */
        .hero-stamp {
          position: absolute;
          left: 14px;
          bottom: 14px;
          z-index: 2;
          display: inline-flex;
          flex-direction: column;
          gap: 2px;
          padding: 10px 14px;
          background: rgba(244,234,219,0.94);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(90,31,26,0.14);
          border-radius: 3px;
          max-width: 72%;
        }
        .hero-stamp-kicker {
          font-family: var(--font-body);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #A8411A;
        }
        .hero-stamp-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.95rem;
          color: #5A1F1A;
          line-height: 1.15;
        }
        .hero-stamp-meta {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 500;
          color: rgba(90,31,26,0.65);
          font-variant-numeric: tabular-nums;
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
          font-style: italic;
          font-weight: 500;
          font-size: 0.95rem;
          color: rgba(90,31,26,0.75);
          letter-spacing: -0.01em;
        }
        .hero-cap-meta {
          font-size: 0.78rem;
          font-weight: 500;
          color: rgba(90,31,26,0.5);
          text-align: right;
        }

        /* Stickers flotantes — anclados a .hero-figure (relative).
           El frame tiene overflow:hidden así que los stickers viven AFUERA. */
        .hero-figure { position: relative; }
        .hero-sticker {
          position: absolute;
          z-index: 5;
        }
        .hero-sticker-1 { top: -16px; right: -10px; }
        .hero-sticker-2 { top: 42%; left: -16px; }
        .hero-sticker-3 { bottom: 56px; right: -8px; }
        @media (min-width: 900px) {
          .hero-sticker-1 { top: -22px; right: -28px; }
          .hero-sticker-2 { top: 44%; left: -42px; }
          .hero-sticker-3 { bottom: 70px; right: -32px; }
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
