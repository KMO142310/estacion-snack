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
        transition: "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
      }}
    >
      {/* Nombre simple — no logo pesado */}
      <a
        href="/"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "1.125rem",
          color: scrolled ? "#5A1F1A" : "#F4EADB",
          textDecoration: "none",
          transition: "color 0.3s ease",
        }}
      >
        estación snack
      </a>

      {/* Solo el carrito — nada más */}
      <button
        onClick={onOrderOpen}
        aria-label={`Ver pedido${itemCount > 0 ? ` (${itemCount} productos)` : ""}`}
        style={{
          position: "relative",
          width: 40,
          height: 40,
          background: scrolled ? "#5A1F1A" : "rgba(244,234,219,0.15)",
          color: "#F4EADB",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          cursor: "pointer",
          transition: "background 0.3s ease",
          flexShrink: 0,
        }}
      >
        <ShoppingBag size={18} />
        {itemCount > 0 && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 17,
              height: 17,
              padding: "0 4px",
              background: "#D0551F",
              color: "#F4EADB",
              fontSize: 10,
              fontWeight: 700,
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-body)",
              lineHeight: 1,
            }}
          >
            {itemCount}
          </span>
        )}
      </button>
    </header>
  );
}
