"use client";

import Image from "next/image";
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
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const isOut = product.status === "agotado";
  const isLast = product.status === "ultimo_kg";
  const align = index % 2 === 0 ? "left" : "right";

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
      style={{ background: "#F4EADB" }}
    >
      <div
        className="editorial-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          minHeight: "70svh",
        }}
        data-align={align}
      >
        {/* Foto */}
        <div
          style={{
            position: "relative",
            aspectRatio: "4/5",
            background: "#E6D4BE",
            cursor: isOut ? "default" : "pointer",
            overflow: "hidden",
          }}
          onClick={isOut ? undefined : onOpenSheet}
          role={isOut ? undefined : "button"}
          tabIndex={isOut ? undefined : 0}
          aria-label={`Ver detalles de ${product.name}`}
          onKeyDown={(e) => { if (!isOut && (e.key === "Enter" || e.key === " ")) onOpenSheet(); }}
        >
          <Image
            src={product.image_webp_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
            priority={index < 2}
          />
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
        <div
          style={{
            padding: "2.5rem 1.5rem 3rem",
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
              color: "#5E6B3E",
              marginBottom: "0.75rem",
            }}
          >
            {fmt(product.price)} / kg
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(2rem, 7vw, 3rem)",
              color: "#5A1F1A",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            {product.name}
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "#5A1F1A",
              lineHeight: 1.65,
              marginBottom: "0.5rem",
              maxWidth: 440,
              opacity: 0.8,
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
              }}
            >
              {product.occasion}
            </p>
          )}

          {!product.occasion && <div style={{ height: "1rem" }} />}

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleQuickAdd}
              disabled={isOut}
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: isOut ? "#5A1F1A80" : "#F4EADB",
                background: isOut ? "rgba(90,31,26,0.10)" : "#D0551F",
                border: "none",
                borderRadius: "10px",
                padding: "0.875rem 1.5rem",
                cursor: isOut ? "not-allowed" : "pointer",
                WebkitTapHighlightColor: "transparent",
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
                  color: "#D0551F",
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
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .editorial-grid {
            grid-template-columns: 1fr 1fr !important;
            min-height: 80svh !important;
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
