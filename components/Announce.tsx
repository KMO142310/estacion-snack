"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

function getNextDispatch(): string {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  // Dispatch days: Tue(2) to Sat(6), until 21:00
  if (day >= 2 && day <= 6 && hour < 21) return "hoy";
  let next = (day + 1) % 7;
  let daysAhead = 1;
  while (next < 2 || next > 6) {
    next = (next + 1) % 7;
    daysAhead++;
  }
  if (daysAhead === 1) return "mañana";
  return ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"][next];
}

const MSG_COUNT = 3;

export default function Announce() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(true);
  const [dispatch, setDispatch] = useState("");
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setDispatch(getNextDispatch());
  }, []);

  // 7s + pause on hover/focus + respeta prefers-reduced-motion.
  // Fuente: NN/g "Auto-Forwarding Carousels Annoy Users".
  useEffect(() => {
    if (reducedMotion) return;
    if (paused) return;
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % MSG_COUNT);
        setFade(true);
      }, 300);
    }, 7000);
    return () => clearInterval(timer);
  }, [paused, reducedMotion]);

  if (!visible) return null;

  // Announce como tablero de salidas de estación de tren.
  // Vocabulario ferroviario verificable del Ramal San Fernando–Pichilemu.
  // Ref: Research railway Colchagua 2026-04-14.
  const messages = [
    "Próxima salida · despacho martes a sábado",
    "Cabeceras · Marchigüe · Peralillo · Santa Cruz · Cunaco",
    "Carga desde 1 kg · pedido por WhatsApp",
  ];

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      style={{
        // Departure board: burdeo oscuro + acento ámbar de luz de señal
        background: "#3d1613",
        color: "#F4EADB",
        padding: "8px 40px 8px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "var(--font-body)",
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "0.04em",
        position: "relative",
        minHeight: 34,
        borderBottom: "1px solid rgba(244,234,219,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Luz de señal parpadeante (ámbar) — signal light ferroviaria */}
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
      <span
        style={{
          opacity: fade ? 1 : 0,
          transition: "opacity 0.3s ease",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        {messages[index]}
      </span>
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
