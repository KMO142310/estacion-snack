"use client";

import Image from "next/image";
import { fmt } from "@/lib/cart-utils";
import { computeSavings, totalKg, type Pack } from "@/lib/pack-utils";

interface Props {
  pack: Pack;
  onOpen: () => void;
}

export default function PackCard({ pack, onOpen }: Props) {
  const { savings } = computeSavings(pack);
  const kg = totalKg(pack);

  return (
    <article
      onClick={onOpen}
      role="button"
      tabIndex={0}
      aria-label={`Ver ${pack.name}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(); }}
      onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.985)"; }}
      onTouchEnd={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      style={{
        background: "#fff",
        borderRadius: "20px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 2px 20px rgba(90,31,26,0.08)",
        WebkitTapHighlightColor: "transparent",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(90,31,26,0.13)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 20px rgba(90,31,26,0.08)";
      }}
    >
      {/* Imagen */}
      <div style={{ position: "relative", aspectRatio: "4/3", background: "#F4EADB" }}>
        <Image
          src={pack.image_webp_url}
          alt={pack.name}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0Y0RUFEQSI+PC9yZWN0Pjwvc3ZnPg=="
        />
        {pack.badge && (
          <span
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "#D0551F",
              color: "#F4EADB",
              fontSize: "0.6875rem",
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              padding: "4px 10px",
              borderRadius: "6px",
            }}
          >
            {pack.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "1.125rem" }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "1.25rem",
            color: "#5A1F1A",
            marginBottom: "0.25rem",
          }}
        >
          {pack.name}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "#7A8457",
            lineHeight: 1.5,
            marginBottom: "0.875rem",
          }}
        >
          {pack.tagline}
        </p>

        {/* Resumen rápido */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem",
            background: "rgba(90,31,26,0.04)",
            borderRadius: "10px",
            marginBottom: "0.75rem",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.375rem",
                color: "#5A1F1A",
                lineHeight: 1,
              }}
            >
              {fmt(pack.price)}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "#7A8457",
                marginTop: "2px",
              }}
            >
              {kg} kg en total
            </p>
          </div>
          {savings > 0 && (
            <div
              style={{
                background: "#D0551F",
                color: "#F4EADB",
                padding: "5px 10px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                Ahorras
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {fmt(savings)}
              </p>
            </div>
          )}
        </div>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "#D0551F",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Ver contenido y pedir →
        </p>
      </div>
    </article>
  );
}
