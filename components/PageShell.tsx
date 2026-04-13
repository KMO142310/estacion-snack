"use client";

import { useState, useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { useCartStore } from "@/lib/store";
import productsData from "@/data/products.json";
import Announce from "./Announce";
import Header from "./Header";
import Hero from "./Hero";
import Benefits from "./Benefits";
import ProductCard from "./ProductCard";
import ProductSheet from "./ProductSheet";
import PackSection from "./PackSection";
import ComoFunciona from "./ComoFunciona";
import FAQ from "./FAQ";
import Footer from "./Footer";
import OrderSheet from "./OrderSheet";
import ToastStack from "./Toast";

const products = productsData.slice().sort((a, b) => a.sort_order - b.sort_order);

const TOP_FAQ = [
  { q: "¿Cómo hago mi pedido?", a: 'Elige los productos, toca "Agregar" y confirma por WhatsApp. Te respondemos y coordinamos la entrega.' },
  { q: "¿A qué comunas despachan?", a: "Marchigüe, Peralillo, Santa Cruz y Cunaco." },
  { q: "¿Cuánto cuesta el envío?", a: "Envío gratis en compras sobre $25.000. Bajo ese monto: $2.000 (Santa Cruz) o $3.000 (comunas cercanas)." },
  { q: "¿Cuál es el mínimo de compra?", a: "1 kg por producto. Puedes combinar varios." },
  { q: "¿Qué medios de pago aceptan?", a: "Transferencia bancaria o efectivo contra entrega." },
];

export default function PageShell() {
  const [sheetProduct, setSheetProduct] = useState<typeof products[number] | null>(null);
  const orderOpen = useCartStore((s) => s.orderOpen);
  const setOrderOpen = useCartStore((s) => s.setOrderOpen);
  const itemCount = useCartStore((s) => s.items.length);

  useEffect(() => { useCartStore.persist.rehydrate(); }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#productos" className="skip">Saltar al contenido</a>
      <div style={{ position: "sticky", top: 0, zIndex: 200 }}>
        <Announce />
        <Header onOrderOpen={() => setOrderOpen(true)} />
      </div>

      <main>
        <Hero onOrderOpen={() => setOrderOpen(true)} />
        <Benefits />

        {/* Productos */}
        <section id="productos" style={{ background: "#F4EADB", padding: "1.75rem 16px 3rem" }}>
          <div className="container">
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={() => setSheetProduct(p)} />
              ))}
            </div>
          </div>
        </section>

        {/* Frase con vida */}
        <div style={{ background: "#5A1F1A", padding: "3rem 1.5rem", textAlign: "center" }}>
          <p style={{
            fontFamily: "var(--font-display)", fontWeight: 600,
            fontSize: "clamp(1.375rem, 5vw, 2rem)", color: "#F4EADB",
            lineHeight: 1.2, maxWidth: 500, margin: "0 auto",
          }}>
            Seis mezclas. Las probamos todas hasta dejar solo las que uno se termina sin darse cuenta.
          </p>
        </div>

        {/* Packs */}
        <section style={{ background: "#fff" }}>
          <PackSection />
        </section>

        {/* Cómo funciona */}
        <ComoFunciona />

        {/* FAQ — solo 5 preguntas clave */}
        <section style={{ background: "#F9F3E8", padding: "3.5rem 16px 3rem" }}>
          <div className="container" style={{ maxWidth: 680 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "#5A1F1A", marginBottom: "1.5rem" }}>
              Preguntas frecuentes
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TOP_FAQ.map((item) => (
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
                    <span style={{ color: "#D0551F", fontSize: 18, fontWeight: 300, flexShrink: 0, marginLeft: 8 }}>+</span>
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

        {/* CTA cierre */}
        <section style={{ background: "#5A1F1A", padding: "4rem 20px", textAlign: "center" }}>
          <div className="container">
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(22px, 5vw, 36px)", color: "#F4EADB", lineHeight: 1.15, marginBottom: 8 }}>
              Arma tu pedido.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(244,234,219,0.45)", marginBottom: 24 }}>
              Martes a sábado · 19:30 a 21:00 · Santa Cruz y alrededores
            </p>
            <button onClick={() => setOrderOpen(true)} style={{
              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 15,
              color: "#5A1F1A", background: "#F4EADB", border: "none",
              borderRadius: 30, padding: "14px 32px", cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}>
              Pedir por WhatsApp
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Sticky bar mobile — solo visible con items en carrito */}
      {!orderOpen && !sheetProduct && itemCount > 0 && (
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
            {itemCount > 0 ? `Quiero pedir` : "Quiero pedir"}
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
        .product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (min-width: 768px) { .product-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; } }
        @media (min-width: 1024px) { .product-grid { grid-template-columns: repeat(4, 1fr); } }
        .pcard { transition: transform .2s ease; }
        @media (min-width: 768px) and (hover:hover) {
          .pcard:hover { transform: translateY(-3px); }
        }
        .pack-grid { display: grid; grid-template-columns: 1fr; gap: 16px; max-width: 420px; margin: 0 auto; }
        @media (min-width: 768px) { .pack-grid { grid-template-columns: repeat(3, 1fr); max-width: none; margin: 0; } }
        @media (min-width: 768px) { .sticky-bar { display:none !important; } }
        details summary::-webkit-details-marker { display: none; }
      `}</style>
    </MotionConfig>
  );
}
