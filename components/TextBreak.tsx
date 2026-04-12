"use client";

import { motion } from "framer-motion";

interface Props {
  text: string;
  bg?: string;
  color?: string;
  italic?: boolean;
}

export default function TextBreak({ text, bg = "#F4EADB", color = "#5A1F1A", italic = false }: Props) {
  return (
    <div
      style={{
        background: bg,
        padding: "7rem 1.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.p
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: italic ? 500 : 600,
          fontStyle: italic ? "italic" : "normal",
          fontSize: "clamp(2rem, 10vw, 4.5rem)",
          color,
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
          maxWidth: 700,
          margin: "0 auto",
          whiteSpace: "pre-line",
        }}
      >
        {text}
      </motion.p>
    </div>
  );
}
