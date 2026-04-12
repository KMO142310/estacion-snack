interface Props {
  text: string;
  bg?: string;
  color?: string;
}

export default function TextBreak({ text, bg = "#F4EADB", color = "#5A1F1A" }: Props) {
  return (
    <div style={{ background: bg, padding: "5rem 1.5rem", textAlign: "center" }}>
      <p style={{
        fontFamily: "var(--font-display)", fontWeight: 500,
        fontSize: "clamp(1.5rem, 6vw, 2.5rem)", color,
        lineHeight: 1.2, maxWidth: 500, margin: "0 auto",
        whiteSpace: "pre-line",
      }}>
        {text}
      </p>
    </div>
  );
}
