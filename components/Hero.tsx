"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import productsData from "@/data/products.json";
import { fmt } from "@/lib/cart-utils";
import KmStone from "./icons/KmStone";
import FlipBoard from "./FlipBoard";

interface HeroProps {
  onOrderOpen: () => void;
}

const lead = productsData[0]; // Mix Europeo

const BOARD_MESSAGES = [
  "SANTA CRUZ — SU CASA",
  "MARTES A SÁBADO",
  "DESPACHO LOCAL",
  "ABIERTO AHORA",
] as const;

export default function Hero({ onOrderOpen: _onOrderOpen }: HeroProps) {
  const [boardIndex, setBoardIndex] = useState(0);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      setBoardIndex((i) => (i + 1) % BOARD_MESSAGES.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      setClock(`${hh}:${mm}`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section aria-label="Inicio" className="hero">
      {/* Status bar superior tipo panel de estación */}
      <div className="hero-statusbar">
        <div className="hero-statusbar-left">
          <span className="hero-led" aria-hidden="true" />
          <span className="hero-status-text">
            <FlipBoard
              text={BOARD_MESSAGES[boardIndex]}
              fontSize={10.5}
              panelHeight={13}
              letterSpacing="0.2em"
              color="rgba(90,31,26,0.85)"
            />
          </span>
        </div>
        <div className="hero-statusbar-right">
          <span className="hero-status-ref">Ramal S.F. — Pichilemu</span>
          <span className="hero-status-sep" aria-hidden="true">·</span>
          <span className="hero-status-clock" suppressHydrationWarning>
            {clock || "—:—"}
          </span>
        </div>
      </div>

      {/* Cuerpo del Hero: composición editorial, tipografía dominante */}
      <div className="hero-stage">
        <div className="hero-type">
          <span className="hero-eyebrow" aria-hidden="true">
            <span className="hero-eyebrow-dot" /> Abierto para pedidos
          </span>

          <h1 className="hero-h1">
            <span className="hero-word hero-word-1">Compra</span>
            <span className="hero-word hero-word-italic">rico.</span>
            <span className="hero-word hero-word-2">Pide</span>
            <span className="hero-word hero-word-italic">simple.</span>
          </h1>

          <p className="hero-sub">
            Frutos secos y dulces del Valle de Colchagua, vendidos por kilo.
            <br />
            Cierre de pedido por WhatsApp — <strong>sin checkout ni tarjeta</strong>.
          </p>

          <div className="hero-ctas">
            <a href="#productos" className="hero-cta">
              Ver los 6 productos
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <span className="hero-cta-aside">
              o mirá los <a href="#packs">packs</a>
            </span>
          </div>
        </div>

        {/* Panel lateral: imagen + sello km + datos producto destacado */}
        <aside className="hero-side" aria-label="Producto destacado">
          <div className="hero-photo-wrap">
            <div className="hero-photo-tag" aria-hidden="true">
              <span className="hero-photo-tag-label">DESTACADO</span>
              <span className="hero-photo-tag-code">MIX-EU · 1 KG</span>
            </div>
            <Image
              src={lead.image_webp_url}
              alt={lead.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 42vw"
              style={{ objectFit: "cover" }}
            />
            <div className="hero-photo-gradient" aria-hidden="true" />
            <figcaption className="hero-photo-caption">
              <span className="hero-photo-name">{lead.name}</span>
              <span className="hero-photo-price">{fmt(lead.price)} <small>/kg</small></span>
            </figcaption>
          </div>

          <div className="hero-kmstone" aria-hidden="true">
            <KmStone size={72} />
          </div>
        </aside>
      </div>

      {/* Franja inferior: datos del despacho estilo pie de boleto */}
      <div className="hero-ticker" role="complementary" aria-label="Información de servicio">
        <div className="hero-ticker-item">
          <span className="hero-ticker-label">Origen</span>
          <span className="hero-ticker-value">Santa Cruz · km 35,5</span>
        </div>
        <div className="hero-ticker-sep" aria-hidden="true" />
        <div className="hero-ticker-item">
          <span className="hero-ticker-label">Destinos</span>
          <span className="hero-ticker-value">5 comunas</span>
        </div>
        <div className="hero-ticker-sep" aria-hidden="true" />
        <div className="hero-ticker-item">
          <span className="hero-ticker-label">Desde</span>
          <span className="hero-ticker-value">$5.000 / kg</span>
        </div>
        <div className="hero-ticker-sep" aria-hidden="true" />
        <div className="hero-ticker-item">
          <span className="hero-ticker-label">Envío gratis</span>
          <span className="hero-ticker-value">+$25.000</span>
        </div>
      </div>

      <style>{`
        .hero {
          position: relative;
          background:
            radial-gradient(1200px 600px at 20% 10%, rgba(168,65,26,0.08), transparent 60%),
            radial-gradient(900px 500px at 90% 90%, rgba(94,107,62,0.1), transparent 60%),
            linear-gradient(180deg, #F7F0E4 0%, #F4EADB 100%);
          padding: 0 1.25rem;
          overflow: hidden;
        }
        .hero::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(90,31,26,0.15), transparent);
          pointer-events: none;
        }

        /* Status bar */
        .hero-statusbar {
          max-width: 1280px;
          margin: 0 auto;
          padding: 12px 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px dashed rgba(90,31,26,0.18);
          font-family: var(--font-body);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(90,31,26,0.7);
        }
        .hero-statusbar-left {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .hero-led {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #5E6B3E;
          box-shadow: 0 0 0 3px rgba(94,107,62,0.15);
          animation: hero-led-pulse 2.4s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes hero-led-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-led { animation: none; }
        }
        .hero-statusbar-right {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-variant-numeric: tabular-nums;
          flex-shrink: 0;
        }
        .hero-status-ref {
          display: none;
        }
        .hero-status-sep {
          display: none;
          color: rgba(90,31,26,0.3);
        }
        .hero-status-clock {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 14px;
          letter-spacing: 0;
          color: #5A1F1A;
          text-transform: none;
        }
        @media (min-width: 768px) {
          .hero-status-ref,
          .hero-status-sep { display: inline; }
        }

        /* Stage principal */
        .hero-stage {
          max-width: 1280px;
          margin: 0 auto;
          padding: 3rem 0 4rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
          position: relative;
        }

        .hero-type {
          min-width: 0;
          position: relative;
          z-index: 2;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px 6px 10px;
          margin-bottom: 2rem;
          background: #fff;
          border: 1px solid rgba(90,31,26,0.08);
          border-radius: 999px;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #5A1F1A;
          box-shadow: 0 4px 14px -6px rgba(90,31,26,0.18);
        }
        .hero-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #5E6B3E;
          box-shadow: 0 0 0 3px rgba(94,107,62,0.2);
          animation: hero-led-pulse 2.4s ease-in-out infinite;
        }

        .hero-h1 {
          display: flex;
          flex-direction: column;
          gap: 0.02em;
          font-family: var(--font-display);
          color: #5A1F1A;
          line-height: 0.88;
          letter-spacing: -0.05em;
          margin: 0 0 2rem;
        }
        .hero-word {
          display: block;
          font-weight: 700;
          font-size: clamp(3.5rem, 16vw, 10rem);
        }
        .hero-word-italic {
          font-style: italic;
          font-weight: 400;
          color: #A8411A;
          padding-left: 0.6em;
          font-size: clamp(3.5rem, 16vw, 10rem);
        }
        .hero-word-2 { margin-top: 0.08em; }

        .hero-sub {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 300;
          font-size: clamp(1.02rem, 2.2vw, 1.3rem);
          line-height: 1.5;
          color: #5E6B3E;
          max-width: 500px;
          margin: 0 0 2rem;
        }
        .hero-sub strong {
          font-weight: 500;
          font-style: normal;
          color: #5A1F1A;
        }

        .hero-ctas {
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
          font-size: 1rem;
          color: #F4EADB;
          background: #5A1F1A;
          padding: 1.05rem 1.75rem;
          border-radius: 999px;
          box-shadow: 0 14px 32px -10px rgba(90,31,26,0.45);
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease;
          text-decoration: none;
          white-space: nowrap;
        }
        @media (hover: hover) {
          .hero-cta:hover {
            transform: translateY(-3px);
            box-shadow: 0 20px 44px -12px rgba(90,31,26,0.55);
          }
          .hero-cta:hover svg { transform: translateX(4px); }
        }
        .hero-cta svg { transition: transform 0.25s ease; }
        .hero-cta-aside {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 0.95rem;
          color: #5E6B3E;
        }
        .hero-cta-aside a {
          color: #A8411A;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        /* Panel lateral con foto */
        .hero-side {
          position: relative;
          align-self: end;
        }
        .hero-photo-wrap {
          position: relative;
          aspect-ratio: 4/5;
          border-radius: 24px;
          overflow: hidden;
          background: #EDE4D6;
          box-shadow:
            0 2px 0 rgba(90,31,26,0.06),
            0 30px 60px -24px rgba(90,31,26,0.35);
          transform: rotate(-1.2deg);
        }
        .hero-photo-tag {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 7px 12px;
          background: rgba(90,31,26,0.88);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #F4EADB;
          border-radius: 10px;
        }
        .hero-photo-tag-label {
          font-family: var(--font-body);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.2em;
        }
        .hero-photo-tag-code {
          font-family: var(--font-body);
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: rgba(244,234,219,0.7);
          font-variant-numeric: tabular-nums;
        }
        .hero-photo-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.55) 100%);
        }
        .hero-photo-caption {
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 1rem;
          color: #F4EADB;
        }
        .hero-photo-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1.2rem;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .hero-photo-price {
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: -0.01em;
          font-variant-numeric: tabular-nums;
        }
        .hero-photo-price small {
          font-weight: 400;
          opacity: 0.7;
        }

        .hero-kmstone {
          position: absolute;
          right: -14px;
          bottom: -24px;
          z-index: 4;
          transform: rotate(8deg);
          filter: drop-shadow(0 10px 20px rgba(90,31,26,0.25));
        }

        /* Ticker inferior */
        .hero-ticker {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1.4rem 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          border-top: 1px dashed rgba(90,31,26,0.2);
          align-items: center;
        }
        .hero-ticker-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }
        .hero-ticker-label {
          font-family: var(--font-body);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(90,31,26,0.55);
        }
        .hero-ticker-value {
          font-family: var(--font-display);
          font-weight: 500;
          font-size: 0.95rem;
          color: #5A1F1A;
          letter-spacing: -0.01em;
        }
        .hero-ticker-sep {
          display: none;
          width: 1px;
          height: 32px;
          background: rgba(90,31,26,0.12);
        }

        @media (min-width: 640px) {
          .hero-ticker {
            grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
            padding: 1.6rem 0;
          }
          .hero-ticker-sep { display: block; }
        }

        @media (min-width: 900px) {
          .hero {
            padding: 0 2.5rem;
          }
          .hero-stage {
            grid-template-columns: 1.15fr 0.85fr;
            gap: 4rem;
            padding: 5rem 0 5rem;
            min-height: calc(100vh - 68px - 52px);
          }
          .hero-word-italic { padding-left: 1em; }
          .hero-photo-wrap {
            transform: rotate(-1.6deg);
          }
          .hero-kmstone {
            right: -24px;
            bottom: -30px;
          }
          .hero-ticker-value { font-size: 1rem; }
        }

        @media (min-width: 1200px) {
          .hero-stage { padding: 6rem 0 6rem; }
        }
      `}</style>
    </section>
  );
}
