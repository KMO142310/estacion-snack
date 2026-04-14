// Filete doble — separador editorial tipo ticket/boleto ferroviario.
// Dos líneas horizontales con gap mínimo + opcionalmente un ornamento centrado.
interface Props {
  dark?: boolean; // variante para fondos oscuros (burdeo)
  width?: number | string; // px, % o "auto" (default: "auto")
  ornament?: "dots" | "star" | "none";
  className?: string;
  style?: React.CSSProperties;
}

export default function Filete({
  dark = false,
  width = "auto",
  ornament = "dots",
  className,
  style,
}: Props) {
  const color = dark ? "rgba(244,234,219,0.35)" : "rgba(90,31,26,0.25)";
  const orn = dark ? "rgba(244,234,219,0.55)" : "rgba(90,31,26,0.55)";

  const ornamentText = ornament === "dots" ? "· · ·" : ornament === "star" ? "✺" : "";

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.875rem",
        width: typeof width === "number" ? `${width}px` : width,
        maxWidth: "100%",
        margin: "0 auto",
        padding: "2rem 0",
        ...style,
      }}
    >
      <span
        style={{
          flex: 1,
          maxWidth: 120,
          height: 3,
          borderTop: `1px solid ${color}`,
          borderBottom: `1px solid ${color}`,
        }}
      />
      {ornament !== "none" && (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.125rem",
            color: orn,
            letterSpacing: ornament === "dots" ? "0.35em" : undefined,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          {ornamentText}
        </span>
      )}
      <span
        style={{
          flex: 1,
          maxWidth: 120,
          height: 3,
          borderTop: `1px solid ${color}`,
          borderBottom: `1px solid ${color}`,
        }}
      />
    </div>
  );
}
