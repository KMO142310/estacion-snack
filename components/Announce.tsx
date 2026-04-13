"use client";

import { useState, useEffect } from "react";

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

  useEffect(() => {
    setDispatch(getNextDispatch());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % MSG_COUNT);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  const messages = [
    dispatch ? `Próximo despacho: ${dispatch}` : "Despacho martes a sábado · 19:30 a 21:00",
    "Envío gratis sobre $25.000 · Santa Cruz $2.000",
    "Frutos secos por kilo — desde 1 kg",
  ];

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: "linear-gradient(90deg, #D0551F, #B84A1A)",
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
