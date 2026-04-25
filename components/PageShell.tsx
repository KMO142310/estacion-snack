"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { useCartStore } from "@/lib/store";
import productsData from "@/data/products.json";
import { topFaqs } from "@/data/faq";
import Header from "./Header";
import Hero from "./Hero";
import ProductCard from "./ProductCard";
import PackSection from "./PackSection";
import Footer from "./Footer";
import ToastStack from "./Toast";
import TicketProgress from "./TicketProgress";
import packsData from "@/data/packs.json";
import { FREE_SHIPPING_MIN } from "@/lib/shipping";
import type { Pack, ProductStock } from "@/lib/pack-utils";

const OrderSheet = dynamic(() => import("./OrderSheet"), { ssr: false });
const ProductSheet = dynamic(() => import("./ProductSheet"), { ssr: false });
const PackSheet = dynamic(() => import("./PackSheet"), { ssr: false });

const products = productsData.slice().sort((a, b) => a.sort_order - b.sort_order);
const packs = packsData as Pack[];
const packProducts = productsData as unknown as ProductStock[];

/**
 * PageShell retail-clean (referencia: grupoalval.com).
 *
 * Flow simplificado: Header → Hero → Catálogo grid → Packs → Newsletter →
 * FAQ → CTA → Footer. Sin Marquee, sin StationManifesto, sin FounderNote,
 * sin FeaturedProduct, sin Announce — todos esos componentes existen en
 * /components pero no se renderizan; quedan disponibles si el dueño cambia
 * de dirección visual.
 */
export default function PageShell() {
  const [sheetProduct, setSheetProduct] = useState<typeof products[number] | null>(null);
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
  const closeSheet = useCallback(() => setSheetProduct(null), []);
  const closePackSheet = useCallback(() => setSheetPack(null), []);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip">Saltar al contenido</a>
      <div style={{ position: "sticky", top: 0, zIndex: 200 }}>
        <Header onOrderOpen={openOrder} />
      </div>

      <main id="main" tabIndex={-1} style={{ outline: "none" }}>
        <Hero onOrderOpen={openOrder} />

        {/* ── Catálogo completo en grid ── */}
        <section id="productos" className="rt-section">
          <div className="rt-wrap">
            <header className="rt-section-head">
              <h2 className="rt-section-title">Productos</h2>
              <p className="rt-section-sub">Seis bolsas selladas. Lo que ves es lo que hay en stock.</p>
            </header>
            <div className="rt-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={() => setSheetProduct(p)} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Packs ── */}
        <section id="packs" className="rt-section rt-section-alt">
          <div className="rt-wrap">
            <header className="rt-section-head">
              <h2 className="rt-section-title">Packs</h2>
              <p className="rt-section-sub">Dos bolsas combinadas, un poco más barato que sueltas.</p>
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

        {/* ── Newsletter (estilo retail estándar) ── */}
        <section className="rt-newsletter">
          <div className="rt-wrap" style={{ maxWidth: 560, textAlign: "center" }}>
            <h3 className="rt-newsletter-title">Avisos por WhatsApp</h3>
            <p className="rt-newsletter-sub">
              Te avisamos cuando llega producto nuevo o hay promo. Sin spam.
            </p>
            <a href="https://wa.me/56953743338?text=Hola!%20Quiero%20recibir%20avisos%20de%20Estaci%C3%B3n%20Snack" target="_blank" rel="noopener noreferrer" className="rt-newsletter-cta">
              Suscribirme por WhatsApp
            </a>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="rt-section">
          <div className="rt-wrap" style={{ maxWidth: 720 }}>
            <header className="rt-section-head">
              <h2 className="rt-section-title">Preguntas frecuentes</h2>
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

        {/* ── CTA final ── */}
        <section className="rt-cta">
          <div className="rt-wrap" style={{ maxWidth: 640, textAlign: "center" }}>
            <h2 className="rt-cta-title">¿Listo para pedir?</h2>
            <p className="rt-cta-sub">
              Te abrimos WhatsApp con el resumen del pedido. Responde una persona.
            </p>
            <button onClick={openOrder} className="rt-cta-btn">Abrir pedido</button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Sticky bar mobile */}
      {!orderOpen && !sheetProduct && !sheetPack && itemCount > 0 && (
        <button
          onClick={openOrder}
          aria-label={`Tu pedido (${itemCount} ${itemCount === 1 ? "ítem" : "ítems"})`}
          className="rt-sticky"
        >
          <span style={{ fontSize: 14, fontWeight: 600 }}>
            Tu carro · {itemCount} {itemCount === 1 ? "ítem" : "ítems"}
          </span>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Ver →</span>
        </button>
      )}

      {sheetProduct && (
        <ProductSheet product={{
          id: sheetProduct.id, slug: sheetProduct.slug, name: sheetProduct.name,
          price: sheetProduct.price, image_webp_url: sheetProduct.image_webp_url,
          image_url: sheetProduct.image_url, copy: sheetProduct.copy,
          status: sheetProduct.status, min_unit_kg: sheetProduct.min_unit_kg,
          stock_kg: sheetProduct.stock_kg,
        }} onClose={closeSheet} />
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
          padding: 3rem 0;
          background: #FAF9F7;
        }
        .rt-section-alt { background: #ffffff; }
        @media (min-width: 768px) {
          .rt-section { padding: 4.5rem 0; }
        }

        .rt-section-head {
          margin-bottom: 2rem;
          padding: 0 1rem;
        }
        @media (min-width: 768px) {
          .rt-section-head { margin-bottom: 2.5rem; padding: 0 1.5rem; }
        }
        .rt-section-title {
          font-size: clamp(1.4rem, 3vw, 1.875rem);
          font-weight: 700;
          color: #000;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .rt-section-sub {
          font-size: 0.9375rem;
          color: #555;
          margin: 0.4rem 0 0;
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

        /* Newsletter */
        .rt-newsletter {
          padding: 3rem 1rem;
          background: #000;
          color: #fff;
        }
        .rt-newsletter-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0 0 0.4rem;
        }
        .rt-newsletter-sub {
          font-size: 0.9375rem;
          color: rgba(255,255,255,0.7);
          margin: 0 0 1.5rem;
        }
        .rt-newsletter-cta {
          display: inline-flex;
          padding: 0.85rem 1.75rem;
          background: #EFD200;
          color: #000;
          font-weight: 700;
          font-size: 0.9375rem;
          border-radius: 4px;
          transition: opacity 0.15s ease;
        }
        .rt-newsletter-cta:hover { opacity: 0.85; }

        /* FAQ */
        .rt-faq-list { display: flex; flex-direction: column; }
        .rt-faq-item { border-bottom: 1px solid #e6e6e6; }
        .rt-faq-item:last-child { border-bottom: none; }
        .rt-faq-q {
          padding: 1.1rem 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: #000;
          cursor: pointer;
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .rt-faq-q::-webkit-details-marker { display: none; }
        .rt-faq-chev { color: #888; transition: transform 0.2s ease; flex-shrink: 0; }
        details[open] .rt-faq-chev { transform: rotate(180deg); }
        .rt-faq-a {
          padding: 0 0 1.1rem;
          font-size: 0.9375rem;
          color: #555;
          line-height: 1.65;
        }

        /* CTA */
        .rt-cta {
          padding: 3.5rem 1rem;
          background: #FAF9F7;
          border-top: 1px solid #e6e6e6;
        }
        .rt-cta-title {
          font-size: clamp(1.5rem, 3.5vw, 2rem);
          font-weight: 700;
          color: #000;
          margin: 0 0 0.6rem;
        }
        .rt-cta-sub {
          font-size: 0.9375rem;
          color: #555;
          margin: 0 0 1.5rem;
        }
        .rt-cta-btn {
          display: inline-flex;
          padding: 0.95rem 2rem;
          background: #000;
          color: #fff;
          font-weight: 600;
          font-size: 0.9375rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .rt-cta-btn:hover { background: #333; }

        /* Sticky bar mobile */
        .rt-sticky {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 14px 1rem;
          padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px));
          background: #000;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: none;
          cursor: pointer;
          width: 100%;
          -webkit-tap-highlight-color: transparent;
        }
        @media (min-width: 768px) { .rt-sticky { display: none !important; } }
      `}</style>
    </MotionConfig>
  );
}
