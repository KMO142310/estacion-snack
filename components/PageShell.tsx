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

const products = productsData
  .slice()
  .sort((a, b) => a.sort_order - b.sort_order);

export default function PageShell() {
  const [orderOpen, setOrderOpen] = useState(false);
  const [sheetProduct, setSheetProduct] = useState<typeof products[number] | null>(null);
  const itemCount = useCartStore((s) => s.items.length);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <>
      <a href="#productos" className="skip">Saltar al contenido</a>
      <Header onOrderOpen={() => setOrderOpen(true)} />

      <main>
        {/* Apertura premium */}
        <div style={{
          background: "#5A1F1A",
          padding: "5.5rem 1.5rem 3.5rem",
        }}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "0.625rem", fontWeight: 600,
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "rgba(244,234,219,0.3)", marginBottom: "1.25rem",
          }}>
            Santa Cruz · Valle de Colchagua
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 600,
            fontSize: "clamp(2rem, 8vw, 3.25rem)", color: "#F4EADB",
            lineHeight: 1.05, letterSpacing: "-0.02em",
          }}>
            Frutos secos<br />y dulces por kilo.
          </h1>
        </div>

        {/* Productos */}
        <section id="productos" style={{
          background: "#F4EADB",
          padding: "1.75rem 1rem 1rem",
        }}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "0.625rem", fontWeight: 600,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#5E6B3E", marginBottom: "1rem", padding: "0 0.25rem",
          }}>
            Nuestras mezclas
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.625rem",
            maxWidth: 700,
          }}>
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id} slug={p.slug} name={p.name} price={p.price}
                image_webp_url={p.image_webp_url} image_url={p.image_url}
                badge={p.badge} status={p.status}
                onOpen={() => setSheetProduct(p)}
              />
            ))}
          </div>
        </section>

        {/* Packs */}
        <PackSection />

        {/* FAQ */}
        <section style={{ background: "#F4EADB", padding: "3rem 1.25rem 2.5rem" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "0.625rem", fontWeight: 600,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#5E6B3E", marginBottom: "1rem",
            }}>
              Preguntas frecuentes
            </p>
            <FAQ />
          </div>
        </section>

        {/* CTA cierre */}
        <div style={{
          background: "#5A1F1A",
          padding: "3.5rem 1.25rem",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "var(--font-display)", fontWeight: 500,
            fontSize: "clamp(1.25rem, 5vw, 2rem)", color: "#F4EADB",
            lineHeight: 1.2, marginBottom: "0.5rem",
          }}>
            ¿Querés probar?
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "0.8125rem",
            color: "rgba(244,234,219,0.5)", marginBottom: "1.5rem",
          }}>
            Armá tu pedido y te lo llevamos martes o viernes.
          </p>
          <button onClick={() => setOrderOpen(true)} style={{
            fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9375rem",
            color: "#5A1F1A", background: "#F4EADB", border: "none",
            borderRadius: "12px", padding: "1rem 2rem", cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          }}>
            Ver mi pedido
          </button>
        </div>
      </main>

      <Footer />

      {/* Sticky bottom */}
      {!orderOpen && !sheetProduct && (
        <div className="sticky-bottom" style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
          padding: "0.5rem 1rem",
          paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))",
          background: "rgba(90,31,26,0.97)", backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem",
        }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "rgba(244,234,219,0.6)", margin: 0 }}>
            {itemCount > 0 ? `${itemCount} ${itemCount === 1 ? "producto" : "productos"}` : "Pedido vacío"}
          </p>
          <button onClick={() => setOrderOpen(true)} style={{
            fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.8125rem",
            color: "#5A1F1A", background: "#F4EADB", border: "none",
            borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer",
            flexShrink: 0, WebkitTapHighlightColor: "transparent",
          }}>
            Ver pedido
          </button>
        </div>
      )}

      {sheetProduct && (
        <ProductSheet
          product={{
            id: sheetProduct.id, slug: sheetProduct.slug, name: sheetProduct.name,
            price: sheetProduct.price, image_webp_url: sheetProduct.image_webp_url,
            image_url: sheetProduct.image_url, copy: sheetProduct.copy,
            status: sheetProduct.status, min_unit_kg: sheetProduct.min_unit_kg,
          }}
          onClose={() => setSheetProduct(null)}
        />
      )}

      <OrderSheet open={orderOpen} onClose={() => setOrderOpen(false)} />
      <ToastStack />

      <style>{`
        .product-card { box-shadow: 0 1px 8px rgba(90,31,26,0.06); }
        @media (hover: hover) {
          .product-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(90,31,26,0.10); }
        }
        @media (min-width: 768px) {
          .sticky-bottom { display: none !important; }
        }
      `}</style>
    </>
  );
}
