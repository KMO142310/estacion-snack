"use client";

/**
 * Odometer · contador kilométrico animado.
 *
 * Cuando el `value` cambia, el número NO salta — se desplaza con spring
 * physics hacia el nuevo valor, interpolando en CLP enteros. Efecto
 * odómetro de locomotora (EFE N.º 607 tipo 57, 1913).
 *
 * Respeta prefers-reduced-motion → salto directo sin animar.
 * Usa tabular-nums para que los dígitos no bailen de ancho.
 *
 * Ref: framer-motion useSpring + useMotionValue docs.
 */

import { useEffect, useState } from "react";
import { useMotionValue, useSpring, useReducedMotion, useMotionValueEvent } from "framer-motion";
import { fmt } from "@/lib/cart-utils";
import { spring } from "@/lib/motion-tokens";

interface Props {
  /** Valor numérico a mostrar. */
  value: number;
  /** Formateador custom. Default: `fmt` (CLP con $). */
  format?: (n: number) => string;
  /** Prefix opcional (p.ej. signo). */
  prefix?: string;
  /** Suffix opcional (p.ej. " kg"). */
  suffix?: string;
  /** className. */
  className?: string;
  /** Style pass-through. */
  style?: React.CSSProperties;
}

export default function Odometer({
  value,
  format = fmt,
  prefix,
  suffix,
  className,
  style,
}: Props) {
  const reducedMotion = useReducedMotion();
  const motionValue = useMotionValue(value);
  // Spring "precise" — stiffness 180, damping 26, mass 1 → crítico sin overshoot.
  const spring_ = useSpring(motionValue, reducedMotion ? { duration: 0 } : spring.precise);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useMotionValueEvent(spring_, "change", (latest) => {
    setDisplay(Math.round(latest));
  });

  return (
    <span
      className={className}
      style={{
        fontVariantNumeric: "tabular-nums",
        display: "inline-block",
        ...style,
      }}
    >
      {prefix}
      {format(display)}
      {suffix}
    </span>
  );
}
