"use client";

import Image from "next/image";
import { fmt } from "@/lib/cart-utils";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  image_webp_url: string;
  image_url: string;
  badge: string | null;
  status: string;
  onOpen: () => void;
}

export default function ProductCard({ name, price, image_webp_url, badge, status, onOpen }: ProductCardProps) {
  const agotado = status === "agotado";
  const ultimoKg = status === "ultimo_kg";

  return (
    <article
      className={agotado ? undefined : "card-lift"}
      onClick={agotado ? undefined : onOpen}
      role={agotado ? undefined : "button"}
      tabIndex={agotado ? undefined : 0}
      aria-label={agotado ? `${name} — agotado` : `Ver ${name}`}
      onKeyDown={(e) => { if (!agotado && (e.key === "Enter" || e.key === " ")) onOpen(); }}
      style={{
        background: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: agotado ? "default" : "pointer",
        opacity: agotado ? 0.55 : 1,
        boxShadow: "0 2px 16px rgba(90,31,26,0.07)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "1/1", background: "#F4EADB" }}>
        <Image src={image_webp_url} alt={name} fill sizes="(max-width: 640px) 50vw, 33vw" style={{ objectFit: "cover" }}
          placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0Y0RUFEQSI+PC9yZWN0Pjwvc3ZnPg==" />
        {(badge || ultimoKg) && (
          <span style={{ position: "absolute", top: 8, left: 8, background: ultimoKg ? "#5A1F1A" : "#D0551F", color: "#F4EADB", fontSize: "0.6875rem", fontWeight: 700, fontFamily: "var(--font-body)", padding: "3px 8px", borderRadius: "6px" }}>
            {badge || "Último kg"}
          </span>
        )}
      </div>
      <div style={{ padding: "0.875rem 0.875rem 1rem" }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1rem", color: "#5A1F1A", lineHeight: 1.25, marginBottom: "0.375rem" }}>{name}</p>
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.875rem", color: "#5E6B3E" }}>
          {agotado ? "Agotado" : `${fmt(price)} / kg`}
        </p>
      </div>
    </article>
  );
}
