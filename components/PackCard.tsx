"use client";

import { useState } from "react";
import Image from "next/image";
import { fmt } from "@/lib/cart-utils";
import { useCartStore } from "@/lib/store";
import { computeSavings, getPackAvailability, type Pack, type ProductStock } from "@/lib/pack-utils";

interface Props {
  pack: Pack;
  products: ProductStock[];
  onOpen: () => void;
}

export default function PackCard({ pack, products, onOpen }: Props) {
  const { savings } = computeSavings(pack);
  const { units, limitingComponent } = getPackAvailability(pack, products);
  const isAgotado = units === 0;
  const isLast = units <= 2 && units > 0;
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const setOrderOpen = useCartStore((s) => s.setOrderOpen);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAgotado || added) return;
    addItem({ kind: "pack", id: pack.id, qty: 1, name: pack.name, pricePerUnit: pack.price });
    addToast(`${pack.name} agregado`);
    setAdded(true);
    setTimeout(() => setOrderOpen(true), 280);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="pkc">
      <button
        type="button"
        onClick={isAgotado ? undefined : onOpen}
        disabled={isAgotado}
        aria-label={isAgotado ? `${pack.name} — agotado` : `Ver detalle de ${pack.name}`}
        className="pkc-link"
      >
        <div className="pkc-img">
          <Image
            src={pack.image_webp_url}
            alt={pack.name}
            fill
            sizes="(max-width: 700px) 100vw, 33vw"
            style={{ objectFit: "contain" }}
          />
          {isAgotado && (
            <span className="pkc-tag pkc-tag-out">
              Agotado{limitingComponent ? ` · sin ${limitingComponent}` : ""}
            </span>
          )}
          {!isAgotado && isLast && (
            <span className="pkc-tag pkc-tag-promo">
              {units === 1 ? "Última unidad" : `Últimas ${units} unidades`}
            </span>
          )}
          {!isAgotado && !isLast && pack.badge && (
            <span className="pkc-tag pkc-tag-new">{pack.badge}</span>
          )}
        </div>

        <div className="pkc-info">
          <p className="pkc-cat">Pack</p>
          <p className="pkc-name">{pack.name}</p>
          <p className="pkc-tagline">{pack.tagline}</p>
          <p className="pkc-price">
            <span className="pkc-price-main">{fmt(pack.price)}</span>
            {savings > 0 && <span className="pkc-price-aside">Ahorras {fmt(savings)}</span>}
          </p>
        </div>
      </button>

      {!isAgotado ? (
        <button
          type="button"
          onClick={handleAdd}
          className="pkc-add"
          aria-label={`Agregar ${pack.name} a la bolsa`}
        >
          {added ? "Agregado" : "Agregar"}
        </button>
      ) : (
        <p className="pkc-out">Sin stock</p>
      )}

      <style>{`
        .pkc { display: flex; flex-direction: column; }
        .pkc-link {
          display: block;
          text-align: left;
          background: transparent;
          padding: 0;
          width: 100%;
          color: inherit;
        }
        .pkc-link:disabled { cursor: not-allowed; opacity: 0.6; }
        .pkc-img {
          position: relative;
          aspect-ratio: 1/1;
          background: var(--surface-1);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: transform var(--dur-slow) var(--ease-emphasized);
        }
        .pkc-link:hover .pkc-img { transform: scale(1.02); }

        .pkc-tag {
          position: absolute;
          top: var(--space-3);
          left: var(--space-3);
          z-index: var(--z-raised);
          padding: 4px 10px;
          font-size: var(--fs-xs);
          font-weight: 500;
          letter-spacing: var(--tracking-normal);
          border-radius: var(--radius-full);
        }
        .pkc-tag-promo,
        .pkc-tag-new   { background: var(--text); color: var(--text-inverse); }
        .pkc-tag-out   {
          background: color-mix(in oklch, var(--text) 70%, transparent);
          color: var(--text-inverse);
        }

        .pkc-info {
          padding: var(--space-4) var(--space-1) 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .pkc-cat {
          font-family: var(--font-display);
          font-style: italic;
          font-size: var(--fs-xs);
          font-weight: 400;
          color: var(--accent);
          margin: 0;
        }
        .pkc-name {
          font-size: var(--fs-md);
          font-weight: 500;
          color: var(--text);
          margin: 0;
          line-height: var(--lh-snug);
          letter-spacing: var(--tracking-snug);
        }
        .pkc-tagline {
          font-size: var(--fs-sm);
          color: var(--text-soft);
          margin: 0 0 var(--space-1);
          line-height: var(--lh-normal);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pkc-price {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          margin: 0;
          font-variant-numeric: tabular-nums;
        }
        .pkc-price-main {
          font-size: var(--fs-sm);
          font-weight: 500;
          color: var(--text);
        }
        .pkc-price-aside {
          font-size: var(--fs-xs);
          color: var(--text-soft);
        }

        .pkc-add {
          margin-top: var(--space-4);
          align-self: center;
          min-height: 44px;
          min-width: 120px;
          padding: var(--space-2) var(--space-5);
          background: var(--text);
          color: var(--text-inverse);
          font-size: var(--fs-sm);
          font-weight: 500;
          letter-spacing: var(--tracking-normal);
          border: none;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: background var(--dur-base) var(--ease-standard),
                      transform var(--dur-fast) var(--ease-spring);
        }
        .pkc-add:hover { background: var(--burdeo); }
        .pkc-add:active { transform: scale(0.97); }

        .pkc-out {
          margin-top: var(--space-4);
          align-self: center;
          padding: var(--space-2) var(--space-4);
          font-size: var(--fs-sm);
          font-weight: 500;
          color: var(--text-soft);
        }
      `}</style>
    </article>
  );
}
