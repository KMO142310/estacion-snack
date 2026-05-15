"use client";

import { useState } from "react";
import Image from "next/image";
import { fmt } from "@/lib/cart-utils";
import { useCartStore } from "@/lib/store";
import { computeSavings, getPackAvailability, totalKg, type Pack, type ProductStock } from "@/lib/pack-utils";

interface Props {
  pack: Pack;
  products: ProductStock[];
  onOpen: () => void;
}

export default function PackCard({ pack, products, onOpen }: Props) {
  const { savings, sueltoTotal } = computeSavings(pack);
  const { units, limitingComponent } = getPackAvailability(pack, products);
  const isAgotado = units === 0;
  const isLast = units <= 2 && units > 0;
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const setOrderOpen = useCartStore((s) => s.setOrderOpen);
  const totalWeight = totalKg(pack);

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
      <div className="pkc-shell">
        <button
          type="button"
          onClick={isAgotado ? undefined : onOpen}
          disabled={isAgotado}
          aria-label={isAgotado ? `${pack.name} — agotado` : `Ver detalle de ${pack.name}`}
          className="pkc-link"
        >
          <div className="pkc-media">
            <div className="pkc-topline">
              <span className="pkc-topline-label">Pack listo</span>
              <span className="pkc-topline-meta">{totalWeight} kg total</span>
            </div>

            <div className="pkc-img">
              <Image
                src={pack.image_400_url || pack.image_webp_url}
                alt={pack.name}
                fill
                sizes="(max-width: 700px) 92vw, 33vw"
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
          </div>

          <div className="pkc-info">
            <div className="pkc-copy">
              <p className="pkc-cat">Pack armado</p>
              <p className="pkc-name">{pack.name}</p>
              <p className="pkc-tagline">{pack.tagline}</p>
            </div>

            <div className="pkc-priceblock">
              <p className="pkc-price">
                <span className="pkc-price-main">{fmt(pack.price)}</span>
                <span className="pkc-price-unit">Pedido completo</span>
              </p>
              {savings > 0 ? (
                <p className="pkc-price-aside">
                  Suelto {fmt(sueltoTotal)} · ahorras {fmt(savings)}
                </p>
              ) : (
                <p className="pkc-price-aside">Armado para pedir más fácil por WhatsApp</p>
              )}
            </div>

            <div className="pkc-footer">
              <span className="pkc-detail-link">Ver detalle</span>
            </div>
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
      </div>

      <style>{`
        .pkc {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .pkc-shell {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          height: 100%;
          padding: 0.9rem;
          border-radius: 28px;
          background:
            radial-gradient(circle at top left, rgba(168, 65, 26, 0.08), transparent 34%),
            linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,241,231,0.96) 100%);
          border: 1px solid rgba(90, 31, 26, 0.08);
          box-shadow: 0 20px 42px -34px rgba(90, 31, 26, 0.38);
        }
        .pkc-link {
          display: flex;
          flex-direction: column;
          flex: 1;
          text-align: left;
          background: transparent;
          padding: 0;
          width: 100%;
          color: inherit;
          border: none;
        }
        .pkc-link:disabled { cursor: not-allowed; opacity: 0.6; }
        .pkc-media {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .pkc-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0 0.15rem;
        }
        .pkc-topline-label,
        .pkc-topline-meta {
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .pkc-topline-label { color: #A8411A; }
        .pkc-topline-meta { color: rgba(90, 31, 26, 0.54); }
        .pkc-img {
          position: relative;
          aspect-ratio: 1.08 / 1;
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.45), transparent 42%),
            linear-gradient(180deg, #F7F0E5 0%, #F0E6D9 100%);
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(90, 31, 26, 0.06);
          transition: transform var(--dur-slow) var(--ease-emphasized);
        }
        .pkc-link:hover .pkc-img { transform: scale(1.02); }

        .pkc-tag {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          z-index: var(--z-raised);
          padding: 0.36rem 0.68rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          border-radius: 999px;
        }
        .pkc-tag-promo,
        .pkc-tag-new   { background: var(--text); color: var(--text-inverse); }
        .pkc-tag-out   {
          background: color-mix(in oklch, var(--text) 70%, transparent);
          color: var(--text-inverse);
        }

        .pkc-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 0.75rem;
          padding: 0 0.15rem;
        }
        .pkc-copy {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .pkc-cat {
          font-family: var(--font-body);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent);
          margin: 0;
        }
        .pkc-name {
          font-family: var(--font-display);
          font-size: clamp(1.28rem, 5vw, 1.6rem);
          font-weight: 600;
          color: var(--text);
          margin: 0;
          line-height: 1.05;
          letter-spacing: -0.02em;
        }
        .pkc-tagline {
          font-size: 0.92rem;
          color: var(--text-soft);
          margin: 0;
          line-height: 1.58;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pkc-priceblock {
          display: grid;
          gap: 0.25rem;
          padding: 0.8rem 0 0;
          border-top: 1px solid rgba(90, 31, 26, 0.08);
        }
        .pkc-price {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.45rem;
          margin: 0;
          font-variant-numeric: tabular-nums;
        }
        .pkc-price-main {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text);
        }
        .pkc-price-unit {
          font-size: 0.8rem;
          color: rgba(90, 31, 26, 0.56);
        }
        .pkc-price-aside {
          margin: 0;
          font-size: 0.8rem;
          color: var(--text-soft);
          line-height: 1.5;
        }
        .pkc-footer {
          margin-top: auto;
          padding-top: 0.15rem;
        }
        .pkc-detail-link {
          display: inline-flex;
          font-size: 0.85rem;
          font-weight: 700;
          color: #A8411A;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .pkc-add {
          width: 100%;
          min-height: 46px;
          padding: 0 1rem;
          background: var(--text);
          color: var(--text-inverse);
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          transition: background var(--dur-base) var(--ease-standard),
                      transform var(--dur-fast) var(--ease-spring);
        }
        .pkc-add:hover { background: var(--burdeo); }
        .pkc-add:active { transform: scale(0.97); }

        .pkc-out {
          margin: 0;
          min-height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 1rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-soft);
          background: rgba(90,31,26,0.06);
          border-radius: 999px;
        }

        @media (min-width: 768px) {
          .pkc-shell {
            padding: 1rem;
          }
          .pkc-img {
            aspect-ratio: 1 / 1;
          }
          .pkc-name {
            font-size: clamp(1.34rem, 2vw, 1.55rem);
          }
        }
      `}</style>
    </article>
  );
}
