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

// Dynamic imports — sheets sólo cargan cuando el usuario interactúa.
// Reduce first-load JS bundle (framer-motion se mueve a chunk async).
const OrderSheet = dynamic(() => import("./OrderSheet"), { ssr: false });
const ProductSheet = dynamic(() => import("./ProductSheet"), { ssr: false });
const PackSheet = dynamic(() => import("./PackSheet"), { ssr: false });

const products = productsData.slice().sort((a, b) => a.sort_order - b.sort_order);
const nutsProducts = products.filter((product) => product.category === "frutos");
const sweetProducts = products.filter((product) => product.category === "dulces");
const packs = packsData as Pack[];
const packProducts = productsData as unknown as ProductStock[];
const featuredProducts = [
  nutsProducts[0],
  sweetProducts[0],
  products.find((product) => product.slug === "almendra-entera"),
].filter((product): product is typeof products[number] => Boolean(product));

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

  // Handlers memoizados — evitan reruns de useEffect en los sheets que
  // tienen `onClose` como dep (si no se memoiza, se re-attachan listeners
  // en cada render del padre).
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

        <section id="productos" style={{ background: "#fff", padding: "1rem 16px 3rem" }}>
          <div className="container" style={{ maxWidth: 1100 }}>
            <div className="section-head">
              <div>
                <p className="section-kicker">Selección</p>
                <h2 className="section-title">Lo más pedido.</h2>
              </div>
              <div className="section-links">
                <a href="#frutos">Frutos secos</a>
                <a href="#dulces">Dulces</a>
                <a href="#packs">Packs</a>
              </div>
            </div>

            <div className="featured-grid featured-grid-home">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onOpen={() => setSheetProduct(product)} />
              ))}
              {packs[0] && (
                <PackCard
                  pack={packs[0]}
                  products={packProducts}
                  onOpen={() => setSheetPack(packs[0])}
                />
              )}
            </div>
          </div>
        </section>

        <Benefits />

        <section id="packs" style={{ background: "#F7F0E4", padding: "3.25rem 16px" }}>
          <div className="container">
            <div className="section-head" style={{ marginBottom: "1.5rem" }}>
              <div>
                <p className="section-kicker">Packs</p>
                <h2 className="section-title">Listos para resolver rápido.</h2>
              </div>
            </div>
            <PackSection />
          </div>
        </section>

        <section id="frutos" style={{ background: "#fff", padding: "3.25rem 16px" }}>
          <div className="container">
            <div className="section-head section-head-narrow">
              <div>
                <p className="section-kicker">Frutos secos</p>
                <h2 className="section-title">Para repetir sin pensarlo mucho.</h2>
              </div>
            </div>
            <div className="product-grid">
              {nutsProducts.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={() => setSheetProduct(p)} />
              ))}
            </div>
          </div>
        </section>

        <section id="dulces" style={{ background: "#F9F3E8", padding: "3.25rem 16px" }}>
          <div className="container">
            <div className="section-head section-head-narrow">
              <div>
                <p className="section-kicker">Dulces</p>
                <h2 className="section-title">Los que se acaban primero en la mesa.</h2>
              </div>
            </div>
            <div className="product-grid">
              {sweetProducts.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={() => setSheetProduct(p)} />
              ))}
            </div>
          </div>
        </section>

        {itemCount > 0 && (
          <section
            aria-label="Progreso hacia envío gratis"
            style={{ background: "#fff", padding: "0 16px 3rem" }}
          >
            <div className="container" style={{ maxWidth: 520 }}>
              <TicketProgress current={subtotal} threshold={FREE_SHIPPING_MIN} />
            </div>
          </section>
        )}

        <ComoFunciona />

        <section style={{ background: "#fff", padding: "3.5rem 16px 3rem" }}>
          <div className="container" style={{ maxWidth: 680 }}>
            <p className="section-kicker" style={{ marginBottom: "0.75rem" }}>
              Dudas comunes
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "#5A1F1A", marginBottom: "1.5rem", lineHeight: 1.2 }}>
              Todo lo importante, claro y corto.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {topFaqs.map((item) => (
                <details key={item.q} style={{
                  background: "#fff", border: "1px solid rgba(90,31,26,0.08)",
                  borderRadius: 14, overflow: "hidden",
                }}>
                  <summary style={{
                    padding: "14px 16px", fontSize: 15, fontWeight: 600,
                    fontFamily: "var(--font-body)", color: "#5A1F1A",
                    cursor: "pointer", listStyle: "none",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    {item.q}
                    <span style={{ color: "#A8411A", fontSize: 18, fontWeight: 300, flexShrink: 0, marginLeft: 8 }}>+</span>
                  </summary>
                  <p style={{
                    padding: "0 16px 14px", fontSize: 14, color: "#5E6B3E",
                    lineHeight: 1.6, fontFamily: "var(--font-body)",
                  }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: "#5A1F1A", padding: "4rem 16px" }}>
          <div className="container cta-shell">
            <div>
              <p className="section-kicker" style={{ color: "rgba(244,234,219,0.62)", marginBottom: "0.75rem" }}>
                Pedido
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(2rem, 5vw, 3rem)", color: "#F4EADB", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 12 }}>
                Cuando ya elegiste,
                seguimos por WhatsApp.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(244,234,219,0.76)", lineHeight: 1.7, maxWidth: 460 }}>
                Santa Cruz y alrededores · martes a sábado · pago al recibir o por transferencia.
              </p>
            </div>

            <div className="cta-actions">
              <button onClick={openOrder} className="cta-main-button">
                Abrir pedido
              </button>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,234,219,0.5)" }}>
                Sin registro · Sin pago online · Atención humana
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Sticky bar mobile — solo visible con items en carrito.
          Toda la barra es tap target (no botón duplicado que compita con el toast "Ver pedido"). */}
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
        .container { max-width: 1100px; margin: 0 auto; }
        .section-head { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
        .section-head-narrow { max-width: 620px; }
        .section-kicker {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #A8411A;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 600;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #5A1F1A;
        }
        .section-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }
        .section-links a {
          padding: 0.55rem 0.85rem;
          border-radius: 999px;
          border: 1px solid rgba(90,31,26,0.1);
          background: #FFF9F1;
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          color: #5A1F1A;
        }
        .featured-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 16px; align-items: start; }
        .featured-grid-home { align-items: stretch; }
        .product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 16px; }
        @media (min-width: 768px) { .featured-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 32px 22px; } }
        @media (min-width: 768px) { .product-grid { grid-template-columns: repeat(3, 1fr); gap: 48px 28px; } }
        @media (min-width: 1024px) { .product-grid { grid-template-columns: repeat(3, 1fr); gap: 64px 40px; max-width: 920px; margin: 0 auto; } }
        .cta-shell { display: grid; grid-template-columns: 1fr; gap: 1.5rem; align-items: center; }
        .cta-actions { display: flex; flex-direction: column; gap: 0.9rem; align-items: flex-start; }
        .cta-main-button {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 15px;
          color: #5A1F1A;
          background: #F4EADB;
          border: none;
          border-radius: 999px;
          padding: 14px 28px;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .pcard { transition: transform .2s ease; }
        @media (min-width: 768px) and (hover:hover) {
          .pcard:hover { transform: translateY(-2px); }
        }
        .pack-grid { display: grid; grid-template-columns: 1fr; gap: 16px; max-width: 420px; margin: 0 auto; }
        @media (min-width: 768px) { .pack-grid { grid-template-columns: repeat(3, 1fr); max-width: none; margin: 0; } }
        @media (min-width: 900px) {
          .section-head { flex-direction: row; align-items: end; justify-content: space-between; }
          .cta-shell { grid-template-columns: minmax(0, 1fr) auto; gap: 2rem; }
          .cta-actions { align-items: flex-end; }
        }
        @media (min-width: 768px) { .sticky-bar { display:none !important; } }
        details summary::-webkit-details-marker { display: none; }
      `}</style>
    </MotionConfig>
  );
}
