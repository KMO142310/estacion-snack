"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { useCartStore } from "@/lib/store";
import productsData from "@/data/products.json";
import { topFaqs } from "@/data/faq";
import Announce from "./Announce";
import Header from "./Header";
import Hero from "./Hero";
import Benefits from "./Benefits";
import ProductCard from "./ProductCard";
import PackSection from "./PackSection";
import ComoFunciona from "./ComoFunciona";
import FounderNote from "./FounderNote";
import CierreCTA from "./CierreCTA";
import Footer from "./Footer";
import ToastStack from "./Toast";
import TicketProgress from "./TicketProgress";
import packsData from "@/data/packs.json";
import { FREE_SHIPPING_MIN } from "@/lib/shipping";
import type { Pack, ProductStock } from "@/lib/pack-utils";
import { fmt } from "@/lib/cart-utils";

const OrderSheet = dynamic(() => import("./OrderSheet"), { ssr: false });
const PackSheet = dynamic(() => import("./PackSheet"), { ssr: false });

const products = productsData.slice().sort((a, b) => a.sort_order - b.sort_order);
const packs = packsData as Pack[];
const packProducts = productsData as unknown as ProductStock[];

export default function PageShell() {
  const [sheetPack, setSheetPack] = useState<Pack | null>(null);
  const orderOpen = useCartStore((s) => s.orderOpen);
  const setOrderOpen = useCartStore((s) => s.setOrderOpen);
  const items = useCartStore((s) => s.items);
  const itemCount = items.length;

  const subtotal = items.reduce((sum, item) => {
    if (item.kind === "product") {
      const p = products.find((x) => x.id === item.id);
      return sum + (p?.price ?? 0) * item.qty;
    }
    const pk = packs.find((x) => x.id === item.id);
    return sum + (pk?.price ?? 0) * item.qty;
  }, 0);

  useEffect(() => { useCartStore.persist.rehydrate(); }, []);

  const openOrder = useCallback(() => setOrderOpen(true), [setOrderOpen]);
  const closeOrder = useCallback(() => setOrderOpen(false), [setOrderOpen]);
  const closePackSheet = useCallback(() => setSheetPack(null), []);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip">Saltar al contenido</a>
      <div style={{ position: "sticky", top: 0, zIndex: 200 }}>
        <Announce />
        <Header onOrderOpen={openOrder} />
      </div>

      <main id="main" tabIndex={-1} style={{ outline: "none" }}>
        <Hero onOrderOpen={openOrder} />
        <Benefits />

        {/* ── Catálogo completo en grid ── */}
        <section id="productos" className="rt-section">
          <div className="rt-wrap">
            <header className="rt-section-head">
              <h2 className="rt-section-title">Productos</h2>
              <p className="rt-section-sub">Bolsas selladas, stock visible y fichas claras para pedir sin dudas.</p>
            </header>
            <div className="rt-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Packs ── */}
        <section id="packs" className="rt-section rt-section-alt">
          <div className="rt-wrap">
            <header className="rt-section-head">
              <h2 className="rt-section-title">Packs</h2>
              <p className="rt-section-sub">Combinaciones armadas para pedir más fácil y ahorrar un poco frente a las bolsas sueltas.</p>
            </header>
            <PackSection />
          </div>
        </section>

        {/* ── Progreso envío gratis ── */}
        {itemCount > 0 && (
          <section className="rt-section" style={{ paddingTop: "1rem", paddingBottom: "1.5rem" }}>
            <div className="rt-wrap" style={{ maxWidth: 520 }}>
              <TicketProgress current={subtotal} threshold={FREE_SHIPPING_MIN} />
            </div>
          </section>
        )}

        <ComoFunciona />
        <FounderNote />

        {/* ── FAQ ── */}
        <section className="rt-section">
          <div className="rt-wrap" style={{ maxWidth: 720 }}>
            <header className="rt-section-head">
              <h2 className="rt-section-title">Preguntas frecuentes</h2>
              <p className="rt-section-sub">Lo importante, antes de que tengas que preguntarlo por mensaje.</p>
            </header>
            <div className="rt-faq-list">
              {topFaqs.map((item) => (
                <details key={item.q} className="rt-faq-item">
                  <summary className="rt-faq-q">
                    {item.q}
                    <svg className="rt-faq-chev" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <p className="rt-faq-a">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <CierreCTA itemCount={itemCount} onOrderOpen={openOrder} />
      </main>

      <Footer />

      {/* Sticky bar mobile */}
      {!orderOpen && !sheetPack && itemCount > 0 && (
        <div className="rt-sticky-wrap">
          <button
            type="button"
            onClick={openOrder}
            aria-label={`Tu pedido (${itemCount} ${itemCount === 1 ? "ítem" : "ítems"})`}
            className="rt-sticky"
          >
            <span className="rt-sticky-copy">
              <span className="rt-sticky-label">Mi pedido</span>
              <span className="rt-sticky-meta">
                {itemCount} {itemCount === 1 ? "ítem" : "ítems"} · {fmt(subtotal)}
              </span>
            </span>
            <span className="rt-sticky-action">Ver pedido</span>
          </button>
        </div>
      )}

      {sheetPack && (
        <PackSheet pack={sheetPack} products={packProducts} onClose={closePackSheet} />
      )}

      <OrderSheet open={orderOpen} onClose={closeOrder} />
      <ToastStack />

      <style>{`
        .rt-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        @media (min-width: 768px) { .rt-wrap { padding: 0 1.5rem; } }

        .rt-section {
          padding: 4rem 0;
          background: transparent;
          /* Anchor scroll: el sticky header no debe tapar el title.
             scroll-margin-top + scroll-padding-top en globals.css = 110px buffer. */
          scroll-margin-top: 110px;
        }
        .rt-section-alt { background: #F1ECE2; }
        @media (min-width: 768px) {
          .rt-section { padding: 6rem 0; }
        }

        .rt-section-head {
          margin-bottom: 2.5rem;
          padding: 0 1.25rem;
          text-align: center;
        }
        @media (min-width: 768px) {
          .rt-section-head { margin-bottom: 3rem; padding: 0 1.5rem; }
        }
        .rt-section-title {
          font-family: var(--font-fraunces), Georgia, serif;
          font-size: clamp(1.75rem, 4.5vw, 2.5rem);
          font-weight: 500;
          color: #1d1d1f;
          margin: 0;
          letter-spacing: -0.025em;
          line-height: 1.05;
          font-variation-settings: "opsz" 96, "SOFT" 50;
        }
        .rt-section-sub {
          font-size: 1rem;
          color: #6B6459;
          margin: 0.5rem auto 0;
          max-width: 560px;
          letter-spacing: -0.011em;
        }

        .rt-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem 1rem;
          padding: 0 1rem;
        }
        @media (min-width: 700px) {
          .rt-grid { grid-template-columns: repeat(3, 1fr); gap: 2.5rem 1.5rem; padding: 0 1.5rem; }
        }
        @media (min-width: 1100px) {
          .rt-grid { grid-template-columns: repeat(3, 1fr); gap: 3rem 2rem; }
        }

        /* FAQ */
        .rt-faq-list { display: flex; flex-direction: column; }
        .rt-faq-item { border-bottom: 1px solid rgba(26, 24, 21, 0.08); }
        .rt-faq-item:last-child { border-bottom: none; }
        .rt-faq-q {
          padding: 1.1rem 0;
          font-size: 0.95rem;
          font-weight: 500;
          color: #1d1d1f;
          cursor: pointer;
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .rt-faq-q::-webkit-details-marker { display: none; }
        .rt-faq-chev { color: #8C8579; transition: transform 0.2s ease; flex-shrink: 0; }
        details[open] .rt-faq-chev { transform: rotate(180deg); }
        .rt-faq-a {
          padding: 0 0 1.1rem;
          font-size: 0.9375rem;
          color: #6B6459;
          line-height: 1.65;
        }

        /* Sticky bar mobile */
        .rt-sticky-wrap {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 0 1rem calc(0.9rem + env(safe-area-inset-bottom, 0px));
          pointer-events: none;
        }
        .rt-sticky {
          pointer-events: auto;
          width: min(100%, 34rem);
          margin: 0 auto;
          min-height: 64px;
          padding: 0.85rem 0.9rem 0.85rem 1rem;
          background: rgba(29, 29, 31, 0.94);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          border: 1px solid rgba(244, 234, 219, 0.12);
          border-radius: 22px;
          cursor: pointer;
          box-shadow: 0 22px 40px -24px rgba(18, 18, 21, 0.72);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          -webkit-tap-highlight-color: transparent;
        }
        .rt-sticky-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
          min-width: 0;
        }
        .rt-sticky-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(244, 234, 219, 0.72);
        }
        .rt-sticky-meta {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
        }
        .rt-sticky-action {
          min-height: 40px;
          padding: 0 0.95rem;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(244, 234, 219, 0.12);
          color: #F4EADB;
          font-size: 0.8125rem;
          font-weight: 700;
          white-space: nowrap;
        }
        @media (min-width: 768px) {
          .rt-sticky-wrap { display: none !important; }
        }
      `}</style>
    </MotionConfig>
  );
}
