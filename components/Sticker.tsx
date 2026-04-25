"use client";

/**
 * Sticker — badge rotado tipo etiqueta cosida o sello postal.
 * Animación de "bob" sutil para que se sienta vivo, no muerto.
 *
 * Variantes:
 *  - badge:  redondo, tipo sello/medalla
 *  - label:  rectangular con esquinas redondeadas, tipo etiqueta cosida
 *  - tag:    con hoyo de hilo (estilo etiqueta de bolsa de tela)
 */
type Variant = "badge" | "label" | "tag";
type Tone = "terracota" | "oliva" | "crema" | "burdeo";

interface Props {
  children: React.ReactNode;
  variant?: Variant;
  tone?: Tone;
  rotate?: number;       // grados, default random-ish
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
  bob?: boolean;         // animación bob (default true)
}

const TONE: Record<Tone, { bg: string; fg: string; border: string }> = {
  terracota: { bg: "#B94A1F", fg: "#F4EADB", border: "#8F3614" },
  oliva:     { bg: "#5E6B3E", fg: "#F4EADB", border: "#3F4A2A" },
  crema:     { bg: "#F4EADB", fg: "#5A1F1A", border: "#5A1F1A" },
  burdeo:    { bg: "#5A1F1A", fg: "#E8B87D", border: "#3D1613" },
};

const SIZE: Record<NonNullable<Props["size"]>, { padX: string; padY: string; font: string }> = {
  sm: { padX: "10px", padY: "5px",  font: "10.5px" },
  md: { padX: "14px", padY: "7px",  font: "12px" },
  lg: { padX: "18px", padY: "9px",  font: "13.5px" },
};

export default function Sticker({
  children,
  variant = "label",
  tone = "terracota",
  rotate = -4,
  size = "md",
  className,
  style,
  bob = true,
}: Props) {
  const t = TONE[tone];
  const s = SIZE[size];

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "var(--font-body)",
    fontSize: s.font,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: t.fg,
    background: t.bg,
    padding: `${s.padY} ${s.padX}`,
    transform: `rotate(${rotate}deg)`,
    transformOrigin: "center",
    border: `1.5px solid ${t.border}`,
    boxShadow: "2px 2px 0 rgba(0,0,0,0.08), 0 6px 14px -4px rgba(58,22,18,0.25)",
    whiteSpace: "nowrap",
    flexShrink: 0,
    animation: bob ? "sticker-bob 4.5s ease-in-out infinite" : undefined,
    ...style,
  };

  if (variant === "badge") {
    baseStyle.borderRadius = "999px";
    baseStyle.padding = `${s.padY} calc(${s.padX} + 4px)`;
  } else if (variant === "tag") {
    baseStyle.borderRadius = "4px";
    baseStyle.paddingLeft = `calc(${s.padX} + 14px)`;
  } else {
    baseStyle.borderRadius = "6px";
  }

  return (
    <span className={className} style={baseStyle} aria-hidden="true">
      {variant === "tag" && (
        <span
          style={{
            position: "absolute",
            left: 6,
            top: "50%",
            transform: "translateY(-50%)",
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: t.fg,
            opacity: 0.55,
          }}
        />
      )}
      {children}
      <style>{`
        @keyframes sticker-bob {
          0%, 100% { transform: rotate(${rotate}deg) translateY(0); }
          50%      { transform: rotate(${rotate + (rotate < 0 ? -0.6 : 0.6)}deg) translateY(-2px); }
        }
        @media (prefers-reduced-motion: reduce) {
          span[aria-hidden="true"] { animation: none !important; }
        }
      `}</style>
    </span>
  );
}
