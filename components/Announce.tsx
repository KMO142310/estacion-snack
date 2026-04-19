"use client";

import { useState } from "react";

export default function Announce() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
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
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#E0A84D",
          boxShadow: "0 0 8px rgba(224,168,77,0.6)",
          flexShrink: 0,
        }}
      />

      <span
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 11,
          letterSpacing: "0.08em",
          lineHeight: 1,
        }}
      >
        Santa Cruz · pedido por WhatsApp
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
