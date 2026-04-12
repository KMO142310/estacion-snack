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
      onClick={agotado ? undefined : onOpen}
      role={agotado ? undefined : "button"}
      tabIndex={agotado ? undefined : 0}
      aria-label={agotado ? `${name} — agotado` : `Ver ${name}`}
      onKeyDown={(e) => { if (!agotado && (e.key === "Enter" || e.key === " ")) onOpen(); }}
      style={{
        background: "#fff",
        borderRadius: "20px",
        overflow: "hidden",
        cursor: agotado ? "default" : "pointer",
        opacity: agotado ? 0.5 : 1,
        WebkitTapHighlightColor: "transparent",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      className={agotado ? undefined : "product-card"}
    >
      {/* Foto */}
      <div style={{
        position: "relative",
        aspectRatio: "1 / 1",
        background: "#EDE4D6",
      }}>
        <Image
          src={image_webp_url}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, 280px"
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0VERTRENiI+PC9yZWN0Pjwvc3ZnPg=="
        />
        {(badge || ultimoKg) && (
          <span style={{
            position: "absolute", top: 10, left: 10,
            background: ultimoKg ? "#5A1F1A" : "rgba(208,85,31,0.92)",
            color: "#F4EADB", fontSize: "0.625rem", fontWeight: 700,
            fontFamily: "var(--font-body)", padding: "4px 8px",
            borderRadius: "6px", letterSpacing: "0.03em",
            textTransform: "uppercase",
          }}>
            {badge || "Último kg"}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "0.875rem 0.875rem 1.125rem" }}>
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 600,
          fontSize: "0.9375rem", color: "#5A1F1A",
          lineHeight: 1.2, marginBottom: "0.375rem",
          letterSpacing: "-0.01em",
        }}>
          {name}
        </p>
        <p className="price" style={{
          fontFamily: "var(--font-body)", fontWeight: 600,
          fontSize: "0.8125rem", color: agotado ? "#999" : "#D0551F",
        }}>
          {agotado ? "Agotado" : `${fmt(price)} /kg`}
        </p>
      </div>
    </article>
  );
}
