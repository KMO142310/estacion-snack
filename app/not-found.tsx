import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "No encontramos esa página",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "60svh",
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
        404 · No está acá
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
        Este producto se nos acabó
        <br />
        en esta dirección.
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
        Probá desde el inicio o escribínos por WhatsApp y te orientamos.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "0.9375rem",
            padding: "0.875rem 1.5rem",
            borderRadius: 10,
            background: "#A8411A",
            color: "#F4EADB",
            textDecoration: "none",
          }}
        >
          Volver al inicio
        </Link>
        <a
          href="https://wa.me/56953743338"
          target="_blank"
          rel="noopener noreferrer"
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
          Escribir por WhatsApp
        </a>
      </div>
    </main>
  );
}
