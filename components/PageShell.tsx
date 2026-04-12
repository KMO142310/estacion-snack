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
        {/* Apertura corta */}
        <div style={{
          background: "#5A1F1A",
          padding: "5rem 1.25rem 2.5rem",
        }}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 600,
            fontSize: "clamp(1.75rem, 7vw, 2.75rem)", color: "#F4EADB",
            lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "0.5rem",
          }}>
            Frutos secos y dulces por kilo.
          </h1>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "0.875rem",
            color: "rgba(244,234,219,0.5)",
          }}>
            Santa Cruz · Despacho martes y viernes
          </p>
        </div>

        {/* Todos los productos visibles de una — grid 2 columnas */}
        <section id="productos" style={{ background: "#F4EADB", padding: "1.5rem 1rem 2rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            maxWidth: 700,
            margin: "0 auto",
          }}>
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                slug={p.slug}
                name={p.name}
                price={p.price}
                image_webp_url={p.image_webp_url}
                image_url={p.image_url}
                badge={p.badge}
                status={p.status}
                onOpen={() => setSheetProduct(p)}
              />
            ))}
          </div>
        </section>

        {/* Packs */}
        <PackSection />

        {/* FAQ compacto */}
        <section style={{ background: "#F4EADB", padding: "3rem 1.25rem 2.5rem" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 600,
              fontSize: "1.375rem", color: "#5A1F1A", marginBottom: "1rem",
            }}>
              Preguntas frecuentes
            </h2>
            <FAQ />
          </div>
        </section>

        {/* CTA */}
        <div style={{ background: "#D0551F", padding: "3rem 1.25rem", textAlign: "center" }}>
          <p style={{
            fontFamily: "var(--font-display)", fontWeight: 500,
            fontSize: "clamp(1.25rem, 5vw, 2rem)", color: "#F4EADB",
            lineHeight: 1.2, marginBottom: "1.25rem",
          }}>
            ¿Te animás?
          </p>
          <button onClick={() => setOrderOpen(true)} style={{
            fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1rem",
            color: "#D0551F", background: "#F4EADB", border: "none",
            borderRadius: "12px", padding: "1rem 2rem", cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          }}>
            Pedir por WhatsApp
          </button>
        </div>
      </main>

      <Footer />

      {/* Sticky bottom */}
      {!orderOpen && !sheetProduct && (
        <div className="sticky-bottom" style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
          padding: "0.625rem 1.25rem",
          paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom, 0px))",
          background: "rgba(90,31,26,0.96)", backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem",
        }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "rgba(244,234,219,0.70)", margin: 0 }}>
            {itemCount > 0 ? `${itemCount} ${itemCount === 1 ? "producto" : "productos"}` : "Pedido vacío"}
          </p>
          <button onClick={() => setOrderOpen(true)} style={{
            fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem",
            color: "#5A1F1A", background: "#F4EADB", border: "none",
            borderRadius: "8px", padding: "0.625rem 1.25rem", cursor: "pointer",
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
        @media (min-width: 768px) {
          .sticky-bottom { display: none !important; }
        }
      `}</style>
    </>
  );
}
