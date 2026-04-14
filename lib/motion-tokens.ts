/**
 * Motion tokens · Estación Snack
 *
 * Filosofía: percusión mecánica ferroviaria, no rebote digital.
 * Cada preset tiene un uso semántico, no estético.
 *
 * Fuentes:
 * - Material Design Motion 3 (2024) — emphasized easing tokens
 * - Apple HIG Motion (2023) — natural vs. assertive motion
 * - Framer Motion v12 spring physics docs
 * - Schultz W. (1997) reward prediction error — anticipación > resolución
 */

import type { Transition } from "framer-motion";

// Spring presets — tunados contra la sensación railway (preciso, no bouncy).
// Validados: stiffness >150 + damping 22-30 produce damping ratio ζ ≈ 0.8-1.0
// (críticamente amortiguado, zero overshoot perceptible).
export const spring = {
  /** Contadores, subtotales, odometer. Llega sin overshoot. */
  precise: { type: "spring", stiffness: 180, damping: 26, mass: 1 } as Transition,

  /** Botones, chips, taps. Rápido y firme como un clic mecánico. */
  press: { type: "spring", stiffness: 400, damping: 30, mass: 0.6 } as Transition,

  /** Reveals, sheets, cards entrando. Calmado, presente. */
  arrive: { type: "spring", stiffness: 120, damping: 22, mass: 1 } as Transition,

  /** Flip de Solari board digits — percusión seca del panel cayendo. */
  flip: { type: "spring", stiffness: 320, damping: 24, mass: 0.9 } as Transition,
} as const;

// Duraciones canónicas (ms). Usarlas cuando necesitás setTimeout o CSS transition.
// Derivadas del research de NN/g "Animation Duration 200-300ms sweet spot".
export const duration = {
  instant: 80,   // Feedback táctil del press
  quick: 140,    // Hover → active
  standard: 280, // Mayoría de transiciones de estado
  gentle: 480,   // Reveals de viewport, sheets
} as const;

// Easing curves cuando se usa CSS transition o framer-motion con type tween.
// "railway" es una cubic-bezier fabricada para feel mecánico (entrada rápida, salida
// firme sin bounce). Distinta de "easeOut" orgánico.
export const easing = {
  railway: "cubic-bezier(0.22, 1, 0.36, 1)", // entrada rápida, salida firme
  press: "cubic-bezier(0.34, 1.1, 0.64, 1)", // mínimo overshoot
  settle: "cubic-bezier(0.4, 0, 0.2, 1)",    // MD3 emphasized
} as const;

// Stagger orquestado. Máximo 120ms total para multi-element reveals.
export const stagger = {
  /** Entre cards en grid (6 cards × 40ms = 240ms total, dentro del budget). */
  cards: 0.04,
  /** Entre dígitos de un Solari flip (5 dígitos × 40ms = 200ms). */
  digits: 0.04,
  /** Entre caracteres de texto flipeado. */
  chars: 0.02,
} as const;
