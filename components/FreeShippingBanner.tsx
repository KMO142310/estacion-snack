"use client";

import { useState, useEffect } from "react";

const COOKIE_KEY = "fsb_dismissed";

export default function FreeShippingBanner() {
  // Start visible so SSR renders the banner height, preventing CLS on first visits.
  // After mount, we hide it if the user already dismissed it (cookie check).
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismissed = document.cookie.split(";").some((c) => c.trim().startsWith(`${COOKIE_KEY}=1`));
    if (dismissed) setVisible(false);
  }, []);

  const dismiss = () => {
    // 7-day cookie
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${COOKIE_KEY}=1; expires=${expires}; path=/; SameSite=Lax`;
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: "#2D6822",
        color: "#fff",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        fontSize: 13,
        fontWeight: 700,
        position: "relative",
        textAlign: "center",
      }}
    >
      <span>
        🎉 Primera compra en Santa Cruz:{" "}
        <strong style={{ fontWeight: 900 }}>envío gratis</strong>
        {" "}· Sin mínimo de compra
      </span>
      <button
        aria-label="Cerrar aviso de envío gratis"
        onClick={dismiss}
        style={{
          background: "rgba(255,255,255,.2)",
          border: "none",
          color: "#fff",
          fontSize: 13,
          padding: "2px 8px",
          borderRadius: 6,
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        ✕
      </button>
    </div>
  );
}
