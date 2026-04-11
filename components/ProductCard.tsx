"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { fmt } from "@/lib/products";
import type { Product } from "@/lib/types";

const COLOR_MAP: Record<string, { soft: string; accent: string }> = {
  orange: { soft: "var(--orange-soft)", accent: "var(--orange)" },
  green:  { soft: "var(--green-soft)",  accent: "var(--green)"  },
  red:    { soft: "var(--red-soft)",    accent: "var(--red)"    },
  purple: { soft: "var(--purple-soft)", accent: "var(--purple)" },
  yellow: { soft: "var(--yellow-soft)", accent: "var(--yellow)" },
  sand:   { soft: "var(--sand-soft)",   accent: "var(--sand)"   },
};

const STATUS_LABEL: Record<string, string> = {
  disponible: "Disponible",
  pocas:      "Pocas unidades",
  ultimo_kg:  "Último kg",
  agotado:    "Agotado",
};

interface Props {
  product: Product;
  onCartOpen?: () => void;
}

export default function ProductCard({ product, onCartOpen }: Props) {
  const { items, addItem, updateQty } = useCart();
  const [loading, setLoading] = useState(false);
  const reduce = useReducedMotion();
  const qty = items[product.id] ?? 0;
  const colors = COLOR_MAP[product.color] ?? COLOR_MAP.orange;
  const isOut = product.status === "agotado";

  const handleAdd = async () => {
    setLoading(true);
    await addItem(product, 0.5);
    setLoading(false);
    onCartOpen?.();
  };

  const handleUpdate = async (newQty: number) => {
    setLoading(true);
    await updateQty(product, newQty);
    setLoading(false);
  };

  return (
    <motion.article
      whileHover={reduce ? {} : { y: -4, boxShadow: "0 8px 24px rgba(0,0,0,.08)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{
        borderRadius: "var(--r)",
        overflow: "hidden",
        position: "relative",
        background: "var(--bg)",
        border: "1.5px solid rgba(0,0,0,.06)",
      }}
    >
      {/* Image */}
      <Link
        href={`/producto/${product.slug}`}
        aria-label={`Ver detalle de ${product.name}`}
        style={{ display: "block" }}
      >
        <div style={{
          aspectRatio: "1/1",
          position: "relative",
          overflow: "hidden",
          background: colors.soft,
        }}>
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
          {product.badge && (
            <span style={{
              position: "absolute",
              top: 12,
              right: 12,
              fontSize: 10,
              fontWeight: 700,
              padding: "5px 12px",
              background: "var(--text)",
              color: "#fff",
              borderRadius: "var(--r-full)",
              letterSpacing: ".02em",
            }}>
              {product.badge}
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4, color: colors.accent }}>
          {product.cat_label}
        </div>
        <Link href={`/producto/${product.slug}`}>
          <h3 style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.2, marginBottom: 4 }}>
            {product.name}
          </h3>
        </Link>
        <p style={{ fontSize: 12, color: "var(--sub)", lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.copy}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-.02em" }}>{fmt(product.price)}</span>
          <span style={{ fontSize: 12, color: "var(--sub)" }}>/ kg</span>
        </div>

        {/* Stock indicator */}
        <div style={{
          fontSize: 10,
          color: isOut ? "var(--red)" : "var(--sub)",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}>
          <span style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: isOut ? "var(--red)" : colors.accent,
            flexShrink: 0,
            display: "inline-block",
          }} />
          {STATUS_LABEL[product.status]}
        </div>

        {/* CTA */}
        {qty === 0 ? (
          <button
            onClick={handleAdd}
            disabled={isOut || loading}
            style={{
              width: "100%",
              padding: 12,
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 10,
              border: "2px solid var(--text)",
              background: isOut ? "rgba(0,0,0,.06)" : "var(--text)",
              color: isOut ? "var(--sub)" : "#fff",
              cursor: isOut ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              minHeight: 44,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {isOut ? "Agotado" : "Agregar + 0.5 kg"}
          </button>
        ) : (
          <>
            <div style={{
              display: "flex",
              width: "100%",
              border: "2px solid rgba(0,0,0,.1)",
              borderRadius: 10,
              overflow: "hidden",
            }}>
              <button
                onClick={() => handleUpdate(Math.max(0, qty - 0.5))}
                disabled={loading}
                style={{ width: 44, height: 40, background: "none", color: "var(--text)", fontSize: 18, fontWeight: 600, cursor: "pointer", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                −
              </button>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, borderLeft: "2px solid rgba(0,0,0,.1)", borderRight: "2px solid rgba(0,0,0,.1)" }}>
                {qty} kg
              </div>
              <button
                onClick={() => handleUpdate(qty + 0.5)}
                disabled={loading}
                style={{ width: 44, height: 40, background: "none", color: "var(--text)", fontSize: 18, fontWeight: 600, cursor: "pointer", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                +
              </button>
            </div>
            <div style={{ textAlign: "center", marginTop: 8, fontSize: 13, fontWeight: 700, color: "var(--sub)" }}>
              Subtotal: {fmt(product.price * qty)}
            </div>
          </>
        )}
      </div>

    </motion.article>
  );
}
