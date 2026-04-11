import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Estación Snack — Frutos secos y snacks por kilo en Santa Cruz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#FFF3EC",
          padding: "80px 100px",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Location badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 40,
            fontSize: 16,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#E8721C",
            background: "rgba(232,114,28,0.12)",
            padding: "10px 24px",
            borderRadius: 100,
          }}
        >
          📍 Santa Cruz, Chile
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1.0,
            color: "#1A1816",
            marginBottom: 28,
            letterSpacing: "-0.03em",
            maxWidth: 900,
          }}
        >
          Estación{" "}
          <span style={{ color: "#E8721C", fontStyle: "italic" }}>Snack</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#5F5A52",
            lineHeight: 1.5,
            maxWidth: 680,
            marginBottom: 52,
          }}
        >
          Frutos secos y snacks frescos por kilo. Elige, pide y te lo llevamos a tu puerta.
        </div>

        {/* Pills row */}
        <div
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          {["Envío gratis", "Sin mínimo", "Martes y viernes"].map((label) => (
            <div
              key={label}
              style={{
                fontSize: 16,
                fontWeight: 700,
                padding: "10px 24px",
                background: "#1A1816",
                color: "#fff",
                borderRadius: 100,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "#E8721C",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
