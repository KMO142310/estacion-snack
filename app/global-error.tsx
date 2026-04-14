"use client";

// global-error.tsx solo se monta cuando el layout raíz tira;
// debe incluir html + body porque reemplaza todo el documento.
// Fuente: https://nextjs.org/docs/app/getting-started/error-handling
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es-CL">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 1.5rem",
          background: "#F4EADB",
          color: "#5A1F1A",
          fontFamily: "system-ui, -apple-system, sans-serif",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          Error crítico
        </h1>
        <p style={{ marginBottom: "1.5rem", maxWidth: 480 }}>
          No pudimos cargar la tienda. Probá refrescar la página.
          {error.digest ? ` (ref: ${error.digest})` : ""}
        </p>
        <button
          onClick={reset}
          style={{
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
      </body>
    </html>
  );
}
