"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store";
import productsData from "@/data/products.json";
import Header from "./Header";
import ProductCard from "./ProductCard";
import ProductSheet from "./ProductSheet";
import PackSection from "./PackSection";
import FAQ from "./FAQ";
import Footer from "./Footer";
import OrderSheet from "./OrderSheet";
import ToastStack from "./Toast";

const products = productsData.slice().sort((a, b) => a.sort_order - b.sort_order);

export default function PageShell() {
  const [orderOpen, setOrderOpen] = useState(false);
  const [sheetProduct, setSheetProduct] = useState<typeof products[number] | null>(null);
  const itemCount = useCartStore((s) => s.items.length);

  useEffect(() => { useCartStore.persist.rehydrate(); }, []);

  return (
    <>
      <a href="#productos" className="skip">Saltar al contenido</a>
      <Header onOrderOpen={() => setOrderOpen(true)} />

      <main>
        {/* Apertura */}
        <section style={{ background: "#5A1F1A", padding: "5.5rem 20px 3rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(244,234,219,0.3)", marginBottom: 14 }}>
            Santa Cruz · Valle de Colchagua
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(28px, 8vw, 48px)", color: "#F4EADB", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            Frutos secos<br />y dulces por kilo.
          </h1>
        </section>

        {/* Grid de productos */}
        <section id="productos" style={{ background: "#F4EADB", padding: "20px 14px 12px" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#5E6B3E", marginBottom: 12, paddingLeft: 2 }}>
            Nuestras mezclas
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 700 }}>
            {products.map((p) => (
              <ProductCard key={p.id} id={p.id} slug={p.slug} name={p.name} price={p.price}
                image_webp_url={p.image_webp_url} image_url={p.image_url}
                badge={p.badge} status={p.status} onOpen={() => setSheetProduct(p)} />
            ))}
          </div>
        </section>

        {/* Packs */}
        <PackSection />

        {/* FAQ */}
        <section style={{ background: "#F4EADB", padding: "40px 20px 32px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#5E6B3E", marginBottom: 14 }}>
              Preguntas frecuentes
            </p>
            <FAQ />
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "#5A1F1A", padding: "48px 20px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(20px, 5vw, 32px)", color: "#F4EADB", lineHeight: 1.2, marginBottom: 8 }}>
            ¿Querés probar?
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(244,234,219,0.5)", marginBottom: 20 }}>
            Armá tu pedido y te lo llevamos.
          </p>
          <button onClick={() => setOrderOpen(true)} style={{
            fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 15,
            color: "#5A1F1A", background: "#F4EADB", border: "none",
            borderRadius: 30, padding: "12px 28px", cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          }}>
            Ver mi pedido
          </button>
        </section>
      </main>

      <Footer />

      {/* Sticky bar */}
      {!orderOpen && !sheetProduct && (
        <div className="sticky-bar" style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
          padding: "8px 14px", paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))",
          background: "rgba(90,31,26,0.97)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
        }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(244,234,219,0.6)", margin: 0 }}>
            {itemCount > 0 ? `${itemCount} ${itemCount === 1 ? "producto" : "productos"}` : "Pedido vacío"}
          </p>
          <button onClick={() => setOrderOpen(true)} style={{
            fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13,
            color: "#5A1F1A", background: "#F4EADB", border: "none",
            borderRadius: 30, padding: "8px 18px", cursor: "pointer",
            flexShrink: 0, WebkitTapHighlightColor: "transparent",
          }}>
            Ver pedido
          </button>
        </div>
      )}

      {sheetProduct && (
        <ProductSheet product={{
          id: sheetProduct.id, slug: sheetProduct.slug, name: sheetProduct.name,
          price: sheetProduct.price, image_webp_url: sheetProduct.image_webp_url,
          image_url: sheetProduct.image_url, copy: sheetProduct.copy,
          status: sheetProduct.status, min_unit_kg: sheetProduct.min_unit_kg,
        }} onClose={() => setSheetProduct(null)} />
      )}

      <OrderSheet open={orderOpen} onClose={() => setOrderOpen(false)} />
      <ToastStack />

      <style>{`
        .pcard { transition: transform .2s ease; }
        @media (hover:hover) { .pcard:hover { transform: translateY(-2px); } }
        @media (min-width:768px) { .sticky-bar { display:none !important; } }
      `}</style>
    </>
  );
}
