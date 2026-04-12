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
      padding: "0 16px",
      transform: visible ? "translateY(0)" : "translateY(-100%)",
      transition: "transform 0.25s ease",
    }}>
      {/* Línea superior — marca + carrito */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 52,
      }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "#F4EADB" }}>
            Estación
          </span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 17, color: "rgba(244,234,219,0.5)" }}>
            Snack
          </span>
        </a>

        <button onClick={onOrderOpen}
          aria-label={`Ver pedido${itemCount > 0 ? ` (${itemCount})` : ""}`}
          style={{
            position: "relative", width: 36, height: 36,
            background: "rgba(244,234,219,0.1)", color: "#F4EADB",
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
            border: "none", cursor: "pointer",
          }}>
          <ShoppingBag size={17} />
          {itemCount > 0 && (
            <span style={{
              position: "absolute", top: -3, right: -3, minWidth: 16, height: 16, padding: "0 4px",
              background: "#D0551F", color: "#F4EADB", fontSize: 9, fontWeight: 700,
              borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-body)",
            }}>{itemCount}</span>
          )}
        </button>
      </div>

      {/* Subtítulo integrado — reemplaza la apertura enorme */}
      {!scrolled && (
        <div style={{ paddingBottom: 16 }}>
          <p style={{
            fontFamily: "var(--font-display)", fontWeight: 600,
            fontSize: "clamp(20px, 5vw, 28px)", color: "#F4EADB",
            lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 4,
          }}>
            Frutos secos y dulces por kilo.
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 12,
            color: "rgba(244,234,219,0.4)",
          }}>
            Santa Cruz · Despacho martes y viernes
          </p>
        </div>
      )}
    </header>
  );
}
