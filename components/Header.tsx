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

  useEffect(() => {
    setHydrated(true);
    useCartStore.persist.rehydrate();
  }, []);

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
      background: scrolled ? "rgba(244,234,219,0.96)" : "rgba(90,31,26,0.95)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      padding: "0 16px", height: 56,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: scrolled ? "1px solid rgba(90,31,26,0.08)" : "none",
      transform: visible ? "translateY(0)" : "translateY(-100%)",
      transition: "transform 0.25s ease, background 0.3s ease",
    }}>
      {/* Logo tipo marca — nombre estilizado, no ícono genérico */}
      <a href="/" style={{
        textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: 18, letterSpacing: "-0.02em",
          color: scrolled ? "#5A1F1A" : "#F4EADB",
          transition: "color 0.3s ease",
        }}>
          Estación
        </span>
        <span style={{
          fontFamily: "var(--font-display)", fontWeight: 400,
          fontSize: 18, letterSpacing: "-0.02em",
          color: scrolled ? "#D0551F" : "rgba(244,234,219,0.6)",
          transition: "color 0.3s ease",
        }}>
          Snack
        </span>
      </a>

      {/* Carrito */}
      <button
        onClick={onOrderOpen}
        aria-label={`Ver pedido${itemCount > 0 ? ` (${itemCount})` : ""}`}
        style={{
          position: "relative", width: 40, height: 40,
          background: scrolled ? "#5A1F1A" : "rgba(244,234,219,0.12)",
          color: "#F4EADB", borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "none", cursor: "pointer",
          transition: "background 0.3s ease",
        }}
      >
        <ShoppingBag size={18} />
        {itemCount > 0 && (
          <span style={{
            position: "absolute", top: -3, right: -3,
            minWidth: 18, height: 18, padding: "0 5px",
            background: "#D0551F", color: "#F4EADB",
            fontSize: 10, fontWeight: 700, borderRadius: 999,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-body)",
          }}>
            {itemCount}
          </span>
        )}
      </button>
    </header>
  );
}
