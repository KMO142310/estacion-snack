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
}

interface Props {
  product: Product;
  onOpen: () => void;
}

export default function ProductCard({ product, onOpen }: Props) {
  const { name, price, image_webp_url, badge, status, copy } = product;
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
        background: "#fff", borderRadius: 12, overflow: "hidden",
        cursor: agotado ? "default" : "pointer", opacity: agotado ? 0.5 : 1,
        boxShadow: "0 1px 4px rgba(90,31,26,0.06)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Foto */}
      <div style={{ position: "relative", aspectRatio: "4/5", background: "#EDE4D6" }}>
        <Image src={image_webp_url} alt={name} fill sizes="(max-width:640px) 50vw,33vw"
          style={{ objectFit: "cover" }} placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0VERTRENiI+PC9yZWN0Pjwvc3ZnPg==" />
        {(badge || ultimoKg) && (
          <span style={{
            position: "absolute", top: 8, left: 8,
            background: ultimoKg ? "#5A1F1A" : "#D0551F",
            color: "#F4EADB", fontSize: 10, fontWeight: 700,
            fontFamily: "var(--font-body)", padding: "4px 10px",
            borderRadius: 30, letterSpacing: "0.05em", textTransform: "uppercase",
          }}>
            {badge || "Último kg"}
          </span>
        )}
      </div>

      {/* Info + botón */}
      <div style={{ padding: "12px 12px 14px" }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "#5A1F1A", lineHeight: 1.2, marginBottom: 4 }}>
          {name}
        </p>
        {copy && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#5E6B3E", lineHeight: 1.4, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
            {copy}
          </p>
        )}
        <p className="price" style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 15, color: agotado ? "#aaa" : "#D0551F", marginBottom: 2 }}>
          {agotado ? "Agotado" : fmt(price)}
          {!agotado && <span style={{ fontWeight: 400, fontSize: 11, color: "#5E6B3E", marginLeft: 2 }}>/kg</span>}
        </p>
        {!agotado && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(94,107,62,0.7)", marginBottom: 10 }}>
            {fmt(Math.round(price / 10))}/100 g
          </p>
        )}
        {!agotado && (
          <button
            onClick={handleAdd}
            style={{
              width: "100%", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13,
              color: added ? "#F4EADB" : "#F4EADB",
              background: added ? "#5E6B3E" : "#D0551F",
              border: "none", borderRadius: 10, padding: "10px 0",
              cursor: "pointer", WebkitTapHighlightColor: "transparent",
              transition: "background 0.2s ease",
              minHeight: 42,
            }}
          >
            {added ? "Listo" : "Agregar 1 kg"}
          </button>
        )}
      </div>
    </article>
  );
}
