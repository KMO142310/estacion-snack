"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { fmt } from "@/lib/cart-utils";
import { useCartStore } from "@/lib/store";
import { hapticSuccess } from "@/lib/haptics";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image_webp_url: string;
  image_url: string;
  copy: string;
  badge: string | null;
  status: string;
  occasion?: string | null;
  min_unit_kg: number;
}

interface Props {
  product: Product;
  index: number;
  onOpenSheet: () => void;
}

export default function ProductEditorial({ product, index, onOpenSheet }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const photoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.0, 1.05]);
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const isOut = product.status === "agotado";
  const isLast = product.status === "ultimo_kg";
  const dark = index % 2 !== 0;

  const handleQuickAdd = () => {
    if (isOut || justAdded) return;
    hapticSuccess();
    addItem({ kind: "product", id: product.id, qty: 1, name: product.name, pricePerUnit: product.price });
    addToast(`${product.name} · 1 kg agregado`);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <article
      ref={containerRef}
      id={`producto-${product.slug}`}
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* Foto full-bleed con parallax zoom */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          scale: photoScale,
        }}
      >
        <Image
          src={product.image_webp_url}
          alt={product.name}
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority={index < 2}
        />
      </motion.div>

      {/* Gradient overlay — oscurece la parte inferior para que el texto se lea */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: dark
            ? "linear-gradient(to bottom, rgba(90,31,26,0.1) 0%, rgba(90,31,26,0.7) 50%, rgba(90,31,26,0.95) 100%)"
            : "linear-gradient(to bottom, rgba(18,5,3,0.0) 0%, rgba(18,5,3,0.4) 40%, rgba(18,5,3,0.85) 100%)",
        }}
      />

      {/* Badge */}
      {(product.badge || isLast) && (
        <span
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            background: isLast ? "rgba(90,31,26,0.85)" : "rgba(208,85,31,0.9)",
            color: "#F4EADB",
            fontSize: "0.75rem",
            fontWeight: 700,
            fontFamily: "var(--font-body)",
            padding: "6px 14px",
            borderRadius: "8px",
            backdropFilter: "blur(8px)",
            zIndex: 5,
          }}
        >
          {product.badge || "Último kg"}
        </span>
      )}

      {/* Contenido sobre la foto */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        style={{
          position: "relative",
          zIndex: 10,
          padding: "0 1.5rem 3rem",
          paddingBottom: "calc(3rem + env(safe-area-inset-bottom, 0px))",
          maxWidth: 600,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(244,234,219,0.55)",
            marginBottom: "0.625rem",
          }}
        >
          {fmt(product.price)} / kg
        </p>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(2.5rem, 10vw, 4.5rem)",
            color: "#F4EADB",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            marginBottom: "0.875rem",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}
        >
          {product.name}
        </h2>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            color: "rgba(244,234,219,0.78)",
            lineHeight: 1.6,
            marginBottom: product.occasion ? "0.5rem" : "1.5rem",
            maxWidth: 380,
          }}
        >
          {product.copy}
        </p>

        {product.occasion && (
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "0.9375rem",
              color: "#D0551F",
              marginBottom: "1.5rem",
              textShadow: "0 1px 8px rgba(0,0,0,0.2)",
            }}
          >
            {product.occasion}
          </p>
        )}

        <div style={{ display: "flex", gap: "0.875rem", alignItems: "center", flexWrap: "wrap" }}>
          <motion.button
            onClick={handleQuickAdd}
            disabled={isOut}
            whileTap={isOut ? undefined : { scale: 0.93 }}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "0.9375rem",
              color: justAdded ? "#F4EADB" : "#5A1F1A",
              background: justAdded ? "#5E6B3E" : "#F4EADB",
              border: "none",
              borderRadius: "10px",
              padding: "0.9375rem 1.75rem",
              cursor: isOut ? "not-allowed" : "pointer",
              opacity: isOut ? 0.5 : 1,
              WebkitTapHighlightColor: "transparent",
              minWidth: 155,
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            <AnimatePresence mode="wait">
              {isOut ? (
                <span>Agotado</span>
              ) : justAdded ? (
                <motion.span key="ok" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                  Agregado
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Agregar 1 kg
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {!isOut && (
            <button
              onClick={onOpenSheet}
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: "0.875rem",
                color: "rgba(244,234,219,0.75)",
                background: "none",
                border: "1px solid rgba(244,234,219,0.3)",
                borderRadius: "10px",
                padding: "0.8125rem 1.25rem",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
                backdropFilter: "blur(4px)",
              }}
            >
              Otra cantidad
            </button>
          )}
        </div>
      </motion.div>
    </article>
  );
}
