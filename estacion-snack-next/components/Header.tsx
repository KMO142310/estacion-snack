"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { WA } from "@/lib/products";

interface HeaderProps {
  onCartOpen: () => void;
}

export default function Header({ onCartOpen }: HeaderProps) {
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255,253,249,.9)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: scrolled ? "8px 20px" : "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "2px solid rgba(0,0,0,.04)",
        transition: "padding .3s ease, box-shadow .3s ease",
        boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,.06)" : "none",
      }}
    >
      <a
        href="/"
        style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "clamp(18px, 5vw, 22px)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          minWidth: 0,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
        aria-label="Estación Snack — Inicio"
      >
        <img
          src="/img/logo-icon.svg"
          alt="Estación Snack"
          width={32}
          height={32}
          style={{ borderRadius: 8, flexShrink: 0 }}
        />
        Estación Snack
      </a>

      <nav style={{ display: "none" }} className="nav-desktop-show">
        <a href="#combos" style={{ fontSize: 14, fontWeight: 600, color: "var(--sub)", borderRadius: "var(--r-full)", padding: "8px 16px" }}>Packs</a>
        <a href="#productos" style={{ fontSize: 14, fontWeight: 600, color: "var(--sub)", borderRadius: "var(--r-full)", padding: "8px 16px" }}>Productos</a>
        <a href="#faq" style={{ fontSize: 14, fontWeight: 600, color: "var(--sub)", borderRadius: "var(--r-full)", padding: "8px 16px" }}>Preguntas</a>
      </nav>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <a
          href={`https://wa.me/${WA}?text=Hola!%20Quiero%20pedir%20%F0%9F%8C%B0`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-wa-sm-show"
          style={{
            display: "none",
            alignItems: "center",
            gap: 6,
            padding: "10px 20px",
            background: "#25D366",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            borderRadius: "var(--r-full)",
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </a>

        <button
          onClick={onCartOpen}
          aria-label="Ver pedido"
          style={{
            position: "relative",
            width: 44,
            height: 44,
            background: "var(--text)",
            color: "#fff",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {totalItems > 0 && (
            <span style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 20,
              height: 20,
              padding: "0 6px",
              background: "var(--orange)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 800,
              borderRadius: "var(--r-full)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--bg)",
            }}>
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .nav-desktop-show { display: flex !important; gap: 24px; }
          .btn-wa-sm-show { display: flex !important; }
        }
        .nav-desktop-show a:hover { color: var(--text) !important; background: rgba(0,0,0,.04); }
      `}</style>
    </header>
  );
}
