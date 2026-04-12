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
      className={agotado ? undefined : "pcard"}
      style={{
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        cursor: agotado ? "default" : "pointer",
        opacity: agotado ? 0.5 : 1,
        border: "1px solid rgba(90,31,26,0.06)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Foto */}
      <div style={{ position: "relative", aspectRatio: "1/1", background: "#EDE4D6" }}>
        <Image src={image_webp_url} alt={name} fill sizes="(max-width:640px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0VERTRENiI+PC9yZWN0Pjwvc3ZnPg==" />
        {(badge || ultimoKg) && (
          <span style={{
            position: "absolute", top: 8, left: 8,
            background: ultimoKg ? "#5A1F1A" : "#D0551F",
            color: "#F4EADB", fontSize: 9, fontWeight: 700,
            fontFamily: "var(--font-body)", padding: "3px 8px",
            borderRadius: 30, letterSpacing: "0.05em", textTransform: "uppercase",
          }}>
            {badge || "Último kg"}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px 14px" }}>
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 600,
          fontSize: 15, color: "#5A1F1A", lineHeight: 1.2, marginBottom: 6,
        }}>
          {name}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p className="price" style={{
            fontFamily: "var(--font-body)", fontWeight: 700,
            fontSize: 14, color: agotado ? "#aaa" : "#D0551F", margin: 0,
          }}>
            {agotado ? "Agotado" : fmt(price)}
            {!agotado && <span style={{ fontWeight: 400, fontSize: 11, color: "#5E6B3E", marginLeft: 2 }}>/kg</span>}
          </p>
          {!agotado && (
            <span style={{
              fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500,
              color: "#D0551F", opacity: 0.7,
            }}>
              Ver →
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
