"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
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
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const isOut = product.status === "agotado";
  const isLast = product.status === "ultimo_kg";
  const dark = index % 2 !== 0;

  const bg = dark ? "#5A1F1A" : "#F4EADB";
  const text1 = dark ? "#F4EADB" : "#5A1F1A";
  const text2 = dark ? "rgba(244,234,219,0.55)" : "#5E6B3E";
  const btnBg = dark ? "#F4EADB" : "#D0551F";
  const btnText = dark ? "#5A1F1A" : "#F4EADB";

  const handleAdd = () => {
    if (isOut || justAdded) return;
    hapticSuccess();
    addItem({ kind: "product", id: product.id, qty: 1, name: product.name, pricePerUnit: product.price });
    addToast(`${product.name} · 1 kg`);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article style={{ background: bg }}>
      {/* Foto — tap abre detalle para elegir cantidad */}
      <div
        onClick={isOut ? undefined : onOpenSheet}
        role={isOut ? undefined : "button"}
        tabIndex={isOut ? undefined : 0}
        aria-label={`${product.name} — ver detalle`}
        onKeyDown={(e) => { if (!isOut && (e.key === "Enter" || e.key === " ")) onOpenSheet(); }}
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          cursor: isOut ? "default" : "pointer",
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
        {(product.badge || isLast) && (
          <span style={{
            position: "absolute", top: 14, left: 14,
            background: isLast ? "rgba(90,31,26,0.9)" : "rgba(208,85,31,0.9)",
            color: "#F4EADB", fontSize: "0.6875rem", fontWeight: 700,
            fontFamily: "var(--font-body)", padding: "4px 10px", borderRadius: "6px",
          }}>
            {product.badge || "Último kg"}
          </span>
        )}
      </div>

      {/* Nombre + precio + botón — una sola línea de acción */}
      <div style={{ padding: "1.25rem 1.25rem 2rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 600,
              fontSize: "1.375rem", color: text1, lineHeight: 1.15,
              marginBottom: "0.25rem",
            }}>
              {product.name}
            </h2>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "0.8125rem",
              color: text2,
            }}>
              {fmt(product.price)} /kg
            </p>
          </div>

          {/* Un solo botón */}
          <motion.button
            onClick={handleAdd}
            disabled={isOut}
            whileTap={isOut ? undefined : { scale: 0.93 }}
            style={{
              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.8125rem",
              color: justAdded ? "#F4EADB" : btnText,
              background: justAdded ? "#5E6B3E" : btnBg,
              border: "none", borderRadius: "10px",
              padding: "0.6875rem 1.125rem",
              cursor: isOut ? "not-allowed" : "pointer",
              opacity: isOut ? 0.5 : 1,
              WebkitTapHighlightColor: "transparent",
              flexShrink: 0, whiteSpace: "nowrap",
              transition: "background 0.2s ease",
            }}
          >
            <AnimatePresence mode="wait">
              {isOut ? <span>Agotado</span> : justAdded ? (
                <motion.span key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Listo</motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>+ 1 kg</motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </article>
  );
}
