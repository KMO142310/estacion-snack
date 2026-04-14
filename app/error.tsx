"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log real del error — Vercel lo captura automáticamente en prod.
    console.error("[app/error]", error);
  }, [error]);

  return (
    <main
      className="h-screen-error"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1.5rem",
        background: "#F4EADB",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#A8411A",
          marginBottom: "1rem",
        }}
      >
        Algo falló · Error {error.digest ?? ""}
      </p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "clamp(2rem, 6vw, 3rem)",
          color: "#5A1F1A",
          lineHeight: 1.1,
          maxWidth: 560,
          marginBottom: "0.875rem",
        }}
      >
        Algo se nos quemó del horno.
      </h1>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "1rem",
          color: "#5E6B3E",
          marginBottom: "2rem",
          maxWidth: 480,
        }}
      >
        Ya nos enteramos. Intenta de nuevo; si sigue, escríbenos por WhatsApp.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "0.9375rem",
            padding: "0.875rem 1.5rem",
            borderRadius: 10,
            background: "#A8411A",
            color: "#F4EADB",
            border: "none",
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: "0.9375rem",
            padding: "0.875rem 1.5rem",
            borderRadius: 10,
            border: "1.5px solid rgba(90,31,26,0.2)",
            color: "#5A1F1A",
            textDecoration: "none",
          }}
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
