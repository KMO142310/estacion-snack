"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./icons/Logo";
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
        background: scrolled ? "rgba(244,234,219,0.94)" : "rgba(244,234,219,0.80)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: scrolled ? "10px 1.25rem" : "14px 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: scrolled ? "1px solid rgba(90,31,26,0.10)" : "1px solid transparent",
        transition: "padding 0.25s ease, border-color 0.25s ease, background 0.25s ease",
      }}
    >
      <Logo variant="horizontal" size="sm" />

      {/* Nav desktop */}
      <nav
        style={{ display: "none", gap: 4 }}
        className="nav-desktop"
        aria-label="Navegación principal"
      >
        <a href="#productos" className="nav-link">Mezclas</a>
        <a href="#packs" className="nav-link">Packs</a>
        <Link href="/sobre-nosotros" className="nav-link">Nosotros</Link>
        <Link href="/envios" className="nav-link">Envíos</Link>
        <Link href="/faq" className="nav-link">FAQ</Link>
        <Link href="/contacto" className="nav-link">Contacto</Link>
      </nav>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        {/* WhatsApp CTA — desktop */}
        <a
          href="https://wa.me/56953743338"
          target="_blank"
          rel="noopener noreferrer"
          className="wa-btn-desktop"
          style={{
            display: "none",
            alignItems: "center",
            gap: 6,
            padding: "9px 18px",
            background: "#D0551F",
            color: "#F4EADB",
            fontSize: "0.875rem",
            fontWeight: 600,
            borderRadius: "8px",
            fontFamily: "var(--font-body)",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          WhatsApp
        </a>

        {/* Cart button */}
        <button
          onClick={onOrderOpen}
          aria-label={`Ver pedido${itemCount > 0 ? ` (${itemCount} productos)` : ""}`}
          style={{
            position: "relative",
            width: 42,
            height: 42,
            background: "#5A1F1A",
            color: "#F4EADB",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            transition: "opacity 0.15s, transform 0.15s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          <ShoppingBag size={20} />
          {itemCount > 0 && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: -5,
                right: -5,
                minWidth: 18,
                height: 18,
                padding: "0 5px",
                background: "#D0551F",
                color: "#F4EADB",
                fontSize: 11,
                fontWeight: 700,
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #F4EADB",
                fontFamily: "var(--font-body)",
                lineHeight: 1,
              }}
            >
              {itemCount}
            </span>
          )}
        </button>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .nav-desktop { display: flex !important; }
          .wa-btn-desktop { display: flex !important; }
        }
        .nav-link {
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 500;
          color: #5E6B3E;
          padding: 8px 12px;
          border-radius: 8px;
          text-decoration: none;
          transition: color 0.15s, background 0.15s;
        }
        .nav-link:hover {
          color: #5A1F1A;
          background: rgba(90,31,26,0.06);
        }
      `}</style>
    </header>
  );
}
