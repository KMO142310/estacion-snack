"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Confetti SVG burst — dopamina literal al agregar producto.
 * Sin librería externa: 12 piezas SVG con keyframes CSS, ~600ms.
 * Auto-cleanup vía key change.
 *
 * React 19 purity: Math.random no se permite en render → se calcula
 * en useMemo dependiente de triggerKey (estable durante la animación).
 *
 * Respeta prefers-reduced-motion → fade simple.
 */
interface Props {
  triggerKey: number;
  size?: number;
  palette?: string[];
}

const DEFAULT_PALETTE = ["#B94A1F", "#E8B87D", "#5E6B3E", "#5A1F1A", "#E0784D"];
const PIECES = 12;

export default function Confetti({ triggerKey, size = 120, palette = DEFAULT_PALETTE }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (triggerKey === 0) return;
    // setState síncrono al detectar trigger. Es exactamente lo que queremos:
    // el componente padre incrementa triggerKey, nosotros activamos el burst.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(triggerKey);
    const t = setTimeout(() => setActive(0), 700);
    return () => clearTimeout(t);
  }, [triggerKey]);

  // Pre-calculamos posiciones por burst. React 19 react-hooks/purity considera
  // Math.random impura aún en useMemo → para evitar warnings, usamos un
  // pseudo-random determinístico derivado del índice + triggerKey (sin/cos hash).
  // Da variación visual sin romper la regla.
  const pieces = useMemo(() => {
    if (triggerKey === 0) return [];
    const half = size / 2;
    const hash = (n: number, seed: number) => {
      // sin-based pseudo-random — determinístico por (index, seed).
      const v = Math.sin(n * 12.9898 + seed * 78.233) * 43758.5453;
      return v - Math.floor(v); // 0..1
    };
    return Array.from({ length: PIECES }).map((_, i) => {
      const angle = (i / PIECES) * 2 * Math.PI;
      const variance = hash(i, triggerKey);
      const distance = half * (0.55 + variance * 0.45);
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - half * 0.15;
      const isCircle = i % 3 === 0;
      const dim = isCircle ? 7 : 9;
      return {
        i,
        tx,
        ty,
        rot: (hash(i + 1, triggerKey) - 0.5) * 540,
        delay: hash(i + 2, triggerKey) * 60,
        color: palette[i % palette.length],
        isCircle,
        dim,
      };
    });
  }, [triggerKey, size, palette]);

  if (!active) return null;

  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "visible",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ position: "relative", width: 0, height: 0 }}>
        {pieces.map((p) => (
          <span
            key={`${active}-${p.i}`}
            style={{
              position: "absolute",
              left: -p.dim / 2,
              top: -p.dim / 2,
              width: p.dim,
              height: p.dim,
              background: p.color,
              borderRadius: p.isCircle ? "50%" : "1px",
              animation: `confetti-burst 600ms cubic-bezier(0.22, 1, 0.36, 1) ${p.delay}ms forwards`,
              ["--tx" as string]: `${p.tx}px`,
              ["--ty" as string]: `${p.ty}px`,
              ["--rot" as string]: `${p.rot}deg`,
              opacity: 0,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </span>
      <style>{`
        @keyframes confetti-burst {
          0%   { transform: translate(0, 0) rotate(0deg) scale(0.4); opacity: 0; }
          15%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(1); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          span { animation: none !important; opacity: 0 !important; }
        }
      `}</style>
    </span>
  );
}
