interface Props {
  text: string;
  bg?: string;
  color?: string;
}

export default function TextBreak({ text, bg = "#F4EADB", color = "#5A1F1A" }: Props) {
  return (
    <div
      style={{
        background: bg,
        padding: "6rem 1.25rem",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "clamp(1.75rem, 8vw, 3.5rem)",
          color,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        {text}
      </p>
    </div>
  );
}
