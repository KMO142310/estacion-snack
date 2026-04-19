"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ShoppingBag from "./icons/ShoppingBag";
import { useCartStore } from "@/lib/store";
import { spring } from "@/lib/motion-tokens";

interface HeaderProps {
  onOrderOpen: () => void;
}

export default function Header({ onOrderOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const items = useCartStore((s) => s.items);
  const reducedMotion = useReducedMotion();

  useEffect(() => { setHydrated(true); useCartStore.persist.rehydrate(); }, []);

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 10); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const itemCount = hydrated ? items.length : 0;

  return (
    <header style={{
      background: "rgba(90,31,26,0.96)",
      paddingLeft: 16,
      paddingRight: "max(16px, env(safe-area-inset-right, 0px))",
      height: 68,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: scrolled ? "0 10px 28px rgba(18,5,3,0.18)" : "none",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      borderBottom: "1px solid rgba(244,234,219,0.08)",
    }}>
      <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <img src="/img/logo-icon.svg" alt="" width={40} height={40} style={{ borderRadius: 12, flexShrink: 0 }} />
        <span style={{ minWidth: 0 }}>
          <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 21, letterSpacing: "-0.02em", lineHeight: 0.95, color: "#F4EADB", fontWeight: 600 }}>
            Estación Snack
          </span>
          <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,234,219,0.62)", marginTop: 4 }}>
            Frutos secos por kilo
          </span>
        </span>
      </a>

      <motion.button
        onClick={onOrderOpen}
        aria-label={`Ver pedido${itemCount > 0 ? ` (${itemCount})` : ""}`}
        whileTap={reducedMotion ? undefined : { scale: 0.94 }}
        transition={spring.press}
        style={{
          position: "relative",
          minWidth: 50,
          height: 44,
          padding: "0 13px",
          background: "rgba(244,234,219,0.10)",
          color: "#F4EADB",
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          border: "none", cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
          flexShrink: 0,
        }}
      >
        <ShoppingBag size={22} />
        <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Pedido
        </span>
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.span
              key="badge"
              initial={reducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
              animate={reducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
              transition={spring.press}
              style={{
                position: "absolute", top: -4, right: -2, minWidth: 18, height: 18, padding: "0 5px",
                background: "#A8411A", color: "#F4EADB", fontSize: 10, fontWeight: 700,
                borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-body)",
                fontVariantNumeric: "tabular-nums",
                border: "2px solid #5A1F1A",
                pointerEvents: "none",
              }}
            >
              <motion.span
                key={itemCount}
                initial={reducedMotion ? undefined : { y: -10, opacity: 0 }}
                animate={reducedMotion ? undefined : { y: 0, opacity: 1 }}
                transition={spring.flip}
                style={{ display: "inline-block", lineHeight: 1 }}
              >
                {itemCount}
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </header>
  );
}
