import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/lib/actions";

export const runtime = "nodejs";
export const alt = "Estación Snack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.estacionsnack.cl";

const BG_MAP: Record<string, { bg: string; accent: string }> = {
  orange: { bg: "#FFF3E0", accent: "#E8721C" },
  green:  { bg: "#E8F5E9", accent: "#2E7D32" },
  red:    { bg: "#FFEBEE", accent: "#C62828" },
  purple: { bg: "#F3E5F5", accent: "#6A1B9A" },
  yellow: { bg: "#FFFDE7", accent: "#F9A825" },
  sand:   { bg: "#FBF6EE", accent: "#8D6E53" },
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const colors = BG_MAP[product?.color ?? "orange"] ?? BG_MAP.orange;
  const name = product?.name ?? "Frutos secos frescos";
  const price = product?.price
    ? `$${product.price.toLocaleString("es-CL")} / kg`
    : "";
  const copy = product?.copy ?? "Por kilo, sin envases innecesarios.";

  const imageUrl = product?.image_url
    ? product.image_url.startsWith("http")
      ? product.image_url
      : `${SITE}${product.image_url}`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          fontFamily: "Georgia, serif",
          background: colors.bg,
        }}
      >
        {/* Left — text */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 64px",
          }}
        >
          {/* Brand badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: colors.accent,
                background: `${colors.accent}18`,
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
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              color: "#1A1816",
              marginBottom: 20,
              maxWidth: 520,
            }}
          >
            {name}
          </div>

          {/* Copy */}
          <div
            style={{
              fontSize: 22,
              color: "#5F5A52",
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
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  color: colors.accent,
                  letterSpacing: "-0.02em",
                }}
              >
                {price}
              </span>
            </div>
          )}
        </div>

        {/* Right — image */}
        {imageUrl && (
          <div
            style={{
              width: 420,
              height: 630,
              display: "flex",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: colors.accent,
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
