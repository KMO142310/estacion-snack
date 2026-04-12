"use client";

import Image from "next/image";
import { fmt } from "@/lib/cart-utils";
import { computeSavings, totalKg, getPackAvailability, type Pack, type ProductStock } from "@/lib/pack-utils";

interface Props {
  pack: Pack;
  products: ProductStock[];
  onOpen: () => void;
}

export default function PackCard({ pack, products, onOpen }: Props) {
  const { savings } = computeSavings(pack);
  const kg = totalKg(pack);
  const { units, limitingComponent } = getPackAvailability(pack, products);
  const isAgotado = units === 0;
  const isLast = units <= 2 && units > 0;

  return (
    <article
      className={isAgotado ? undefined : "card-lift"}
      onClick={isAgotado ? undefined : onOpen}
      role={isAgotado ? undefined : "button"}
      tabIndex={isAgotado ? undefined : 0}
      aria-label={isAgotado ? `${pack.name} — agotado` : `Ver ${pack.name}`}
      aria-disabled={isAgotado}
      onKeyDown={(e) => { if (!isAgotado && (e.key === "Enter" || e.key === " ")) onOpen(); }}
      style={{
        background: "#fff",
        borderRadius: "20px",
        overflow: "hidden",
        cursor: isAgotado ? "default" : "pointer",
        opacity: isAgotado ? 0.6 : 1,
        boxShadow: "0 2px 20px rgba(90,31,26,0.08)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Imagen */}
      <div
        style={{
          position: "relative",
          aspectRatio: "4/3",
          background: "#F4EADB",
          filter: isAgotado ? "grayscale(0.6)" : "none",
        }}
      >
        <Image
          src={pack.image_webp_url}
          alt={pack.name}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0Y0RUFEQSI+PC9yZWN0Pjwvc3ZnPg=="
        />

        {/* Badge estado */}
        {isAgotado ? (
          <span
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "rgba(90,31,26,0.75)",
              color: "#F4EADB",
              fontSize: "0.6875rem",
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              padding: "4px 10px",
              borderRadius: "6px",
            }}
          >
            Agotado{limitingComponent ? ` · sin ${limitingComponent}` : ""}
          </span>
        ) : isLast ? (
          <span
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "#5A1F1A",
              color: "#F4EADB",
              fontSize: "0.6875rem",
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              padding: "4px 10px",
              borderRadius: "6px",
            }}
          >
            Últimas {units} unidades
          </span>
        ) : pack.badge ? (
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
        ) : null}
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
            color: "#5E6B3E",
            lineHeight: 1.5,
            marginBottom: "0.875rem",
          }}
        >
          {pack.tagline}
        </p>

        {/* Precio + ahorro */}
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
                color: "#5E6B3E",
                marginTop: "2px",
              }}
            >
              {kg} kg en total
            </p>
          </div>
          {savings > 0 && !isAgotado && (
            <div
              style={{
                background: "#D0551F",
                color: "#F4EADB",
                padding: "5px 10px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 700, lineHeight: 1.2 }}>
                Ahorras
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, lineHeight: 1 }}>
                {fmt(savings)}
              </p>
            </div>
          )}
        </div>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: isAgotado ? "#5E6B3E" : "#D0551F",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {isAgotado ? "Momentáneamente agotado" : "Ver contenido y pedir →"}
        </p>
      </div>
    </article>
  );
}
