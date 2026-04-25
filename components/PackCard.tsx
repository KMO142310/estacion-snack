"use client";

import { useState } from "react";
import Image from "next/image";
import { fmt } from "@/lib/cart-utils";
import { useCartStore } from "@/lib/store";
import { computeSavings, totalKg, getPackAvailability, type Pack, type ProductStock } from "@/lib/pack-utils";

interface Props {
  pack: Pack;
  products: ProductStock[];
  onOpen: () => void;
}

/**
 * PackCard retail-clean — MISMO lenguaje que ProductCard nuevo.
 * Sin StampButton terracota serif, sin precio duplicado en CTA.
 */
export default function PackCard({ pack, products, onOpen }: Props) {
  const { savings } = computeSavings(pack);
  const kg = totalKg(pack);
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
    // Abre el cart sheet para feedback visible — sin esto el click parece no hacer nada.
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
            style={{ objectFit: "cover" }}
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
            <span className="pkc-price-aside">{kg} kg · ahorras {fmt(savings)}</span>
          </p>
        </div>
      </button>

      {!isAgotado ? (
        <button
          type="button"
          onClick={handleAdd}
          className="pkc-add"
          aria-label={`Agregar ${pack.name} al carro`}
        >
          {added ? "Agregado ✓" : "Agregar al carro"}
        </button>
      ) : (
        <p className="pkc-out">Momentáneamente agotado</p>
      )}

      <style>{`
        .pkc {
          background: #fff;
          display: flex;
          flex-direction: column;
        }
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
          background: #FAF9F7;
          overflow: hidden;
        }
        .pkc-link:hover .pkc-img img { transform: scale(1.03); }
        .pkc-img img { transition: transform 0.4s ease; }

        .pkc-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 2;
          padding: 4px 10px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 2px;
        }
        .pkc-tag-promo { background: #EFD200; color: #000; }
        .pkc-tag-new   { background: #000;    color: #fff; }
        .pkc-tag-out   { background: #555;    color: #fff; }

        .pkc-info {
          padding: 0.85rem 0 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pkc-cat {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888;
          margin: 0;
        }
        .pkc-name {
          font-size: 0.9375rem;
          font-weight: 500;
          color: #000;
          margin: 0;
          line-height: 1.3;
        }
        .pkc-tagline {
          font-size: 0.8125rem;
          color: #555;
          margin: 0 0 4px;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pkc-price {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
          margin: 0;
          font-variant-numeric: tabular-nums;
        }
        .pkc-price-main {
          font-size: 1rem;
          font-weight: 700;
          color: #000;
        }
        .pkc-price-aside {
          font-size: 11.5px;
          color: #888;
          font-weight: 500;
        }

        .pkc-add {
          margin-top: 0.85rem;
          width: 100%;
          background: #000;
          color: #fff;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .pkc-add:hover { background: #333; }

        .pkc-out {
          margin-top: 0.85rem;
          padding: 0.75rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #888;
          text-align: center;
          background: #f0f0f0;
          border-radius: 4px;
        }
      `}</style>
    </article>
  );
}
