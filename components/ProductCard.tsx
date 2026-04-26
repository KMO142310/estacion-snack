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
          background: #f5f5f7;
          border-radius: 18px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        .pc-link:hover .pc-img { transform: scale(1.02); }

        .pc-tag {
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
        .pc-tag-promo { background: #1d1d1f; color: #ffffff; }
        .pc-tag-new   { background: #1d1d1f; color: #ffffff; }
        .pc-tag-out   { background: rgba(29,29,31,0.7); color: #ffffff; }

        .pc-info {
          padding: 1rem 4px 0;
          text-align: center;
        }
        .pc-cat {
          font-size: 11px;
          font-weight: 500;
          color: #6e6e73;
          margin: 0 0 4px;
        }
        .pc-name {
          font-size: 1.0625rem;
          font-weight: 500;
          color: #1d1d1f;
          margin: 0 0 4px;
          line-height: 1.2;
          letter-spacing: -0.014em;
        }
        .pc-price {
          font-size: 0.9375rem;
          color: #1d1d1f;
          margin: 0;
          font-variant-numeric: tabular-nums;
        }
        .pc-price-main { font-weight: 500; }
        .pc-price-unit { color: #6e6e73; }

        .pc-add {
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
        .pc-add:hover { background: #424245; }
        .pc-add:active { transform: scale(0.97); }
      `}</style>
    </article>
  );
}
