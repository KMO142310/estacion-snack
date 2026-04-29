"use client";

import { useState } from "react";
import Image from "next/image";
import { fmtDisplayPrice } from "@/lib/cart-utils";
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
    cat_label,
  } = product;
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const setOrderOpen = useCartStore((s) => s.setOrderOpen);
  const items = useCartStore((s) => s.items);
  const agotado = status === "agotado";
  const ultimaBolsa = status === "ultimo_kg";
  const currentQty = items.find((it) => it.kind === "product" && it.id === product.id)?.qty ?? 0;
  const remainingQty = Math.max(0, stock_kg - currentQty);
  const display = fmtDisplayPrice(price, min_unit_kg, format_short);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (agotado || added || remainingQty < min_unit_kg) return;
    addItem({ kind: "product", id: product.id, qty: min_unit_kg, name, pricePerUnit: price });
    addToast(`${name} agregado`);
    setAdded(true);
    setTimeout(() => setOrderOpen(true), 280);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="pc">
      <button
        type="button"
        onClick={agotado ? undefined : onOpen}
        disabled={agotado}
        aria-label={agotado ? `${name} — agotado` : `Ver detalle de ${name}`}
        className="pc-link"
      >
        <div className="pc-img">
          <Image
            src={image_webp_url}
            alt={name}
            fill
            sizes="(max-width:700px) 50vw, 33vw"
            style={{ objectFit: "contain" }}
          />
          {agotado && <span className="pc-tag pc-tag-out">Agotado</span>}
          {!agotado && ultimaBolsa && <span className="pc-tag pc-tag-promo">Última unidad</span>}
          {!agotado && !ultimaBolsa && badge && <span className="pc-tag pc-tag-new">{badge}</span>}
        </div>

        <div className="pc-info">
          {cat_label && <p className="pc-cat">{cat_label}</p>}
          <p className="pc-name">{name}</p>
          <p className="pc-price">
            <span className="pc-price-main">{display.price}</span>
            <span className="pc-price-unit"> · {format_short}</span>
          </p>
        </div>
      </button>

      {!agotado && (
        <button
          type="button"
          onClick={handleAdd}
          className="pc-add"
          aria-label={`Agregar ${name} a la bolsa`}
        >
          {added ? "Agregado" : "Agregar"}
        </button>
      )}

      <style>{`
        .pc { display: flex; flex-direction: column; }
        .pc-link {
          display: block;
          text-align: left;
          background: transparent;
          padding: 0;
          width: 100%;
          color: inherit;
        }
        .pc-img {
          position: relative;
          aspect-ratio: 1/1;
          background: var(--surface-1);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: transform var(--dur-slow) var(--ease-emphasized);
        }
        .pc-link:hover .pc-img { transform: scale(1.02); }
        .pc-link:disabled { cursor: not-allowed; opacity: 0.6; }

        .pc-tag {
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
        .pc-tag-promo,
        .pc-tag-new   { background: var(--text); color: var(--text-inverse); }
        .pc-tag-out   {
          background: color-mix(in oklch, var(--text) 70%, transparent);
          color: var(--text-inverse);
        }

        .pc-info {
          padding: var(--space-4) var(--space-1) 0;
          text-align: center;
        }
        .pc-cat {
          font-family: var(--font-display);
          font-style: italic;
          font-size: var(--fs-xs);
          font-weight: 400;
          color: var(--accent);
          margin: 0 0 var(--space-1);
        }
        .pc-name {
          font-size: var(--fs-md);
          font-weight: 500;
          color: var(--text);
          margin: 0 0 var(--space-1);
          line-height: var(--lh-snug);
          letter-spacing: var(--tracking-snug);
        }
        .pc-price {
          font-size: var(--fs-sm);
          color: var(--text);
          margin: 0;
          font-variant-numeric: tabular-nums;
        }
        .pc-price-main { font-weight: 500; }
        .pc-price-unit { color: var(--text-soft); }

        .pc-add {
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
        .pc-add:hover { background: var(--burdeo); }
        .pc-add:active { transform: scale(0.97); }
      `}</style>
    </article>
  );
}
