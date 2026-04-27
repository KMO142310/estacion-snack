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
        .pkc-img {
          position: relative;
          aspect-ratio: 1/1;
          background: #F1ECE2;
          border-radius: 18px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        .pkc-link:hover .pkc-img { transform: scale(1.02); }

        .pkc-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: -0.005em;
          border-radius: 999px;
        }
        .pkc-tag-promo { background: #1d1d1f; color: #ffffff; }
        .pkc-tag-new   { background: #1d1d1f; color: #ffffff; }
        .pkc-tag-out   { background: rgba(29,29,31,0.7); color: #ffffff; }

        .pkc-info {
          padding: 1rem 4px 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pkc-cat {
          font-family: var(--font-fraunces), Georgia, serif;
          font-style: italic;
          font-size: 13px;
          font-weight: 400;
          color: #A8411A;
          margin: 0;
        }
        .pkc-name {
          font-size: 1.0625rem;
          font-weight: 500;
          color: #1d1d1f;
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.014em;
        }
        .pkc-tagline {
          font-size: 0.8125rem;
          color: #6e6e73;
          margin: 0 0 4px;
          line-height: 1.4;
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
          font-size: 0.9375rem;
          font-weight: 500;
          color: #1d1d1f;
        }
        .pkc-price-aside {
          font-size: 11.5px;
          color: #6e6e73;
        }

        .pkc-add {
          margin-top: 1rem;
          align-self: center;
          padding: 0.625rem 1.5rem;
          background: #1d1d1f;
          color: #ffffff;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: -0.005em;
          border: none;
          border-radius: 980px;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
          min-width: 120px;
        }
        .pkc-add:hover { background: #424245; }
        .pkc-add:active { transform: scale(0.97); }

        .pkc-out {
          margin-top: 1rem;
          align-self: center;
          padding: 0.625rem 1rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #6e6e73;
        }
      `}</style>
    </article>
  );
}
