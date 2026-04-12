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
    <header className="brand-header" style={{
      position: "sticky", top: 0, zIndex: 200,
      background: "#5A1F1A",
      padding: "0 16px",
      transform: visible ? "translateY(0)" : "translateY(-100%)",
      transition: "transform 0.25s ease",
    }}>
      {/* Logo: isotipo almendra + wordmark con peso diferencial */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
        <a href="/" className="logo-link" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          {/* Isotipo almendra */}
          <svg width={26} height={26} viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <ellipse cx="20" cy="20" rx="17" ry="13" stroke="#F4EADB" strokeWidth="2.2" transform="rotate(-8 20 20)" />
            <path d="M8,17 C11,11 17,10 20,20 C23,30 27,29 32,23" stroke="#D0551F" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {/* Wordmark: peso 800 vs 300 */}
          <span style={{ fontFamily: "var(--font-display)", fontSize: 17, letterSpacing: "-0.02em", lineHeight: 1 }}>
            <span style={{ fontWeight: 800, color: "#F4EADB" }}>estación</span>
            <span style={{ fontWeight: 300, color: "rgba(244,234,219,0.5)", marginLeft: 4 }}>snack</span>
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


      <style>{`
        .brand-header {
          background-image: radial-gradient(circle, rgba(244,234,219,0.04) 1px, transparent 1px);
          background-size: 14px 14px;
        }
        .logo-link:hover svg { transform: rotate(4deg); transition: transform 0.3s ease; }
      `}</style>
    </header>
  );
}
