"use client";

import { useState } from "react";

export default function Announce() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const nextDispatch = () => {
    const now = new Date();
    const day = now.getDay(); // 0=Sun,1=Mon,...
    // Next Tue=2 or Fri=5
    const daysToTue = (2 - day + 7) % 7 || 7;
    const daysToFri = (5 - day + 7) % 7 || 7;
    const nextDays = Math.min(daysToTue, daysToFri);
    if (nextDays === 0) return "hoy";
    if (nextDays === 1) return "mañana";
    const names = ["dom","lun","mar","mié","jue","vie","sáb"];
    const next = new Date(now);
    next.setDate(now.getDate() + nextDays);
    return names[next.getDay()];
  };

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: "var(--orange-soft)",
        color: "var(--text)",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        fontSize: 12,
        fontWeight: 600,
        position: "relative",
      }}
    >
      <span>📦 Próximo despacho: <strong style={{ fontWeight: 800, color: "var(--text)" }}>{nextDispatch()}</strong></span>
      <button
        aria-label="Cerrar aviso"
        onClick={() => setVisible(false)}
        style={{
          background: "none",
          border: "none",
          color: "var(--sub)",
          fontSize: 14,
          padding: "4px 8px",
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </div>
  );
}
