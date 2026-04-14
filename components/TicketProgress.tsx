"use client";

/**
 * TicketProgress · boleto perforado con progreso hacia envío gratis.
 *
 * Reemplaza el progress bar genérico con un ticket ferroviario real:
 *
 *   ·  · · · · · · · · · · · · ·  ·          ← perforación superior
 *   │  Te faltan $8.500  ══════░░░  │
 *   │  para despacho sin costo      │
 *   ·  · · · · · · · · · · · · ·  ·          ← perforación inferior
 *
 * Al cruzar $25.000 (FREE_SHIPPING_MIN):
 *   - El ticket se llena 100% con terracota → crema invertido.
 *   - Stamp "VÁLIDO" aparece con ink-bleed en esquina derecha.
 *   - Copy cambia a "Boleto válido. Despacho sin costo."
 *   - hapticStamp() se dispara UNA VEZ al cruzar (no en cada render).
 *
 * Ref: Baymard "Threshold Progress Indicators" — AOV +34% promedio.
 * Ref: Solari di Udine departure boards + Italian railway ticket aesthetics.
 */

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { fmt } from "@/lib/cart-utils";
import { spring, duration } from "@/lib/motion-tokens";
import { hapticStamp } from "@/lib/haptics";

interface Props {
  /** Subtotal actual del carrito (CLP). */
  current: number;
  /** Umbral para envío gratis (CLP). */
  threshold: number;
}

export default function TicketProgress({ current, threshold }: Props) {
  const reducedMotion = useReducedMotion();
  const wasValidRef = useRef(false);
  const isValid = current >= threshold;
  const pct = Math.min(100, (current / threshold) * 100);
  const falta = threshold - current;

  // Dispara haptic una sola vez al cruzar (no en re-renders).
  useEffect(() => {
    if (isValid && !wasValidRef.current) {
      hapticStamp();
      wasValidRef.current = true;
    }
    if (!isValid) wasValidRef.current = false;
  }, [isValid]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={isValid ? "Boleto válido · despacho sin costo" : `Faltan ${fmt(falta)} para despacho sin costo`}
      style={{
        position: "relative",
        padding: "14px 16px",
        background: isValid ? "#5E6B3E" : "#fff",
        border: `1px solid ${isValid ? "#4F5A33" : "rgba(90,31,26,0.15)"}`,
        borderRadius: 4,
        fontFamily: "var(--font-body)",
        color: isValid ? "#F4EADB" : "#5A1F1A",
        overflow: "hidden",
        transition: `background ${duration.standard}ms, color ${duration.standard}ms`,
      }}
    >
      {/* Perforación superior e inferior — dots como ticket real */}
      <span aria-hidden="true" style={perforationTop(isValid)} />
      <span aria-hidden="true" style={perforationBottom(isValid)} />

      {/* Contenido */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: isValid ? "rgba(244,234,219,0.82)" : "#A8411A",
            marginBottom: 4,
          }}>
            Boleto de carga · Km 35,5
          </p>
          <p style={{
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.35,
            fontVariantNumeric: "tabular-nums",
          }}>
            {isValid
              ? "Boleto válido. Despacho sin costo."
              : <>Te faltan <strong>{fmt(falta)}</strong> para despacho sin costo.</>}
          </p>
        </div>

        {/* Sello VÁLIDO con ink-bleed — aparece al cruzar umbral */}
        <AnimatePresence>
          {isValid && (
            <motion.div
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -8 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: -6 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -8 }}
              transition={spring.flip}
              aria-hidden="true"
              style={{
                flexShrink: 0,
                padding: "4px 10px",
                border: "1.5px solid #F4EADB",
                borderRadius: 4,
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#F4EADB",
                outline: "1px dashed rgba(244,234,219,0.4)",
                outlineOffset: 2,
              }}
            >
              Válido
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Barra de progreso debajo — sobria, no el foco */}
      {!isValid && (
        <div style={{ marginTop: 10, height: 3, borderRadius: 9999, background: "rgba(90,31,26,0.1)", overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={reducedMotion ? { duration: 0 } : spring.arrive}
            style={{
              height: "100%",
              borderRadius: 9999,
              background: "linear-gradient(90deg, #A8411A, #E0784D)",
            }}
          />
        </div>
      )}
    </div>
  );
}

// Perforación con dots CSS — 4px diameter, 10px spacing.
function perforationTop(isValid: boolean): React.CSSProperties {
  const dotColor = isValid ? "rgba(244,234,219,0.4)" : "rgba(90,31,26,0.2)";
  return {
    position: "absolute",
    top: -3,
    left: 0,
    right: 0,
    height: 6,
    backgroundImage: `radial-gradient(circle, ${dotColor} 1.2px, transparent 1.5px)`,
    backgroundSize: "10px 6px",
    backgroundPosition: "center",
    backgroundRepeat: "repeat-x",
    zIndex: 1,
  };
}

function perforationBottom(isValid: boolean): React.CSSProperties {
  return { ...perforationTop(isValid), top: "auto", bottom: -3 };
}
