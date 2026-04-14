"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import FlipBoard from "./FlipBoard";

const MSG_COUNT = 3;
const ROTATE_MS = 7000;

export default function Announce() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  // Rotación con pause on hover/focus + respeto prefers-reduced-motion.
  // Ref: NN/g "Auto-Forwarding Carousels Annoy Users" (min 7s + pause control).
  useEffect(() => {
    if (reducedMotion || paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % MSG_COUNT);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [paused, reducedMotion]);

  if (!visible) return null;

  // Mensajes tablero de salidas — vocabulario ferroviario Ramal San Fernando–Pichilemu.
  // Fuentes: Museo Ramal, EFE Cultura, Memoria Chilena (verificadas 2026-04-14).
  const messages = [
    "Próxima salida · despacho martes a sábado",
    "Cabeceras · Marchigüe · Peralillo · Santa Cruz · Cunaco",
    "Carga desde 1 kg · pedido por WhatsApp",
  ];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      style={{
        // Burdeo oscuro + acento ámbar = tablero de salidas ferroviario
        background: "#3d1613",
        color: "#F4EADB",
        padding: "10px 40px 10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        position: "relative",
        minHeight: 38,
        borderBottom: "1px solid rgba(244,234,219,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Signal light ámbar — luz de señal ferroviaria parpadeante */}
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#E0A84D",
          boxShadow: "0 0 8px rgba(224,168,77,0.6)",
          animation: reducedMotion ? "none" : "pulse 2s ease-in-out infinite",
          flexShrink: 0,
        }}
      />

      {/* Mensaje con flip de paneles Solari */}
      <FlipBoard
        text={messages[index]}
        ariaLabel={messages[index]}
        panelHeight={16}
        fontSize={11}
        letterSpacing="0.08em"
        color="#F4EADB"
        fontWeight={600}
      />

      <button
        aria-label="Cerrar aviso"
        onClick={() => setVisible(false)}
        style={{
          background: "none",
          border: "none",
          color: "rgba(244,234,219,0.55)",
          fontSize: 14,
          padding: "4px 8px",
          position: "absolute",
          right: 4,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          lineHeight: 1,
        }}
      >
        ✕
      </button>
    </div>
  );
}
