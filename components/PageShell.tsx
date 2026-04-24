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
import Marquee from "./Marquee";
import StationManifesto from "./StationManifesto";
import FeaturedProduct from "./FeaturedProduct";
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
const featured = products[0]; // Mix Europeo — va a la sección FeaturedProduct
const gridProducts = products.slice(1); // El resto al grid "Lo más pedido"
const packs = packsData as Pack[];
const packProducts = productsData as unknown as ProductStock[];

const MARQUEE_TOP = [
  "Desde 1 kilo",
  "Despacho local",
  "Martes a sábado",
  "Envío gratis +$25.000",
  "Pago al recibir o transferencia",
  "Santa Cruz · Colchagua",
];

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

        {/* Banda ferroviaria: scroll infinito con trust signals */}
        <Marquee items={MARQUEE_TOP} speed={45} />

        {/* Producto destacado — layout editorial, NO card del grid */}
        {featured && (
          <FeaturedProduct
            product={featured}
            onOpen={() => setSheetProduct(featured)}
          />
        )}

        {/* ── Resto del catálogo ── */}
        <section id="productos" className="s-white">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="kicker">Catálogo</p>
                <h2 className="stitle">El resto de la tienda.</h2>
              </div>
              <p className="section-aside">
                {gridProducts.length} productos · por kilo · con stock real en la DB
              </p>
            </div>
            <div className="product-grid" style={{ marginTop: "2.5rem" }}>
              {gridProducts.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={() => setSheetProduct(p)} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Packs ── */}
        <section id="packs" className="s-warm">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="kicker">Packs</p>
                <h2 className="stitle">Armados para probar variedad.</h2>
              </div>
              <p className="section-aside">
                Calculados contra stock real de cada componente
              </p>
            </div>
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

        {/* ── Manifiesto de marca ferroviario ── */}
        <StationManifesto />

        {/* ── TrustBar al final como sello resumen ── */}
        <Benefits />

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
            <p className="cta-kicker">Siguiente paso</p>
            <h2 className="cta-h2">
              Cuando ya elegiste, <em>seguimos por WhatsApp</em>.
            </h2>
            <p className="cta-sub">
              Santa Cruz y alrededores · martes a sábado · pago al recibir o por transferencia.
            </p>
            <button onClick={openOrder} className="cta-btn">
              Abrir pedido
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
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
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-body);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #A8411A;
          margin-bottom: 0.9rem;
        }
        .kicker::before {
          content: "";
          display: inline-block;
          width: 18px;
          height: 1px;
          background: currentColor;
          opacity: 0.55;
        }
        .stitle {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(2.2rem, 6vw, 4rem);
          line-height: 0.98;
          letter-spacing: -0.04em;
          color: #5A1F1A;
          margin: 0;
        }
        .stitle em {
          font-style: italic;
          font-weight: 400;
          color: #A8411A;
        }
        .section-head {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 0.5rem;
          align-items: flex-start;
        }
        .section-aside {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 300;
          font-size: 0.95rem;
          color: #5E6B3E;
          margin: 0;
          max-width: 320px;
        }
        @media (min-width: 768px) {
          .section-head {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
            gap: 2rem;
          }
          .section-aside { text-align: right; padding-bottom: 0.5rem; }
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
          position: relative;
          overflow: hidden;
        }
        .cta-final::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(600px 300px at 20% 20%, rgba(168,65,26,0.2), transparent 60%),
            radial-gradient(800px 400px at 90% 100%, rgba(94,107,62,0.15), transparent 60%);
          pointer-events: none;
        }
        .cta-final > * { position: relative; }
        @media (min-width: 768px) { .cta-final { padding: 8rem 2.5rem; } }
        .cta-kicker {
          font-family: var(--font-body);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(244,234,219,0.55);
          margin-bottom: 1.25rem;
        }
        .cta-h2 {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(2rem, 6vw, 3.75rem);
          line-height: 1;
          letter-spacing: -0.035em;
          color: #F4EADB;
          margin: 0 0 1.25rem;
        }
        .cta-h2 em {
          font-style: italic;
          font-weight: 400;
          color: #E8B87D;
        }
        .cta-sub {
          font-family: var(--font-body);
          font-size: 0.9375rem;
          color: rgba(244,234,219,0.65);
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 1rem;
          color: #5A1F1A;
          background: #F4EADB;
          border: none;
          border-radius: 999px;
          padding: 1.05rem 2rem;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease;
          -webkit-tap-highlight-color: transparent;
          box-shadow: 0 14px 32px -10px rgba(0,0,0,0.35);
        }
        .cta-btn svg { transition: transform 0.25s ease; }
        @media (hover: hover) {
          .cta-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 20px 44px -12px rgba(0,0,0,0.45);
          }
          .cta-btn:hover svg { transform: translateX(4px); }
        }

        @media (min-width: 768px) { .sticky-bar { display: none !important; } }
      `}</style>
    </MotionConfig>
  );
}
