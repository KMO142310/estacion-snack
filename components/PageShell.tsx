"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { useCartStore } from "@/lib/store";
import productsData from "@/data/products.json";
import Announce from "./Announce";
import Header from "./Header";
import Hero from "./Hero";
import Benefits from "./Benefits";
import ProductCard from "./ProductCard";
import PackSection from "./PackSection";
import ComoFunciona from "./ComoFunciona";
import FAQ from "./FAQ";
import Footer from "./Footer";
import ToastStack from "./Toast";

// Dynamic imports — sheets sólo cargan cuando el usuario interactúa.
// Reduce first-load JS bundle (framer-motion se mueve a chunk async).
const OrderSheet = dynamic(() => import("./OrderSheet"), { ssr: false });
const ProductSheet = dynamic(() => import("./ProductSheet"), { ssr: false });

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

  // Handlers memoizados — evitan reruns de useEffect en los sheets que
  // tienen `onClose` como dep (si no se memoiza, se re-attachan listeners
  // en cada render del padre).
  const openOrder = useCallback(() => setOrderOpen(true), [setOrderOpen]);
  const closeOrder = useCallback(() => setOrderOpen(false), [setOrderOpen]);
  const closeSheet = useCallback(() => setSheetProduct(null), []);

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

        {/* Entrada editorial — prólogo centrado, tipografía monumental como inicio de catálogo curado. */}
        <section style={{ background: "#F4EADB", padding: "4.5rem 20px 2rem", textAlign: "center" }}>
          <div className="container" style={{ maxWidth: 640 }}>
            <p
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(3rem, 10vw, 4.5rem)",
                fontWeight: 500,
                color: "#A8411A",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                marginBottom: "0.5rem",
              }}
            >
              Seis.
            </p>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: 11, fontWeight: 700,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: "rgba(90,31,26,0.55)",
              marginBottom: "1.5rem",
            }}>
              Ni una más
            </p>
            <p style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(1.125rem, 3vw, 1.375rem)",
              color: "#5A1F1A",
              lineHeight: 1.45,
              marginBottom: 0,
              maxWidth: 520,
              marginInline: "auto",
            }}>
              Las probamos todas hasta dejar solo las que uno se termina sin darse cuenta.
              Cada una con su ocasión.
            </p>
          </div>
        </section>

        {/* Productos — grid editorial, sin fondo de tarjeta. Respira. */}
        <section id="productos" style={{ background: "#F4EADB", padding: "1rem 16px 3.5rem" }}>
          <div className="container">
            <div className="product-grid">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} onOpen={() => setSheetProduct(p)} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Separador editorial entre las seis y los armados */}
        <div
          aria-hidden="true"
          style={{
            background: "#F4EADB",
            padding: "1rem 20px 3rem",
            textAlign: "center",
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            color: "rgba(90,31,26,0.35)",
            letterSpacing: "0.5em",
          }}
        >
          · · ·
        </div>

        {/* Packs — intro editorial corto, centrado */}
        <section style={{ background: "#fff" }}>
          <div className="container" style={{ padding: "4rem 20px 0", maxWidth: 640, textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: 11, fontWeight: 700,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: "rgba(90,31,26,0.55)",
              marginBottom: "0.75rem",
            }}>
              Tres armados
            </p>
            <p style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontStyle: "italic",
              fontSize: "clamp(1.375rem, 4vw, 1.75rem)",
              color: "#5A1F1A",
              lineHeight: 1.3,
              marginBottom: 0,
              letterSpacing: "-0.015em",
            }}>
              Si querés probar dos de una, ya los armé.
            </p>
          </div>
          <PackSection />
        </section>

        {/* Cómo funciona */}
        <ComoFunciona />

        {/* FAQ — "Lo que suelen preguntar" (voz cuaderno) */}
        <section style={{ background: "#F9F3E8", padding: "3.5rem 16px 3rem" }}>
          <div className="container" style={{ maxWidth: 680 }}>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: 11, fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#A8411A",
              marginBottom: "0.75rem",
            }}>
              Preguntas
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontStyle: "italic", fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "#5A1F1A", marginBottom: "1.5rem", lineHeight: 1.2 }}>
              Lo que me suelen preguntar.
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

        {/* CTA cierre — firma, no grito */}
        <section style={{ background: "#5A1F1A", padding: "5rem 20px", textAlign: "center" }}>
          <div className="container">
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: 11, fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "rgba(244,234,219,0.6)",
              marginBottom: "1rem",
            }}>
              Del valle a tu mesa
            </p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontStyle: "italic", fontSize: "clamp(24px, 5.5vw, 40px)", color: "#F4EADB", lineHeight: 1.15, marginBottom: 14, letterSpacing: "-0.02em" }}>
              Cuando quieras, te escribimos.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(244,234,219,0.78)", marginBottom: 24 }}>
              Martes a sábado · 19:30 a 21:00 · Santa Cruz y alrededores
            </p>
            <button onClick={openOrder} style={{
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

      {/* Sticky bar mobile — solo visible con items en carrito.
          Toda la barra es tap target (no botón duplicado que compita con el toast "Ver pedido"). */}
      {!orderOpen && !sheetProduct && itemCount > 0 && (
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
        }} onClose={closeSheet} />
      )}

      <OrderSheet open={orderOpen} onClose={closeOrder} />
      <ToastStack />

      <style>{`
        .container { max-width: 1100px; margin: 0 auto; }
        /* Grid editorial — 2col mobile, 3col tablet, 2col desktop grande (cards más anchos, estilo revista) */
        .product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 16px; }
        @media (min-width: 768px) { .product-grid { grid-template-columns: repeat(3, 1fr); gap: 48px 28px; } }
        @media (min-width: 1024px) { .product-grid { grid-template-columns: repeat(3, 1fr); gap: 64px 40px; max-width: 920px; margin: 0 auto; } }
        .pcard { transition: transform .2s ease; }
        @media (min-width: 768px) and (hover:hover) {
          .pcard:hover { transform: translateY(-2px); }
        }
        .pack-grid { display: grid; grid-template-columns: 1fr; gap: 16px; max-width: 420px; margin: 0 auto; }
        @media (min-width: 768px) { .pack-grid { grid-template-columns: repeat(3, 1fr); max-width: none; margin: 0; } }
        @media (min-width: 768px) { .sticky-bar { display:none !important; } }
        details summary::-webkit-details-marker { display: none; }
      `}</style>
    </MotionConfig>
  );
}
