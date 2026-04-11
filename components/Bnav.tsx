"use client";

import { WA } from "@/lib/products";

interface Props {
  onCartOpen: () => void;
}

export default function Bnav({ onCartOpen }: Props) {
  return (
    <>
      <nav aria-label="Navegación principal" style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        display: "flex",
        justifyContent: "space-around",
        padding: "6px 8px calc(6px + env(safe-area-inset-bottom))",
        background: "rgba(255,253,249,.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "2px solid rgba(0,0,0,.04)",
      }} className="bnav-mobile">
        <a href="/" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, color: "var(--text)", padding: "6px 14px", borderRadius: 12 }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Inicio
        </a>
        <a href="#faq" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, color: "var(--sub)", padding: "6px 14px", borderRadius: 12 }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Preguntas
        </a>
        <button
          onClick={onCartOpen}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, color: "var(--sub)", padding: "6px 14px", borderRadius: 12, background: "none", border: "none", cursor: "pointer" }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
          </svg>
          Pedir
        </button>
      </nav>
      <style>{`
        @media (min-width: 768px) { .bnav-mobile { display: none !important; } }
      `}</style>
    </>
  );
}
