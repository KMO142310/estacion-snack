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
import PackCard from "./PackCard";
import PackSection from "./PackSection";
import ComoFunciona from "./ComoFunciona";
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
const nutsProducts = products.filter((p) => p.category === "frutos");
const sweetProducts = products.filter((p) => p.category === "dulces");
const packs = packsData as Pack[];
const packProducts = productsData as unknown as ProductStock[];

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
        <Announce />
        <Header onOrderOpen={openOrder} />
      </div>

      <main id="main" tabIndex={-1} style={{ outline: "none" }}>
        <Hero onOrderOpen={openOrder} />
        <Benefits />

        {/* ── Productos destacados ── */}
        <section id="productos" className="s-white">
          <div className="container">
            <p className="kicker">Selección</p>
            <h2 className="stitle">Lo más pedido.</h2>
            <div className="product-grid" style={{ marginTop: "2.5rem" }}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={() => setSheetProduct(p)} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Packs ── */}
        <section id="packs" className="s-warm">
          <div className="container">
            <p className="kicker">Packs</p>
            <h2 className="stitle">Listos para resolver rápido.</h2>
            <div style={{ marginTop: "2rem" }}>
              <PackSection />
            </div>
          </div>
        </section>

        {/* ── Progreso envío gratis ── */}
        {itemCount > 0 && (
          <section className="s-white" style={{ paddingTop: "1rem", paddingBottom: "2rem" }}>
            <div className="container" style={{ maxWidth: 520 }}>
              <TicketProgress current={subtotal} threshold={FREE_SHIPPING_MIN} />
            </div>
          </section>
        )}

        <ComoFunciona />

        {/* ── FAQ ── */}
        <section className="s-white">
          <div className="container" style={{ maxWidth: 680 }}>
            <p className="kicker">Dudas comunes</p>
            <h2 className="stitle" style={{ marginBottom: "2rem" }}>Preguntas frecuentes.</h2>
            <div className="faq-list">
              {topFaqs.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary className="faq-q">
                    {item.q}
                    <svg className="faq-chevron" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <p className="faq-a">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="cta-final">
          <div className="container" style={{ textAlign: "center", maxWidth: 640 }}>
            <h2 className="cta-h2">
              Cuando ya elegiste, seguimos por WhatsApp.
            </h2>
            <p className="cta-sub">
              Santa Cruz y alrededores · martes a sábado · pago al recibir o por transferencia.
            </p>
            <button onClick={openOrder} className="cta-btn">
              Abrir pedido
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Sticky bar mobile */}
      {!orderOpen && !sheetProduct && !sheetPack && itemCount > 0 && (
        <button
          onClick={openOrder}
          aria-label={`Ver tu pedido (${itemCount} ${itemCount === 1 ? "producto" : "productos"})`}
          className="sticky-bar"
          style={{
            position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
            padding: "14px 20px", paddingBottom: "calc(14px + env(safe-area-inset-bottom, 0px))",
            background: "rgba(90,31,26,0.97)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            border: "none", cursor: "pointer", width: "100%",
            fontFamily: "var(--font-body)", color: "#F4EADB",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            Tu pedido · {itemCount} {itemCount === 1 ? "producto" : "productos"}
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
            Ver <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>→</span>
          </span>
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
        .container { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem; }
        @media (min-width: 768px) { .container { padding: 0 2.5rem; } }

        .s-white { background: #fff; padding: 5rem 0; }
        .s-warm  { background: #F7F0E4; padding: 5rem 0; }
        @media (min-width: 768px) {
          .s-white, .s-warm { padding: 7rem 0; }
        }

        .kicker {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #A8411A;
          margin-bottom: 0.65rem;
        }
        .stitle {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(2rem, 5vw, 3rem);
          line-height: 1;
          letter-spacing: -0.035em;
          color: #5A1F1A;
        }

        .product-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem 1rem;
        }
        @media (min-width: 640px) { .product-grid { gap: 2.5rem 1.5rem; } }
        @media (min-width: 768px) { .product-grid { grid-template-columns: repeat(3, 1fr); gap: 3rem 2rem; } }

        .pack-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; max-width: 420px; margin: 0 auto; }
        @media (min-width: 768px) { .pack-grid { grid-template-columns: repeat(3, 1fr); max-width: none; margin: 0; } }

        /* FAQ */
        .faq-list { display: flex; flex-direction: column; }
        .faq-item { border-bottom: 1px solid rgba(90,31,26,0.08); }
        .faq-item:last-child { border-bottom: none; }
        .faq-q {
          padding: 1.25rem 0;
          font-family: var(--font-display);
          font-weight: 500;
          font-size: 1.05rem;
          color: #5A1F1A;
          cursor: pointer;
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .faq-q::-webkit-details-marker { display: none; }
        .faq-chevron { color: #A8411A; transition: transform 0.2s ease; flex-shrink: 0; }
        details[open] .faq-chevron { transform: rotate(180deg); }
        .faq-a {
          padding: 0 0 1.25rem;
          font-family: var(--font-body);
          font-size: 0.9375rem;
          color: #5E6B3E;
          line-height: 1.7;
        }

        /* CTA final */
        .cta-final {
          background: #5A1F1A;
          padding: 5rem 1.25rem;
        }
        @media (min-width: 768px) { .cta-final { padding: 8rem 2.5rem; } }
        .cta-h2 {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(2rem, 6vw, 3.5rem);
          line-height: 1;
          letter-spacing: -0.035em;
          color: #F4EADB;
          margin-bottom: 1.25rem;
        }
        .cta-sub {
          font-family: var(--font-body);
          font-size: 0.9375rem;
          color: rgba(244,234,219,0.65);
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }
        .cta-btn {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 1rem;
          color: #5A1F1A;
          background: #F4EADB;
          border: none;
          border-radius: 14px;
          padding: 1rem 2.5rem;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        @media (hover: hover) {
          .cta-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(244,234,219,0.2);
          }
        }

        @media (min-width: 768px) { .sticky-bar { display: none !important; } }
      `}</style>
    </MotionConfig>
  );
}
