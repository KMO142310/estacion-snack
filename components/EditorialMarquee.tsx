interface Props {
  text: string;
  bg?: string;
  color?: string;
  speed?: number;
}

export default function EditorialMarquee({ text, bg = "#F4EADB", color = "#5A1F1A", speed = 25 }: Props) {
  const sep = " · ";
  const content = `${text}${sep}`.repeat(8);

  return (
    <div
      style={{
        background: bg,
        padding: "3rem 0",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          animation: `editorialMarquee ${speed}s linear infinite`,
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "clamp(2.5rem, 10vw, 5rem)",
          color,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          opacity: 0.85,
        }}
      >
        <span>{content}</span>
        <span>{content}</span>
      </div>

      <style>{`
        @keyframes editorialMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
