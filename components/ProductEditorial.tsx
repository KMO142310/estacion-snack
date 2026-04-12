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
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const photoScale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.92, 1, 1, 0.97]);
  const photoOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.4, 1, 1, 0.4]);
  const textY = useTransform(scrollYProgress, [0.1, 0.35], [30, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const isOut = product.status === "agotado";
  const isLast = product.status === "ultimo_kg";
  const dark = index % 2 !== 0;

  const bg = dark ? "#5A1F1A" : "#F4EADB";
  const text1 = dark ? "#F4EADB" : "#5A1F1A";
  const text2 = dark ? "rgba(244,234,219,0.6)" : "#5E6B3E";
  const btnBg = dark ? "#F4EADB" : "#D0551F";
  const btnText = dark ? "#5A1F1A" : "#F4EADB";

  const handleQuickAdd = () => {
    if (isOut || justAdded) return;
    hapticSuccess();
    addItem({ kind: "product", id: product.id, qty: 1, name: product.name, pricePerUnit: product.price });
    addToast(`${product.name} · 1 kg agregado`);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <article ref={sectionRef} style={{ background: bg, padding: "3rem 0 3.5rem" }}>
      {/* Foto — cuadrada (1:1), borde a borde en mobile, con scale dopamínico al scroll */}
      <motion.div
        style={{
          scale: photoScale,
          opacity: photoOpacity,
          marginBottom: "1.75rem",
        }}
      >
        <div
          onClick={isOut ? undefined : onOpenSheet}
          role={isOut ? undefined : "button"}
          tabIndex={isOut ? undefined : 0}
          aria-label={`Ver detalles de ${product.name}`}
          onKeyDown={(e) => { if (!isOut && (e.key === "Enter" || e.key === " ")) onOpenSheet(); }}
          style={{
            position: "relative",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            cursor: isOut ? "default" : "pointer",
            borderRadius: "0",
            maxWidth: 600,
            margin: "0 auto",
          }}
          className="product-photo"
        >
          <Image
            src={product.image_webp_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            style={{ objectFit: "cover" }}
            priority={index < 2}
          />
          {(product.badge || isLast) && (
            <span style={{
              position: "absolute", top: 14, left: 14, zIndex: 2,
              background: isLast ? "rgba(90,31,26,0.9)" : "rgba(208,85,31,0.9)",
              color: "#F4EADB", fontSize: "0.75rem", fontWeight: 700,
              fontFamily: "var(--font-body)", padding: "5px 12px", borderRadius: "8px",
            }}>
              {product.badge || "Último kg"}
            </span>
          )}
        </div>
      </motion.div>

      {/* Texto — aparece con slide up sutil */}
      <motion.div
        style={{ y: textY, opacity: textOpacity, padding: "0 1.5rem", maxWidth: 600, margin: "0 auto" }}
      >
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 600,
          letterSpacing: "0.18em", textTransform: "uppercase", color: text2,
          marginBottom: "0.5rem",
        }}>
          {fmt(product.price)} / kg
        </p>

        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 600,
          fontSize: "clamp(2rem, 7vw, 3rem)", color: text1,
          lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "0.625rem",
        }}>
          {product.name}
        </h2>

        <p style={{
          fontFamily: "var(--font-body)", fontSize: "1rem", color: text1,
          lineHeight: 1.65, marginBottom: product.occasion ? "0.5rem" : "1.25rem",
          maxWidth: 440, opacity: 0.75,
        }}>
          {product.copy}
        </p>

        {product.occasion && (
          <p style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: "0.9375rem", color: "#D0551F", marginBottom: "1.25rem",
          }}>
            {product.occasion}
          </p>
        )}

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <motion.button
            onClick={handleQuickAdd}
            disabled={isOut}
            whileTap={isOut ? undefined : { scale: 0.93 }}
            whileHover={isOut ? undefined : { scale: 1.02 }}
            style={{
              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9375rem",
              color: justAdded ? "#F4EADB" : btnText,
              background: justAdded ? "#5E6B3E" : btnBg,
              border: "none", borderRadius: "10px", padding: "0.875rem 1.5rem",
              cursor: isOut ? "not-allowed" : "pointer", opacity: isOut ? 0.5 : 1,
              WebkitTapHighlightColor: "transparent", minWidth: 150,
              transition: "background 0.2s ease, color 0.2s ease",
            }}
          >
            <AnimatePresence mode="wait">
              {isOut ? <span>Agotado</span> : justAdded ? (
                <motion.span key="ok" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }} transition={{ duration: 0.2 }}>
                  Agregado
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  Agregar 1 kg
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {!isOut && (
            <button onClick={onOpenSheet} style={{
              fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.875rem",
              color: dark ? "rgba(244,234,219,0.7)" : "#D0551F", background: "none",
              border: "none", cursor: "pointer", textDecoration: "underline",
              textUnderlineOffset: "3px", WebkitTapHighlightColor: "transparent",
            }}>
              Otra cantidad
            </button>
          )}
        </div>
      </motion.div>

      <style>{`
        @media (min-width: 640px) {
          .product-photo { border-radius: 16px !important; }
        }
      `}</style>
    </article>
  );
}
