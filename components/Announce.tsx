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

  // Elite editorial: líneas dated/geográficas en vez de promo,
  // inspirado en Viu Manent "90 años" y Lapostolle "Informe de Vendimia".
  // Ref: Research C (Colchagua wine country).
  const messages = [
    "Santa Cruz · Valle de Colchagua",
    "Entrega martes a sábado",
    "WhatsApp, sin apps",
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
        background: "linear-gradient(90deg, #A8411A, #B84A1A)",
        color: "#F4EADB",
        padding: "6px 40px 6px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "var(--font-body)",
        position: "relative",
        minHeight: 32,
      }}
    >
      <span
        style={{
          opacity: fade ? 1 : 0,
          transition: "opacity 0.3s ease",
          textAlign: "center",
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
          color: "rgba(244,234,219,0.6)",
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
