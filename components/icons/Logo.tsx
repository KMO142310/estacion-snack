// Isotipo + logotipo de Estación Snack
// Isotipo: oval (fruto seco / piedra pirca) con línea interior de corte
// Logotipo: isotipo + wordmark tipográfico con Fraunces

import Link from "next/link";

interface LogoProps {
  variant?: "full" | "horizontal" | "icon";
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
  className?: string;
}

export default function Logo({
  variant = "horizontal",
  size = "md",
  inverted = false,
  className = "",
}: LogoProps) {
  const color = inverted ? "#F4EADB" : "#5A1F1A";
  const accent = inverted ? "#F4EADB" : "#A8411A";

  const iconSizes = { sm: 24, md: 32, lg: 44 };
  const textSizes = { sm: "text-sm", md: "text-base", lg: "text-xl" };
  const iconPx = iconSizes[size];

  const Icon = (
    <svg
      width={iconPx}
      height={iconPx}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/* Oval exterior — evoca una almendra / piedra de pirca */}
      <ellipse
        cx="20"
        cy="20"
        rx="17"
        ry="13"
        stroke={color}
        strokeWidth="2"
        transform="rotate(-8 20 20)"
      />
      {/* Línea interior — corte natural del fruto, trazo irregular */}
      <path
        d="M8,17 C11,11 17,10 20,20 C23,30 27,29 32,23"
        stroke={accent}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === "icon") {
    return (
      <span className={className} aria-label="Estación Snack">
        {Icon}
      </span>
    );
  }

  const wordmark = (
    <span
      style={{
        fontFamily: "var(--font-display)",
        color,
        lineHeight: 1,
        letterSpacing: "-0.01em",
      }}
      className={textSizes[size]}
    >
      {variant === "full" ? (
        <span className="flex flex-col">
          <span style={{ fontWeight: 600 }}>estación</span>
          <span style={{ fontWeight: 500 }}>snack</span>
        </span>
      ) : (
        <span>
          <span style={{ fontWeight: 600 }}>estación</span>
          <span style={{ fontWeight: 400 }}> snack</span>
        </span>
      )}
    </span>
  );

  return (
    <Link
      href="/"
      aria-label="Estación Snack — inicio"
      className={`flex items-center gap-2 ${className}`}
      style={{ textDecoration: "none" }}
    >
      {Icon}
      {wordmark}
    </Link>
  );
}
