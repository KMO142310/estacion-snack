"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import productsData from "@/data/products.json";

interface HeroProps {
  onOrderOpen: () => void;
}

const HERO_IMAGES = productsData.map((p) => p.image_webp_url);
const ROTATE_MS = 8000;

/**
 * Hero tipográfico. La marca ES el hero — las fotos son textura detrás.
 * Estructura editorial: ubicación / marca-monumento / verso poético / acción.
 * Inspiración: etiquetas de vino Valle de Colchagua (Lapostolle, Casa Silva),
 * Aesop Reading Room, Flamingo Estate "Newest Release" banners.
 */
export default function Hero({ onOrderOpen }: HeroProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (HERO_IMAGES.length <= 1) return;
    if (reducedMotion) return;
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, reducedMotion]);

  return (
    <section
      aria-label="Inicio"
      className="h-screen-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Fondo rotativo — textura, no protagonista */}
      <AnimatePresence initial={false}>
        <motion.div
          key={HERO_IMAGES[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0 }}
          aria-hidden="true"
        >
          <Image
            src={HERO_IMAGES[index]}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 35%" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay profundo — la marca domina, la foto insinúa */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(90,31,26,0.55) 0%, rgba(90,31,26,0.80) 100%)",
          zIndex: 1,
        }}
      />

      {/* Contenido editorial */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "2rem 1.5rem",
          width: "100%",
          maxWidth: 800,
        }}
      >
        {/* Label superior — geografía como credencial */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            color: "rgba(244,234,219,0.75)",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}
        >
          Santa Cruz · Valle de Colchagua
        </p>

        {/* Marca-monumento */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            color: "#F4EADB",
            fontWeight: 500,
            fontSize: "clamp(3.5rem, 14vw, 7.5rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            marginBottom: "0.25rem",
          }}
        >
          Estación
        </h1>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            color: "#F4EADB",
            fontWeight: 500,
            fontSize: "clamp(3.5rem, 14vw, 7.5rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            marginBottom: "1.75rem",
          }}
        >
          Snack.
        </h1>

        {/* Ornamento editorial */}
        <p
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            color: "rgba(244,234,219,0.6)",
            letterSpacing: "0.5em",
            marginBottom: "1.25rem",
          }}
        >
          · · ·
        </p>

        {/* Verso */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 400,
            color: "rgba(244,234,219,0.92)",
            fontSize: "clamp(1rem, 2.8vw, 1.375rem)",
            lineHeight: 1.4,
            marginBottom: "2.5rem",
            maxWidth: 480,
            marginInline: "auto",
          }}
        >
          Seis mezclas del valle.
          <br />
          De las que se acaban antes que la conversación.
        </p>

        {/* Acción */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <a
            href="#productos"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "0.9375rem",
              color: "#F4EADB",
              background: "#A8411A",
              border: "none",
              borderRadius: "10px",
              padding: "0.875rem 1.75rem",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
              textDecoration: "none",
            }}
          >
            Ver las seis
          </a>
          <button
            onClick={onOrderOpen}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "0.9375rem",
              color: "#F4EADB",
              background: "transparent",
              border: "1px solid rgba(244,234,219,0.35)",
              borderRadius: "10px",
              padding: "0.875rem 1.75rem",
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
