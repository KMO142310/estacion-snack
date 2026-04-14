"use client";

import { useState } from "react";
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
  badge: string | null;
  status: string;
  copy?: string;
  occasion?: string | null;
}

interface Props {
  product: Product;
  onOpen: () => void;
}

// Rediseño editorial:
// - La OCASIÓN es el hook (no la lista de ingredientes). Va en Fraunces italic
//   antes del nombre, como un "maridaje" de vino.
// - Sin box-shadow fuerte; la card respira dentro del layout sin verse como un botón.
// - Nombre con jerarquía clara, precio sobrio debajo.
// - Botón secundario visual: la tarjeta ENTERA es el tap target; el botón "Agregar" es CTA, no un "Comprar ya" gritado.
export default function ProductCard({ product, onOpen }: Props) {
  const { name, price, image_webp_url, badge, status, occasion } = product;
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const agotado = status === "agotado";
  const ultimoKg = status === "ultimo_kg";

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (agotado || added) return;
    hapticSuccess();
    addItem({ kind: "product", id: product.id, qty: 1, name, pricePerUnit: price });
    addToast(`${name} · 1 kg`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article
      onClick={agotado ? undefined : onOpen}
      role={agotado ? undefined : "button"}
      tabIndex={agotado ? undefined : 0}
      aria-label={agotado ? `${name} — agotado` : `Ver ${name}`}
      onKeyDown={(e) => { if (!agotado && (e.key === "Enter" || e.key === " ")) onOpen(); }}
      className={agotado ? undefined : "pcard"}
      style={{
        background: "transparent",
        overflow: "hidden",
        cursor: agotado ? "default" : "pointer",
        opacity: agotado ? 0.5 : 1,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Foto */}
      <div style={{ position: "relative", aspectRatio: "4/5", background: "#EDE4D6", borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
        <Image src={image_webp_url} alt="" fill sizes="(max-width:640px) 50vw,33vw"
          style={{ objectFit: "cover" }} placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0VERTRENiI+PC9yZWN0Pjwvc3ZnPg==" />
        {(badge || ultimoKg) && (
          <span style={{
            position: "absolute", top: 10, left: 10,
            background: ultimoKg ? "#5A1F1A" : "#A8411A",
            color: "#F4EADB", fontSize: 10, fontWeight: 700,
            fontFamily: "var(--font-body)", padding: "4px 10px",
            borderRadius: 30, letterSpacing: "0.05em", textTransform: "uppercase",
          }}>
            {badge || "Último kg"}
          </span>
        )}
      </div>

      {/* Info — estilo editorial */}
      <div style={{ padding: "0 2px" }}>
        {/* Ocasión como hook (como maridaje de vino) */}
        {occasion && !agotado && (
          <p style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 13,
            color: "#5E6B3E",
            lineHeight: 1.35,
            marginBottom: 6,
          }}>
            {occasion}
          </p>
        )}

        {/* Nombre */}
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 18,
          color: "#5A1F1A",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: 6,
        }}>
          {name}
        </h3>

        {/* Precio — sobrio */}
        <p className="price" style={{
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          fontSize: 14,
          color: agotado ? "#aaa" : "#5A1F1A",
          marginBottom: 12,
        }}>
          {agotado ? "Agotado" : (
            <>
              {fmt(price)}
              <span style={{ fontWeight: 400, color: "rgba(90,31,26,0.55)", marginLeft: 4 }}>· 1 kg</span>
            </>
          )}
        </p>

        {/* CTA — filled para conversión (Baymard: +15-20% CTR vs outline) */}
        {!agotado && (
          <button
            onClick={handleAdd}
            style={{
              width: "100%",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 13,
              color: "#F4EADB",
              background: added ? "#5E6B3E" : "#A8411A",
              border: "none",
              borderRadius: 10,
              padding: "10px 0",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
              transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
              transform: added ? "scale(1.03)" : "scale(1)",
              minHeight: 44,
            }}
          >
            {added ? "✓ Agregado" : "Agregar 1 kg"}
          </button>
        )}
      </div>
    </article>
  );
}
