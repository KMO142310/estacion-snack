"use client";

import Image from "next/image";

interface HeroProps {
  onOrderOpen: () => void;
}

export default function Hero({ onOrderOpen }: HeroProps) {
  return (
    <section
      aria-label="Inicio"
      style={{
        position: "relative",
        minHeight: "65svh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* Foto de producto como fondo */}
      <Image
        src="/img/mix-europeo-x-kilo.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center 35%" }}
        aria-hidden="true"
      />

      {/* Overlay degradado — deja ver la foto arriba, oscurece abajo para leer el texto */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(90,31,26,0.15) 0%, rgba(90,31,26,0.55) 40%, rgba(90,31,26,0.92) 75%, rgba(90,31,26,0.98) 100%)",
        }}
      />

      {/* Contenido */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "0 1.5rem 2rem",
          paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            color: "rgba(244,234,219,0.6)",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}
        >
          Santa Cruz · Valle de Colchagua
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            color: "#F4EADB",
            fontWeight: 600,
            fontSize: "clamp(2.25rem, 10vw, 4rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.025em",
            marginBottom: "0.875rem",
          }}
        >
          Frutos secos
          <br />
          del valle.
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            color: "rgba(244,234,219,0.75)",
            fontSize: "0.9375rem",
            lineHeight: 1.5,
            marginBottom: "1.5rem",
            maxWidth: 320,
          }}
        >
          Por kilo, sin envases de más.
          <br />
          Despacho martes a sábado.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a
            href="#productos"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "0.9375rem",
              color: "#F4EADB",
              background: "#D0551F",
              border: "none",
              borderRadius: "10px",
              padding: "0.875rem 1.5rem",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(208,85,31,0.4)",
              WebkitTapHighlightColor: "transparent",
              textDecoration: "none",
            }}
          >
            Ver las mezclas
          </a>
          <button
            onClick={onOrderOpen}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "0.9375rem",
              color: "rgba(244,234,219,0.8)",
              background: "rgba(244,234,219,0.1)",
              border: "1px solid rgba(244,234,219,0.2)",
              borderRadius: "10px",
              padding: "0.875rem 1.5rem",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            Pedir por WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}
