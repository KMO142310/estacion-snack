"use client";

import { useEffect, useState } from "react";
import ShoppingBag from "./icons/ShoppingBag";
import { useCartStore } from "@/lib/store";

interface HeaderProps {
  onOrderOpen: () => void;
}

export default function Header({ onOrderOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    setHydrated(true);
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const itemCount = hydrated ? items.length : 0;
  const fg = scrolled ? "#5A1F1A" : "#F4EADB";
  const accent = scrolled ? "#D0551F" : "#F4EADB";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        background: scrolled ? "rgba(244,234,219,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        padding: "12px 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: scrolled ? "1px solid rgba(90,31,26,0.10)" : "1px solid transparent",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Isotipo — el sello de la marca, escalable a cadena */}
      <a href="/" aria-label="Estación Snack — inicio" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
        <svg width={32} height={32} viewBox="0 0 40 40" fill="none" aria-hidden="true" style={{ transition: "all 0.3s ease" }}>
          <ellipse cx="20" cy="20" rx="17" ry="13" stroke={fg} strokeWidth="2.2" transform="rotate(-8 20 20)" />
          <path d="M8,17 C11,11 17,10 20,20 C23,30 27,29 32,23" stroke={accent} strokeWidth="2" strokeLinecap="round" />
        </svg>
        {scrolled && (
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9375rem",
            color: fg, transition: "opacity 0.3s ease",
          }}>
            estación snack
          </span>
        )}
      </a>

      {/* Carrito */}
      <button
        onClick={onOrderOpen}
        aria-label={`Ver pedido${itemCount > 0 ? ` (${itemCount} productos)` : ""}`}
        style={{
          position: "relative",
          width: 40, height: 40,
          background: scrolled ? "#5A1F1A" : "rgba(244,234,219,0.15)",
          color: scrolled ? "#F4EADB" : "#F4EADB",
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "none", cursor: "pointer",
          transition: "background 0.3s ease",
          flexShrink: 0,
        }}
      >
        <ShoppingBag size={18} />
        {itemCount > 0 && (
          <span aria-hidden="true" style={{
            position: "absolute", top: -4, right: -4,
            minWidth: 17, height: 17, padding: "0 4px",
            background: "#D0551F", color: "#F4EADB",
            fontSize: 10, fontWeight: 700, borderRadius: "9999px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-body)", lineHeight: 1,
          }}>
            {itemCount}
          </span>
        )}
      </button>
    </header>
  );
}
