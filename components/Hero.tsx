"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import productsData from "@/data/products.json";

interface HeroProps {
  onOrderOpen: () => void;
}

const HERO_IMAGES = productsData.map((p) => p.image_webp_url);
// 8s + pause on hover + respeta prefers-reduced-motion.
// Fuente: NN/g "Auto-Forwarding Carousels Annoy Users" recomienda ≥6-8s
// y detener al interactuar para accesibilidad motora.
const ROTATE_MS = 8000;

export default function Hero({ onOrderOpen }: HeroProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (HERO_IMAGES.length <= 1) return;
    if (reducedMotion) return; // respeta preferencia del sistema
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, reducedMotion]);

  return (
    <section
      aria-label="Inicio"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      style={{
        position: "relative",
        minHeight: "65svh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* Fondo rotativo — imágenes de productos con crossfade */}
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

      {/* Overlay degradado — texto legible abajo */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(90,31,26,0.15) 0%, rgba(90,31,26,0.55) 40%, rgba(90,31,26,0.92) 75%, rgba(90,31,26,0.98) 100%)",
          zIndex: 1,
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
            color: "rgba(244,234,219,0.82)",
            fontSize: "1rem",
            lineHeight: 1.55,
            marginBottom: "1.5rem",
            maxWidth: 320,
          }}
        >
          De los que se acaban antes
          <br />
          que la conversación.
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
              // Elite: sin sombra de color. Ref Byredo, Flamingo Estate — verified 2026-04-13.
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
