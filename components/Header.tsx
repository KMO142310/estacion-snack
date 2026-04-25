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
 * Header retail-clean (referencia: grupoalval.com).
 * - Logo izquierda + nav center + cart-icon derecha.
 * - Fondo blanco, borde inferior.
 * - Sin animaciones extra: visible y funcional.
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
          <Image src="/img/logo-icon.svg" alt="" width={36} height={36} className="hd-logo-icon" />
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
          aria-label={`Tu pedido${itemCount > 0 ? ` (${itemCount} ${itemCount === 1 ? "ítem" : "ítems"})` : ""}`}
          className="hd-cart"
        >
          <ShoppingBag size={22} />
          {itemCount > 0 && (
            <span className="hd-cart-badge" aria-hidden="true">{itemCount}</span>
          )}
        </button>
      </div>

      <style>{`
        .hd {
          background: #ffffff;
          border-bottom: 1px solid #e6e6e6;
        }
        .hd-row {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .hd-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #000;
          font-weight: 700;
          flex-shrink: 0;
        }
        .hd-logo-icon { border-radius: 8px; }
        .hd-logo-text {
          font-size: 1rem;
          letter-spacing: -0.01em;
        }

        .hd-nav {
          display: none;
          gap: 1.75rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: #000;
        }
        .hd-nav a {
          color: inherit;
          padding: 6px 0;
          border-bottom: 2px solid transparent;
          transition: border-color 0.15s ease, color 0.15s ease;
        }
        .hd-nav a:hover {
          border-bottom-color: #000;
        }

        .hd-cart {
          position: relative;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          background: transparent;
          border: none;
          border-radius: 4px;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }
        .hd-cart:hover { background: #f0f0f0; }
        .hd-cart-badge {
          position: absolute;
          top: 4px;
          right: 2px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          background: #000;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-variant-numeric: tabular-nums;
        }

        @media (min-width: 768px) {
          .hd-row { padding: 0 1.5rem; height: 72px; }
          .hd-nav { display: flex; }
          .hd-logo-text { font-size: 1.0625rem; }
        }
      `}</style>
    </header>
  );
}
