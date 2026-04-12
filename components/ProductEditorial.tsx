"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
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

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function ProductEditorial({ product, index, onOpenSheet }: Props) {
  const photoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const isOut = product.status === "agotado";
  const isLast = product.status === "ultimo_kg";
  const align = index % 2 === 0 ? "left" : "right";
  const dark = index % 2 !== 0;

  const bg = dark ? "#5A1F1A" : "#F4EADB";
  const textPrimary = dark ? "#F4EADB" : "#5A1F1A";
  const textSecondary = dark ? "rgba(244,234,219,0.65)" : "#5E6B3E";
  const accentColor = dark ? "#F4EADB" : "#D0551F";
  const photoBg = dark ? "#3A1410" : "#E6D4BE";

  const handleQuickAdd = () => {
    if (isOut) return;
    hapticSuccess();
    addItem({
      kind: "product",
      id: product.id,
      qty: 1,
      name: product.name,
      pricePerUnit: product.price,
    });
    addToast(`${product.name} · 1 kg agregado`);
  };

  return (
    <article
      id={`producto-${product.slug}`}
      style={{ background: bg, overflow: "hidden" }}
    >
      <div
        className="editorial-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          minHeight: "75svh",
        }}
        data-align={align}
      >
        {/* Foto con parallax */}
        <div
          ref={photoRef}
          style={{
            position: "relative",
            aspectRatio: "4/5",
            background: photoBg,
            cursor: isOut ? "default" : "pointer",
            overflow: "hidden",
          }}
          onClick={isOut ? undefined : onOpenSheet}
          role={isOut ? undefined : "button"}
          tabIndex={isOut ? undefined : 0}
          aria-label={`Ver detalles de ${product.name}`}
          onKeyDown={(e) => { if (!isOut && (e.key === "Enter" || e.key === " ")) onOpenSheet(); }}
        >
          <motion.div style={{ y: photoY, position: "absolute", inset: "-12% 0", width: "100%", height: "124%" }}>
            <Image
              src={product.image_webp_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority={index < 2}
            />
          </motion.div>
          {(product.badge || isLast) && (
            <span
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                background: isLast ? "#5A1F1A" : "#D0551F",
                color: "#F4EADB",
                fontSize: "0.75rem",
                fontWeight: 700,
                fontFamily: "var(--font-body)",
                padding: "5px 12px",
                borderRadius: "8px",
              }}
            >
              {product.badge || "Último kg"}
            </span>
          )}
        </div>

        {/* Texto */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          style={{
            padding: "3rem 1.5rem 3.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: textSecondary,
              marginBottom: "0.75rem",
            }}
          >
            {fmt(product.price)} / kg
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(2.25rem, 8vw, 3.5rem)",
              color: textPrimary,
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              marginBottom: "1.25rem",
            }}
          >
            {product.name}
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.0625rem",
              color: textPrimary,
              lineHeight: 1.65,
              marginBottom: "0.625rem",
              maxWidth: 440,
              opacity: 0.75,
            }}
          >
            {product.copy}
          </p>

          {product.occasion && (
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "1rem",
                color: accentColor,
                marginBottom: "2rem",
              }}
            >
              {product.occasion}
            </p>
          )}

          {!product.occasion && <div style={{ height: "1.5rem" }} />}

          <div style={{ display: "flex", gap: "0.875rem", alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleQuickAdd}
              disabled={isOut}
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: dark ? "#5A1F1A" : "#F4EADB",
                background: dark ? "#F4EADB" : "#D0551F",
                border: "none",
                borderRadius: "10px",
                padding: "0.9375rem 1.75rem",
                cursor: isOut ? "not-allowed" : "pointer",
                opacity: isOut ? 0.5 : 1,
                WebkitTapHighlightColor: "transparent",
                transition: "transform 0.15s ease",
              }}
            >
              {isOut ? "Agotado" : "Agregar 1 kg"}
            </button>

            {!isOut && (
              <button
                onClick={onOpenSheet}
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: accentColor,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                Otra cantidad
              </button>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .editorial-grid {
            grid-template-columns: 1fr 1fr !important;
            min-height: 85svh !important;
          }
          .editorial-grid[data-align="right"] > div:first-child {
            order: 2;
          }
          .editorial-grid[data-align="right"] > div:last-child {
            order: 1;
          }
        }
      `}</style>
    </article>
  );
}
