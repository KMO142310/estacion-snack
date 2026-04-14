"use client";

/**
 * StampButton · CTA tipo sello de imprenta ferroviaria.
 *
 * Interacción por fase:
 *   1. Idle      → reposo.
 *   2. Hover     → lift 1px + shadow crece (anticipación).
 *   3. Pressed   → press down 2px + shadow contrae (causalidad física).
 *   4. Released  → spring back + ink-bleed overlay (confirmación).
 *
 * La fase "ink-bleed" es el momento dopaminérgico: tras soltar, un overlay
 * crema aparece brevemente desde el centro, simulando la mancha de tinta
 * del sello. Duración ~280ms, luego desaparece limpio.
 *
 * Haptics: chip (tap) + stamp (post-release) orquestados.
 *
 * Respeta `prefers-reduced-motion` — versión plana sin 3D ni ink-bleed.
 */

import { forwardRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { spring, duration } from "@/lib/motion-tokens";
import { hapticChip, hapticStamp } from "@/lib/haptics";

type Variant = "primary" | "secondary" | "onDark";
type Size = "sm" | "md" | "lg";

interface Props {
  variant?: Variant;
  size?: Size;
  /** Async-capable handler. El ink-bleed se dispara aunque el handler sea async. */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  fullWidth?: boolean;
  children: React.ReactNode;
  /** Deshabilitar ink-bleed (p.ej. cuando el CTA lleva a otra página, para no confundir). */
  noInkBleed?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
  "aria-pressed"?: boolean;
  "aria-expanded"?: boolean;
  id?: string;
}

const PALETTE: Record<Variant, {
  bg: string;
  bgHover: string;
  color: string;
  ink: string;
  shadow: string;
}> = {
  primary: {
    bg: "#A8411A",
    bgHover: "#93381A",
    color: "#F4EADB",
    ink: "rgba(244,234,219,0.45)",
    shadow: "0 1px 0 rgba(90,31,26,0.18)",
  },
  secondary: {
    bg: "#F4EADB",
    bgHover: "#EADFCC",
    color: "#5A1F1A",
    ink: "rgba(168,65,26,0.25)",
    shadow: "0 1px 0 rgba(90,31,26,0.12)",
  },
  onDark: {
    bg: "#F4EADB",
    bgHover: "#EADFCC",
    color: "#5A1F1A",
    ink: "rgba(168,65,26,0.30)",
    shadow: "0 2px 0 rgba(18,5,3,0.35)",
  },
};

const SIZING: Record<Size, { padding: string; fontSize: number; radius: number; minHeight: number }> = {
  sm: { padding: "10px 18px", fontSize: 13, radius: 10, minHeight: 44 },
  md: { padding: "14px 24px", fontSize: 15, radius: 12, minHeight: 48 },
  lg: { padding: "16px 28px", fontSize: 17, radius: 14, minHeight: 52 },
};

const StampButton = forwardRef<HTMLButtonElement, Props>(function StampButton(
  { variant = "primary", size = "md", onClick, fullWidth, children, noInkBleed, disabled, style: styleOverride, className, type = "button", id, ...ariaRest },
  ref,
) {
  const reducedMotion = useReducedMotion();
  const [pressed, setPressed] = useState(false);
  const [inkKey, setInkKey] = useState(0);
  const p = PALETTE[variant];
  const s = SIZING[size];

  const handlePointerDown = () => {
    if (disabled) return;
    setPressed(true);
    hapticChip();
  };

  const handlePointerUp = () => {
    setPressed(false);
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (!noInkBleed) setInkKey((k) => k + 1);
    hapticStamp();
    if (onClick) await onClick(e);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      id={id}
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleClick}
      className={className}
      {...ariaRest}
      // Press: -1px vertical, shadow contrae. Hover no incluido aquí: se maneja via CSS :hover.
      animate={reducedMotion ? undefined : {
        y: pressed ? 1 : 0,
        boxShadow: pressed ? "0 0 0 rgba(90,31,26,0)" : p.shadow,
      }}
      transition={spring.press}
      style={{
        position: "relative",
        width: fullWidth ? "100%" : undefined,
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: s.fontSize,
        color: p.color,
        background: p.bg,
        border: "none",
        borderRadius: s.radius,
        padding: s.padding,
        minHeight: s.minHeight,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        overflow: "hidden",
        WebkitTapHighlightColor: "transparent",
        willChange: "transform",
        // Override style propagado — permite a callers cambiar bg (p.ej. "Agregado" verde).
        ...styleOverride,
      }}
      data-variant={variant}
    >
      {/* Ink bleed overlay — aparece al click, opacity 0 → 0.6 → 0 con scale expand */}
      <AnimatePresence>
        {!reducedMotion && inkKey > 0 && !noInkBleed && (
          <motion.span
            key={inkKey}
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.4, 1.2, 1.25] }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.standard / 1000, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              background: `radial-gradient(circle at center, ${p.ink} 0%, transparent 70%)`,
              pointerEvents: "none",
              mixBlendMode: "screen",
            }}
          />
        )}
      </AnimatePresence>
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {children}
      </span>
    </motion.button>
  );
});

export default StampButton;
