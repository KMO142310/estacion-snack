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
          background: "#5A1F1A",
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
            marginBottom: 40,
            fontSize: 16,
            fontWeight: 700,
            color: "#D0551F",
            background: "rgba(208,85,31,0.18)",
            padding: "10px 24px",
            borderRadius: 100,
          }}
        >
          Santa Cruz · Valle de Colchagua
        </div>

        {/* Main headline */}
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1.05,
            color: "#F4EADB",
            marginBottom: 28,
            letterSpacing: "-0.02em",
            maxWidth: 900,
          }}
        >
          Estación Snack
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "rgba(244,234,219,0.72)",
            lineHeight: 1.5,
            maxWidth: 680,
            marginBottom: 52,
          }}
        >
          Frutos secos frescos por kilo. Pedís por WhatsApp y llega martes o viernes.
        </div>

        {/* Pills row */}
        <div
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          {["Sin mínimo de compra", "Martes y viernes", "Pesado al momento"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                fontSize: 15,
                fontWeight: 700,
                padding: "10px 22px",
                background: "#D0551F",
                color: "#F4EADB",
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
            height: 6,
            background: "#D0551F",
            display: "flex",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
