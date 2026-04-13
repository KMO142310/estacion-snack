"use client";

import { useEffect, useRef, useState } from "react";
import ShoppingBag from "./icons/ShoppingBag";
import { useCartStore } from "@/lib/store";

interface HeaderProps {
  onOrderOpen: () => void;
}

export default function Header({ onOrderOpen }: HeaderProps) {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const lastY = useRef(0);
  const items = useCartStore((s) => s.items);

  useEffect(() => { setHydrated(true); useCartStore.persist.rehydrate(); }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      setVisible(y < 10 || y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const itemCount = hydrated ? items.length : 0;

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 200,
      background: "#5A1F1A",
      padding: "0 20px", height: 62,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transform: visible ? "translateY(0)" : "translateY(-100%)",
      transition: "transform 0.25s ease",
      boxShadow: scrolled ? "0 2px 16px rgba(18,5,3,0.25)" : "none",
    }}>
      <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/img/logo-icon.svg" alt="" width={38} height={38} style={{ borderRadius: 10 }} />
        <span style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: "-0.01em", lineHeight: 1 }}>
          <span style={{ fontWeight: 700, color: "#F4EADB" }}>Estación </span>
          <span style={{ fontWeight: 400, color: "rgba(244,234,219,0.5)" }}>Snack</span>
        </span>
      </a>

      <button onClick={onOrderOpen}
        aria-label={`Ver pedido${itemCount > 0 ? ` (${itemCount})` : ""}`}
        style={{
          position: "relative", width: 44, height: 44,
          background: "rgba(244,234,219,0.12)", color: "#F4EADB",
          borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
          border: "none", cursor: "pointer",
        }}>
        <ShoppingBag size={20} />
        {itemCount > 0 && (
          <span key={itemCount} style={{
            position: "absolute", top: -3, right: -3, minWidth: 16, height: 16, padding: "0 4px",
            background: "#D0551F", color: "#F4EADB", fontSize: 9, fontWeight: 700,
            borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-body)",
            animation: "badgePop 0.2s ease",
          }}>{itemCount}</span>
        )}
      </button>
    </header>
  );
}
