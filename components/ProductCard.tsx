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

/**
 * ProductCard retail-clean (referencia: grupoalval.com).
 * - Foto cuadrada blanca, packshot.
 * - Nombre + precio + botón "Agregar al carro" negro.
 * - Badge amarillo (#EFD200) para "Última unidad" / promo.
 * - Sin stickers, sin confetti, sin hover-tilt elaborado.
 *   Comportamiento de Shopify estándar.
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
    cat_label,
  } = product;
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
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
            style={{ objectFit: "cover" }}
          />
          {agotado && (
            <span className="pc-tag pc-tag-out">Agotado</span>
          )}
          {!agotado && ultimaBolsa && (
            <span className="pc-tag pc-tag-promo">Última unidad</span>
          )}
          {!agotado && !ultimaBolsa && badge && (
            <span className="pc-tag pc-tag-new">{badge}</span>
          )}
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
          aria-label={`Agregar ${name} al carro`}
        >
          {added ? "Agregado ✓" : "Agregar al carro"}
        </button>
      )}

      <style>{`
        .pc {
          background: #fff;
          display: flex;
          flex-direction: column;
        }
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
          background: #FAF9F7;
          overflow: hidden;
        }
        .pc-link:hover .pc-img img {
          transform: scale(1.03);
        }
        .pc-img img { transition: transform 0.4s ease; }

        .pc-tag {
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
        .pc-tag-promo { background: #EFD200; color: #000; }
        .pc-tag-new   { background: #000;    color: #fff; }
        .pc-tag-out   { background: #555;    color: #fff; }

        .pc-info {
          padding: 0.85rem 0 0;
        }
        .pc-cat {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888;
          margin: 0 0 4px;
        }
        .pc-name {
          font-size: 0.9375rem;
          font-weight: 500;
          color: #000;
          margin: 0 0 4px;
          line-height: 1.3;
        }
        .pc-price {
          font-size: 0.9375rem;
          color: #000;
          margin: 0;
          font-variant-numeric: tabular-nums;
        }
        .pc-price-main { font-weight: 700; }
        .pc-price-unit {
          font-weight: 500;
          color: #888;
        }

        .pc-add {
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
        .pc-add:hover { background: #333; }

        @media (hover: hover) {
          .pc-link:hover { opacity: 1; }
        }
      `}</style>
    </article>
  );
}
