"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ShoppingBag from "./icons/ShoppingBag";
import { useCartStore } from "@/lib/store";

interface HeaderProps {
  onOrderOpen: () => void;
}

/**
 * Header Apple-style.
 * - Glass blur sutil en blanco translúcido.
 * - Altura compacta 48px (Apple usa 44-52px en sus headers globales).
 * - Logo + wordmark izq · nav center · cart icon der.
 * - Sin animaciones gimmick. Restraint.
 */
export default function Header({ onOrderOpen }: HeaderProps) {
  const [hydrated, setHydrated] = useState(false);
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
    useCartStore.persist.rehydrate();
  }, []);

  const itemCount = hydrated ? items.length : 0;

  return (
    <header className="hd">
      <div className="hd-row">
        <Link href="/" className="hd-logo" aria-label="Estación Snack — inicio">
          <Image src="/img/logo-icon.svg" alt="" width={28} height={28} className="hd-logo-icon" priority />
          <span className="hd-logo-text">Estación Snack</span>
        </Link>

        <nav className="hd-nav" aria-label="Principal">
          <Link href="/#productos">Productos</Link>
          <Link href="/#packs">Packs</Link>
          <Link href="/envios">Envíos</Link>
          <Link href="/contacto">Contacto</Link>
        </nav>

        <button
          type="button"
          onClick={onOrderOpen}
          aria-label={`Bolsa${itemCount > 0 ? ` (${itemCount})` : ""}`}
          className="hd-cart"
        >
          <ShoppingBag size={20} />
          {itemCount > 0 && (
            <span className="hd-cart-badge" aria-hidden="true">{itemCount}</span>
          )}
        </button>
      </div>

      <style>{`
        .hd {
          background: rgba(251, 248, 243, 0.85);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          border-bottom: 1px solid rgba(26, 24, 21, 0.08);
        }
        .hd-row {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.25rem;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .hd-logo {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #1d1d1f;
          font-weight: 600;
          flex-shrink: 0;
          font-size: 0.875rem;
          letter-spacing: -0.014em;
        }
        .hd-logo-icon { border-radius: 6px; }
        .hd-logo-text { white-space: nowrap; }

        .hd-nav {
          display: none;
          gap: 2rem;
          font-size: 12px;
          font-weight: 400;
          color: #1d1d1f;
          letter-spacing: -0.005em;
        }
        .hd-nav a {
          color: inherit;
          opacity: 0.85;
          transition: opacity 0.15s ease;
        }
        .hd-nav a:hover { opacity: 1; }

        .hd-cart {
          position: relative;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1d1d1f;
          background: transparent;
          border: none;
          border-radius: 50%;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }
        .hd-cart:hover { background: rgba(0, 0, 0, 0.05); }
        .hd-cart-badge {
          position: absolute;
          top: 1px;
          right: 0;
          min-width: 16px;
          height: 16px;
          padding: 0 4px;
          background: #1d1d1f;
          color: #fff;
          font-size: 9px;
          font-weight: 600;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-variant-numeric: tabular-nums;
          line-height: 1;
        }

        @media (min-width: 768px) {
          .hd-row { padding: 0 1.5rem; height: 56px; }
          .hd-nav { display: flex; }
          .hd-logo-text { font-size: 0.9375rem; }
        }
        @media (min-width: 1100px) {
          .hd-row { padding: 0 2rem; }
        }
      `}</style>
    </header>
  );
}
