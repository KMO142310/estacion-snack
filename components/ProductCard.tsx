"use client";

import { useState } from "react";
import Image from "next/image";
import { fmt, fmtDisplayPrice } from "@/lib/cart-utils";
import { useCartStore } from "@/lib/store";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  stock_kg: number;
  image_webp_url: string;
  image_url: string;
  badge: string | null;
  status: string;
  copy?: string;
  occasion?: string | null;
  min_unit_kg?: number;
  format_short?: string;
  format_label?: string;
  cat_label?: string;
}

interface Props {
  product: Product;
  onOpen: () => void;
}

/**
 * ProductCard editorial — no marketplace tile.
 *
 * Cambios vs v anterior:
 * - aspect-ratio 1/1 (era 3/4) → foto más grande, menos tile-y.
 * - blurb (`copy`) visible en la card → ya no es solo "nombre + precio".
 * - "Bolsa sellada · X" como label honesto, no "1 kg" ambiguo.
 * - Tag de categoría arriba (Frutos secos / Dulces) en vez de badge solo.
 * - CTA inline secundario, no StampButton chillón.
 * - Background coloreado en la foto (compensa las fotos de packshot blanco).
 */
export default function ProductCard({ product, onOpen }: Props) {
  const {
    name,
    price,
    image_webp_url,
    badge,
    status,
    stock_kg,
    min_unit_kg = 1,
    format_short = "1 kg",
    copy,
    cat_label,
  } = product;
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const items = useCartStore((s) => s.items);
  const agotado = status === "agotado";
  const ultimaBolsa = status === "ultimo_kg";
  const currentQty = items.find((item) => item.kind === "product" && item.id === product.id)?.qty ?? 0;
  const remainingQty = Math.max(0, stock_kg - currentQty);
  const display = fmtDisplayPrice(price, min_unit_kg, format_short);
  const unitPrice = fmt(price);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (agotado || added || remainingQty < min_unit_kg) return;
    addItem({ kind: "product", id: product.id, qty: min_unit_kg, name, pricePerUnit: price });
    addToast(`${name} · 1 bolsa`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="pc" style={{ opacity: agotado ? 0.45 : 1 }}>
      <button
        type="button"
        onClick={agotado ? undefined : onOpen}
        disabled={agotado}
        aria-label={agotado ? `${name} — agotado` : `Ver detalle de ${name}`}
        className="pc-btn"
      >
        <div className="pc-img-wrap img-warm-frame">
          <Image
            src={image_webp_url}
            alt=""
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            style={{ objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
            className="pc-img"
          />
          {(badge || ultimaBolsa) && (
            <span className="pc-badge" style={{ background: ultimaBolsa ? "#5A1F1A" : "rgba(168,65,26,0.92)" }}>
              {badge || "Última bolsa"}
            </span>
          )}
          {cat_label && (
            <span className="pc-cat" aria-hidden="true">{cat_label}</span>
          )}
        </div>

        <div className="pc-info">
          <h3 className="pc-name">{name}</h3>
          {copy && <p className="pc-copy">{copy}</p>}

          <div className="pc-meta">
            <div className="pc-price-block">
              <span className="pc-price-main">{agotado ? "Agotado" : display.price}</span>
              {!agotado && (
                <span className="pc-price-unit">{display.unit}</span>
              )}
            </div>
            {!agotado && min_unit_kg < 1 && (
              <span className="pc-price-aside">
                ({fmt(price)} / kg)
              </span>
            )}
            {!agotado && min_unit_kg >= 1 && (
              <span className="pc-price-aside">
                ({unitPrice} / kg)
              </span>
            )}
          </div>
        </div>
      </button>

      {!agotado && (
        <button
          type="button"
          onClick={handleAdd}
          className="pc-add"
          style={{ background: added ? "#5E6B3E" : undefined }}
          aria-label={`Agregar 1 bolsa de ${name} al pedido`}
        >
          {added ? "✓ Agregado al pedido" : "Agregar 1 bolsa"}
          {!added && (
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          )}
        </button>
      )}

      <style>{`
        .pc {
          display: flex;
          flex-direction: column;
          gap: 0;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pc-btn {
          text-align: left;
          width: 100%;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          margin-bottom: 14px;
        }
        .pc-img-wrap {
          position: relative;
          aspect-ratio: 1/1;
          border-radius: 18px;
          overflow: hidden;
          background:
            radial-gradient(circle at 30% 20%, rgba(168,65,26,0.06), transparent 60%),
            #EDE4D6;
          margin-bottom: 18px;
        }
        @media (hover: hover) {
          .pc:hover { transform: translateY(-3px); }
          .pc:hover .pc-img { transform: scale(1.06); }
        }
        .pc-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 2;
          color: #F4EADB;
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 6px 12px;
          border-radius: 999px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .pc-cat {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 2;
          color: rgba(90,31,26,0.78);
          background: rgba(255,249,241,0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 5px 10px;
          border-radius: 999px;
        }
        .pc-info {
          padding: 0 4px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pc-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(1.2rem, 2.4vw, 1.45rem);
          color: #5A1F1A;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .pc-copy {
          font-family: var(--font-body);
          font-size: 0.875rem;
          line-height: 1.55;
          color: rgba(90,31,26,0.65);
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pc-meta {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 6px;
          margin-top: 4px;
          border-top: 1px solid rgba(90,31,26,0.08);
        }
        .pc-price-block {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .pc-price-main {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.15rem;
          color: #5A1F1A;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .pc-price-unit {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: rgba(90,31,26,0.6);
          margin-top: 3px;
        }
        .pc-price-aside {
          font-family: var(--font-body);
          font-size: 11px;
          color: rgba(90,31,26,0.45);
          margin-left: auto;
          font-variant-numeric: tabular-nums;
          align-self: flex-end;
        }

        .pc-add {
          margin-top: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.9375rem;
          color: #F4EADB;
          background: #5A1F1A;
          padding: 0.85rem 1.25rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        @media (hover: hover) {
          .pc-add:hover {
            background: #3d1613;
            transform: translateY(-2px);
          }
        }
      `}</style>
    </article>
  );
}
