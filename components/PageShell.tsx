"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import productsData from "@/data/products.json";
import Header from "./Header";
import ProductEditorial from "./ProductEditorial";
import ProductSheet from "./ProductSheet";
import TextBreak from "./TextBreak";
import PackSection from "./PackSection";
import FAQ from "./FAQ";
import Footer from "./Footer";
import OrderSheet from "./OrderSheet";
import ToastStack from "./Toast";

const products = productsData
  .slice()
  .sort((a, b) => a.sort_order - b.sort_order);

const editorialOrder = [
  { type: "product" as const, index: 0 },
  { type: "break" as const, text: "Pesamos al momento.", bg: "#5A1F1A", color: "#F4EADB" },
  { type: "product" as const, index: 1 },
  { type: "product" as const, index: 2 },
  { type: "break" as const, text: "Despacho martes y viernes\nen el valle.", italic: true },
  { type: "product" as const, index: 3 },
  { type: "break" as const, text: "Sin envases.\nSolo lo que pedís.", bg: "#D0551F", color: "#F4EADB" },
  { type: "product" as const, index: 4 },
  { type: "product" as const, index: 5 },
  { type: "break" as const, text: "Santa Cruz · Peralillo\nPalmilla · Nancagua", bg: "#5A1F1A", color: "rgba(244,234,219,0.45)", italic: true },
];

export default function PageShell() {
  const [orderOpen, setOrderOpen] = useState(false);
  const [sheetProduct, setSheetProduct] = useState<typeof products[number] | null>(null);
  const itemCount = useCartStore((s) =>
    s.items.reduce((n, i) => n + (i.kind === "product" ? 1 : 1), 0)
  );

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  let productCounter = 0;

  return (
    <>
      <a href="#productos" className="skip">Saltar al contenido</a>
      <Header onOrderOpen={() => setOrderOpen(true)} />

      <main id="productos">
        {/* Apertura */}
        <div
          style={{
            background: "#5A1F1A",
            padding: "10rem 1.5rem 6rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(ellipse 80% 60% at 30% 20%, rgba(208,85,31,0.08) 0%, transparent 50%)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            style={{ position: "relative" }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(244,234,219,0.40)",
                marginBottom: "2rem",
              }}
            >
              Santa Cruz · Valle de Colchagua
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "clamp(3.5rem, 16vw, 7rem)",
                color: "#F4EADB",
                lineHeight: 0.92,
                letterSpacing: "-0.04em",
                marginBottom: "2rem",
              }}
            >
              Estación<br />Snack
            </h1>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(1rem, 3vw, 1.25rem)",
                color: "rgba(244,234,219,0.55)",
                letterSpacing: "0.01em",
              }}
            >
              Frutos secos y dulces por kilo
            </p>
          </motion.div>
        </div>

        {/* Flow editorial */}
        {editorialOrder.map((item, i) => {
          if (item.type === "break") {
            return (
              <TextBreak
                key={`break-${i}`}
                text={item.text}
                bg={item.bg}
                color={item.color}
                italic={item.italic}
              />
            );
          }

          const product = products[item.index];
          if (!product) return null;
          const pIdx = productCounter++;

          return (
            <ProductEditorial
              key={product.id}
              product={product}
              index={pIdx}
              onOpenSheet={() => setSheetProduct(product)}
            />
          );
        })}

        {/* Packs */}
        <PackSection />

        {/* FAQ inline */}
        <section
          style={{
            background: "#F4EADB",
            padding: "5rem 1.25rem 3rem",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "clamp(1.5rem, 5vw, 2rem)",
                color: "#5A1F1A",
                marginBottom: "1.5rem",
              }}
            >
              Preguntas frecuentes
            </h2>
            <FAQ />
          </div>
        </section>

        {/* CTA cierre */}
        <div
          style={{
            background: "#D0551F",
            padding: "4rem 1.25rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(1.5rem, 6vw, 2.5rem)",
              color: "#F4EADB",
              lineHeight: 1.2,
              marginBottom: "1.5rem",
            }}
          >
            ¿Te animás?
          </p>
          <button
            onClick={() => setOrderOpen(true)}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "1.0625rem",
              color: "#D0551F",
              background: "#F4EADB",
              border: "none",
              borderRadius: "12px",
              padding: "1.125rem 2rem",
              cursor: "pointer",
              boxShadow: "0 6px 24px rgba(18,5,3,0.25)",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            Pedir por WhatsApp
          </button>
        </div>
      </main>

      <Footer />

      {/* Sticky bottom bar */}
      {!orderOpen && !sheetProduct && (
        <div
          className="sticky-bottom"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: "0.625rem 1.25rem",
            paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom, 0px))",
            background: "rgba(90,31,26,0.96)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "rgba(244,234,219,0.70)",
              margin: 0,
            }}
          >
            {itemCount > 0
              ? `${itemCount} ${itemCount === 1 ? "producto" : "productos"} en tu pedido`
              : "Tu pedido está vacío"}
          </p>
          <button
            onClick={() => setOrderOpen(true)}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "#5A1F1A",
              background: "#F4EADB",
              border: "none",
              borderRadius: "8px",
              padding: "0.625rem 1.25rem",
              cursor: "pointer",
              flexShrink: 0,
              WebkitTapHighlightColor: "transparent",
            }}
          >
            Ver pedido
          </button>
        </div>
      )}

      {/* Product sheet */}
      {sheetProduct && (
        <ProductSheet
          product={{
            id: sheetProduct.id,
            slug: sheetProduct.slug,
            name: sheetProduct.name,
            price: sheetProduct.price,
            image_webp_url: sheetProduct.image_webp_url,
            image_url: sheetProduct.image_url,
            copy: sheetProduct.copy,
            status: sheetProduct.status,
            min_unit_kg: sheetProduct.min_unit_kg,
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
