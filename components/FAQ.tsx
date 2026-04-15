"use client";

import { useState } from "react";
import { faqs } from "@/data/faq";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 720 }}>
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            style={{
              background: "#fff",
              border: `1.5px solid ${isOpen ? "#A8411A" : "rgba(90,31,26,0.10)"}`,
              borderRadius: "14px",
              overflow: "hidden",
              transition: "border-color 0.15s",
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              style={{
                width: "100%",
                padding: "1.125rem 1.25rem",
                fontSize: "0.9375rem",
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
                background: "none",
                border: "none",
                color: "#5A1F1A",
                textAlign: "left",
              }}
            >
              <span>{item.q}</span>
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 300,
                  color: "#A8411A",
                  flexShrink: 0,
                  transition: "transform 0.2s",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  display: "inline-block",
                }}
              >
                +
              </span>
            </button>
            {isOpen && (
              <p
                style={{
                  padding: "0 1.25rem 1.125rem",
                  fontSize: "0.9rem",
                  color: "#5E6B3E",
                  lineHeight: 1.7,
                  margin: 0,
                  fontFamily: "var(--font-body)",
                }}
              >
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
