import { ImageResponse } from "next/og";
import productsData from "@/data/products.json";

export const runtime = "nodejs";
export const alt = "Estación Snack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = (productsData as { slug: string; name: string; price: number; copy: string }[]).find(
    (p) => p.slug === slug,
  );

  const name = product?.name ?? "Frutos secos frescos";
  const price = product?.price
    ? `$${product.price.toLocaleString("es-CL")} / kg`
    : "";
  const copy = product?.copy ?? "Por kilo, directo.";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          fontFamily: "Georgia, serif",
          background: "#5A1F1A",
        }}
      >
        {/* Left — text */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 80px",
          }}
        >
          {/* Brand badge */}
          <div
            style={{
              display: "flex",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 13,
                fontWeight: 700,
                color: "#A8411A",
                background: "rgba(208,85,31,0.18)",
                padding: "6px 16px",
                borderRadius: 100,
              }}
            >
              Estación Snack · Santa Cruz
            </div>
          </div>

          {/* Product name */}
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              color: "#F4EADB",
              marginBottom: 20,
              maxWidth: 520,
            }}
          >
            {name}
          </div>

          {/* Copy */}
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "rgba(244,234,219,0.72)",
              lineHeight: 1.5,
              maxWidth: 480,
              marginBottom: 40,
            }}
          >
            {copy}
          </div>

          {/* Price */}
          {price && (
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 48,
                  fontWeight: 900,
                  color: "#A8411A",
                  letterSpacing: "-0.02em",
                }}
              >
                {price}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "#A8411A",
            display: "flex",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
