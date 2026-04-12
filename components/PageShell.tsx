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
        <section style={{ background: "#5A1F1A", padding: "5rem 1.5rem 2.5rem" }}>
          <div className="container">
            <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,234,219,0.3)", marginBottom: 12 }}>
              Santa Cruz · Valle de Colchagua
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(26px, 7vw, 44px)", color: "#F4EADB", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
              Frutos secos y dulces<br />por kilo.
            </h1>
          </div>
        </section>

        {/* Productos */}
        <section id="productos" style={{ background: "#F4EADB", padding: "24px 16px 16px" }}>
          <div className="container">
            <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5E6B3E", marginBottom: 16 }}>
              Nuestras mezclas
            </p>
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} id={p.id} slug={p.slug} name={p.name} price={p.price}
                  image_webp_url={p.image_webp_url} image_url={p.image_url}
                  badge={p.badge} status={p.status} onOpen={() => setSheetProduct(p)} />
              ))}
            </div>
          </div>
        </section>

        {/* Packs */}
        <PackSection />

        {/* FAQ */}
        <section style={{ background: "#F4EADB", padding: "40px 16px 32px" }}>
          <div className="container" style={{ maxWidth: 680 }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5E6B3E", marginBottom: 16 }}>
              Preguntas frecuentes
            </p>
            <FAQ />
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "#5A1F1A", padding: "48px 20px", textAlign: "center" }}>
          <div className="container">
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(22px, 5vw, 36px)", color: "#F4EADB", lineHeight: 1.15, marginBottom: 8 }}>
              ¿Querés probar?
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(244,234,219,0.45)", marginBottom: 24 }}>
              Armá tu pedido y te lo llevamos martes o viernes.
            </p>
            <button onClick={() => setOrderOpen(true)} style={{
              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 15,
              color: "#5A1F1A", background: "#F4EADB", border: "none",
              borderRadius: 30, padding: "12px 32px", cursor: "pointer",
            }}>
              Ver mi pedido
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Sticky bar mobile */}
      {!orderOpen && !sheetProduct && (
        <div className="sticky-bar" style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
          padding: "8px 16px", paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))",
          background: "rgba(90,31,26,0.97)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(244,234,219,0.6)", margin: 0 }}>
            {itemCount > 0 ? `${itemCount} ${itemCount === 1 ? "producto" : "productos"}` : "Pedido vacío"}
          </p>
          <button onClick={() => setOrderOpen(true)} style={{
            fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13,
            color: "#5A1F1A", background: "#F4EADB", border: "none",
            borderRadius: 30, padding: "8px 20px", cursor: "pointer",
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
        .container { max-width: 1100px; margin: 0 auto; }
        .product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (min-width: 640px) { .product-grid { grid-template-columns: 1fr 1fr 1fr; gap: 16px; } }
        @media (min-width: 1024px) { .product-grid { gap: 20px; } }
        .pcard { transition: transform .2s ease; }
        @media (hover:hover) { .pcard:hover { transform: translateY(-3px); } }
        @media (min-width: 768px) { .sticky-bar { display:none !important; } }
      `}</style>
    </>
  );
}
