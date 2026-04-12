"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
    if (!stored) setVisible(true);
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
      aria-label="Preferencias de cookies"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        padding: "1.25rem 1.25rem",
        paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))",
        background: "#5A1F1A",
        borderTop: "1px solid rgba(244,234,219,0.15)",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "rgba(244,234,219,0.85)",
            lineHeight: 1.6,
            marginBottom: "0.875rem",
          }}
        >
          Usamos cookies de analítica (Google Analytics y Meta Pixel) para mejorar tu experiencia.
          No vendemos tus datos.{" "}
          <Link
            href="/privacidad"
            style={{ color: "#D0551F", textDecoration: "underline", textUnderlineOffset: "2px" }}
          >
            Política de privacidad
          </Link>
        </p>
        <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
          <button
            onClick={() => respond("accepted")}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "0.8125rem",
              color: "#5A1F1A",
              background: "#F4EADB",
              border: "none",
              borderRadius: "8px",
              padding: "0.625rem 1.25rem",
              cursor: "pointer",
            }}
          >
            Aceptar
          </button>
          <button
            onClick={() => respond("rejected")}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "0.8125rem",
              color: "rgba(244,234,219,0.70)",
              background: "none",
              border: "1px solid rgba(244,234,219,0.25)",
              borderRadius: "8px",
              padding: "0.625rem 1.25rem",
              cursor: "pointer",
            }}
          >
            Solo esenciales
          </button>
        </div>
      </div>
    </div>
  );
}
