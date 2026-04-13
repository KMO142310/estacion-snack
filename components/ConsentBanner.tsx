"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "es_tracking_consent";

type Consent = "accepted" | "rejected" | null;

export function getTrackingConsent(): Consent {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CONSENT_KEY) as Consent;
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getTrackingConsent();
    if (!stored) setTimeout(() => setVisible(true), 1500);
  }, []);

  const respond = (choice: "accepted" | "rejected") => {
    localStorage.setItem(CONSENT_KEY, choice);
    setVisible(false);
    if (choice === "accepted") window.location.reload();
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookies"
      style={{
        position: "fixed",
        bottom: "calc(80px + env(safe-area-inset-bottom, 0px))",
        left: 12,
        right: 12,
        zIndex: 9000,
        maxWidth: 360,
        margin: "0 auto",
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 12,
        padding: "10px 14px",
        boxShadow: "0 4px 20px rgba(90,31,26,0.12)",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <p style={{
        fontFamily: "var(--font-body)", fontSize: 12, color: "#5A1F1A",
        lineHeight: 1.5, flex: 1, margin: 0,
      }}>
        Usamos cookies para mejorar tu experiencia.
      </p>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button onClick={() => respond("accepted")} style={{
          fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12,
          color: "#F4EADB", background: "#D0551F", border: "none",
          borderRadius: 8, padding: "7px 14px", cursor: "pointer",
        }}>
          OK
        </button>
        <button onClick={() => respond("rejected")} style={{
          fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12,
          color: "#5A1F1A", background: "none", border: "1px solid rgba(90,31,26,0.15)",
          borderRadius: 8, padding: "7px 12px", cursor: "pointer",
        }}>
          No
        </button>
      </div>
    </div>
  );
}
