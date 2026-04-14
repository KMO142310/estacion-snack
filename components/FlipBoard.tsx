"use client";

/**
 * FlipBoard · Tablero de salidas Solari auténtico.
 *
 * Cada caracter vive en su propio "panel" que rota 3D cuando cambia.
 * Inspirado en los tableros Solari di Udine (1956) que usaban paneles
 * físicos cayendo por gravedad — signature visual de estaciones de tren
 * europeas y terminales aeroportuarias pre-digital.
 *
 * Características:
 * - Rotación 3D real (perspective + transform-style preserve-3d)
 * - Stagger entre caracteres (feel secuencial, no simultáneo)
 * - Respeta prefers-reduced-motion → fade simple como fallback
 * - Ancho fijo por caracter (monospace-like layout sin font monospace)
 *
 * Ref: https://en.wikipedia.org/wiki/Split-flap_display
 */

import { useMemo } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { spring, stagger } from "@/lib/motion-tokens";

interface Props {
  text: string;
  /** Alto de cada panel en px. Default 14 (11px text + padding). */
  panelHeight?: number;
  /** Ancho de cada panel en px. Default auto según font-size. */
  panelWidth?: number;
  /** Color del texto. */
  color?: string;
  /** Tamaño de fuente. */
  fontSize?: number;
  /** letter-spacing. */
  letterSpacing?: string;
  /** Preservar case o forzar uppercase. */
  uppercase?: boolean;
  /** Font family CSS variable. */
  fontFamily?: string;
  /** Peso tipográfico. */
  fontWeight?: number;
  /** Clase opcional. */
  className?: string;
  /** aria-label para accesibilidad (el screen reader lee esto, no los paneles). */
  ariaLabel?: string;
}

export default function FlipBoard({
  text,
  panelHeight = 18,
  color = "currentColor",
  fontSize = 11,
  letterSpacing = "0.04em",
  uppercase = true,
  fontFamily = "var(--font-body)",
  fontWeight = 600,
  className,
  ariaLabel,
}: Props) {
  const reducedMotion = useReducedMotion();
  const display = uppercase ? text.toUpperCase() : text;
  // Split manteniendo grafemas multi-byte (emojis, acentos combinados).
  // Array.from es segura para texto latino + español.
  const chars = useMemo(() => Array.from(display), [display]);

  return (
    <span
      role="text"
      aria-label={ariaLabel ?? text}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        perspective: 200,
        fontFamily,
        fontWeight,
        fontSize,
        letterSpacing,
        color,
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1,
      }}
    >
      {chars.map((ch, i) => (
        <FlipPanel
          key={i}
          char={ch}
          index={i}
          panelHeight={panelHeight}
          reducedMotion={!!reducedMotion}
        />
      ))}
    </span>
  );
}

function FlipPanel({
  char,
  index,
  panelHeight,
  reducedMotion,
}: {
  char: string;
  index: number;
  panelHeight: number;
  reducedMotion: boolean;
}) {
  // Width por caracter: espacios más angostos, resto según fontSize aprox.
  const isSpace = char === " ";
  const isNarrow = /[.,·]/.test(char);
  // Using em scale so it adapts to font-size variations.
  const widthEm = isSpace ? 0.4 : isNarrow ? 0.35 : 0.62;

  return (
    <span
      aria-hidden="true"
      style={{
        position: "relative",
        display: "inline-block",
        width: `${widthEm}em`,
        height: panelHeight,
        overflow: "hidden",
        transformStyle: "preserve-3d",
        textAlign: "center",
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          initial={reducedMotion ? { opacity: 0 } : { rotateX: -90, opacity: 0 }}
          animate={reducedMotion ? { opacity: 1 } : { rotateX: 0, opacity: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { rotateX: 90, opacity: 0 }}
          transition={{
            ...spring.flip,
            delay: reducedMotion ? 0 : index * stagger.chars,
          }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transformOrigin: "center center",
            backfaceVisibility: "hidden",
            willChange: "transform",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
