"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
}

export default function ProductCard({ product }: Props) {
  const {
    slug,
    name,
    price,
    image_webp_url,
    image_url,
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

  const handleAdd = () => {
    if (agotado || added || remainingQty < min_unit_kg) return;
    addItem({ kind: "product", id: product.id, qty: min_unit_kg, name, pricePerUnit: price });
    addToast(`${name} agregado`);
    setAdded(true);
    setTimeout(() => setOrderOpen(true), 280);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="pc">
      <div className="pc-shell">
        <Link
          href={`/producto/${slug}`}
          aria-label={`Ver ficha de ${name}`}
          className="pc-link"
        >
          <div className="pc-media">
            <div className="pc-img">
              <Image
                src={image_webp_url || image_url}
                alt={`Imagen de ${name}`}
                fill
                sizes="(max-width:700px) 42vw, 33vw"
                style={{ objectFit: "contain" }}
              />
              {agotado && <span className="pc-tag pc-tag-out">Agotado</span>}
              {!agotado && ultimaBolsa && <span className="pc-tag pc-tag-promo">Última unidad</span>}
              {!agotado && !ultimaBolsa && badge && <span className="pc-tag pc-tag-new">{badge}</span>}
            </div>
          </div>

          <div className="pc-info">
            {cat_label && <p className="pc-cat">{cat_label}</p>}
            <p className="pc-name">{name}</p>
            <p className="pc-price">
              <span className="pc-price-main">{display.price}</span>
              <span className="pc-price-unit"> · {format_short}</span>
            </p>
            <span className="pc-detail-link">Ver ficha</span>
          </div>
        </Link>

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
      </div>

      <style>{`
        .pc {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .pc-shell {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          height: 100%;
          padding: 0.85rem;
          border-radius: 22px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 241, 231, 0.96) 100%);
          border: 1px solid rgba(90, 31, 26, 0.08);
          box-shadow: 0 18px 34px -30px rgba(90, 31, 26, 0.42);
        }
        .pc-link {
          display: flex;
          flex-direction: column;
          flex: 1;
          text-align: left;
          background: transparent;
          padding: 0;
          width: 100%;
          color: inherit;
          text-decoration: none;
        }
        .pc-media {
          position: relative;
        }
        .pc-img {
          position: relative;
          aspect-ratio: 1/1;
          background:
            radial-gradient(circle at top left, rgba(168, 65, 26, 0.08), transparent 38%),
            linear-gradient(180deg, #F7F0E5 0%, #F1E7D9 100%);
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(90, 31, 26, 0.06);
          transition: transform var(--dur-slow) var(--ease-emphasized);
        }
        .pc-link:hover .pc-img { transform: scale(1.02); }

        .pc-tag {
          position: absolute;
          top: 0.7rem;
          left: 0.7rem;
          z-index: var(--z-raised);
          padding: 0.34rem 0.62rem;
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          border-radius: var(--radius-full);
        }
        .pc-tag-promo,
        .pc-tag-new   { background: var(--text); color: var(--text-inverse); }
        .pc-tag-out   {
          background: color-mix(in oklch, var(--text) 70%, transparent);
          color: var(--text-inverse);
        }

        .pc-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 0.2rem;
          padding: 0 0.15rem;
          text-align: left;
        }
        .pc-cat {
          font-family: var(--font-body);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--accent);
          margin: 0 0 0.15rem;
        }
        .pc-name {
          font-family: var(--font-display);
          font-size: clamp(1rem, 3.7vw, 1.15rem);
          font-weight: 600;
          color: var(--text);
          margin: 0;
          line-height: 1.08;
          letter-spacing: var(--tracking-snug);
          min-height: 2.2em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pc-price {
          font-size: 0.875rem;
          color: var(--text);
          margin: 0.2rem 0 0;
          font-variant-numeric: tabular-nums;
          line-height: 1.35;
        }
        .pc-price-main {
          font-weight: 700;
          font-size: 0.98rem;
        }
        .pc-price-unit { color: var(--text-soft); }
        .pc-detail-link {
          display: inline-flex;
          margin-top: auto;
          padding-top: 0.7rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .pc-add {
          width: 100%;
          min-height: 46px;
          padding: 0 var(--space-4);
          background: var(--text);
          color: var(--text-inverse);
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: var(--tracking-normal);
          border: none;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: background var(--dur-base) var(--ease-standard),
                      transform var(--dur-fast) var(--ease-spring);
        }
        .pc-add:hover { background: var(--burdeo); }
        .pc-add:active { transform: scale(0.97); }

        @media (min-width: 700px) {
          .pc-shell {
            padding: 1rem;
            border-radius: 24px;
          }
          .pc-tag {
            top: 0.8rem;
            left: 0.8rem;
          }
          .pc-info {
            gap: 0.28rem;
            padding: 0 0.25rem;
          }
          .pc-cat {
            font-size: 0.6875rem;
          }
          .pc-name {
            font-size: clamp(1.05rem, 1.6vw, 1.3rem);
          }
        }
      `}</style>
    </article>
  );
}
