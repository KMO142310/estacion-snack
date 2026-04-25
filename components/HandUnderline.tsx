/**
 * Subrayado SVG hecho "a mano" — bajo palabras clave en headlines.
 * Path manualmente irregular para no parecer línea CSS.
 * No es decorativo puro: enmarca énfasis editorial.
 */
interface Props {
  children: React.ReactNode;
  color?: string;
  thickness?: number;
  className?: string;
}

export default function HandUnderline({
  children,
  color = "#B94A1F",
  thickness = 6,
  className,
}: Props) {
  return (
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }} className={className}>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 14"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          left: "-2%",
          right: 0,
          bottom: "-0.18em",
          width: "104%",
          height: "0.42em",
          pointerEvents: "none",
        }}
      >
        <path
          d="M2 8 Q 30 2, 60 6 T 120 5 T 198 7"
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          opacity={0.9}
        />
      </svg>
    </span>
  );
}
