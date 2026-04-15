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
      background: "#5A1F1A",
      paddingLeft: 20,
      paddingRight: "max(20px, env(safe-area-inset-right, 0px))",
      height: 70,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: scrolled ? "0 2px 16px rgba(18,5,3,0.25)" : "none",
    }}>
      <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
        <img src="/img/logo-icon.svg" alt="" width={44} height={44} style={{ borderRadius: 12 }} />
        <span style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "-0.01em", lineHeight: 1 }}>
          <span style={{ fontWeight: 700, color: "#F4EADB" }}>Estación </span>
          <span style={{ fontWeight: 500, color: "rgba(244,234,219,0.75)" }}>Snack</span>
        </span>
      </a>

      <motion.button
        onClick={onOrderOpen}
        aria-label={`Ver pedido${itemCount > 0 ? ` (${itemCount})` : ""}`}
        whileTap={reducedMotion ? undefined : { scale: 0.94 }}
        transition={spring.press}
        style={{
          position: "relative", width: 48, height: 48,
          background: "rgba(244,234,219,0.14)", color: "#F4EADB",
          borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
          border: "none", cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <ShoppingBag size={22} />
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
