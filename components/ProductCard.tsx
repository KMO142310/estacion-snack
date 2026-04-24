"use client";

import { useState } from "react";
import Image from "next/image";
import { fmtKg, fmtDisplayPrice } from "@/lib/cart-utils";
import { useCartStore } from "@/lib/store";
import StampButton from "./StampButton";

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
}

interface Props {
  product: Product;
  onOpen: () => void;
}

export default function ProductCard({ product, onOpen }: Props) {
  const { name, price, image_webp_url, badge, status, stock_kg, min_unit_kg = 1 } = product;
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const items = useCartStore((s) => s.items);
  const agotado = status === "agotado";
  const ultimoKg = status === "ultimo_kg";
  const currentQty = items.find((item) => item.kind === "product" && item.id === product.id)?.qty ?? 0;
  const remainingQty = Math.max(0, stock_kg - currentQty);
  const display = fmtDisplayPrice(price, min_unit_kg);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (agotado || added || remainingQty < min_unit_kg) return;
    addItem({ kind: "product", id: product.id, qty: min_unit_kg, name, pricePerUnit: price });
    addToast(`${name} · ${fmtKg(min_unit_kg)}`);
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
        <div className="pc-img-wrap">
          <Image
            src={image_webp_url}
            alt=""
            fill
            sizes="(max-width:640px) 50vw, 33vw"
            style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
            className="pc-img"
          />
          {(badge || ultimoKg) && (
            <span className="pc-badge" style={{ background: ultimoKg ? "#5A1F1A" : "rgba(168,65,26,0.88)", backdropFilter: "blur(8px)" }}>
              {badge || "Último kg"}
            </span>
          )}
        </div>

        <div className="pc-info">
          <h3 className="pc-name">{name}</h3>
          <p className="pc-price">
            {agotado ? "Agotado" : `${display.price} · ${display.unit}`}
          </p>
        </div>
      </button>

      {!agotado && (
        <div className="pc-action">
          <StampButton onClick={handleAdd} fullWidth size="sm" style={{ background: added ? "#5E6B3E" : undefined }}>
            {added ? "✓ Agregado" : "Agregar"}
          </StampButton>
        </div>
      )}

      <style>{`
        .pc {
          transition: transform 0.25s ease;
        }
        .pc-btn {
          text-align: left;
          width: 100%;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .pc-img-wrap {
          position: relative;
          aspect-ratio: 3/4;
          border-radius: 20px;
          overflow: hidden;
          background: #EDE4D6;
          margin-bottom: 14px;
        }
        @media (hover: hover) {
          .pc:hover { transform: translateY(-3px); }
          .pc:hover .pc-img { transform: scale(1.05); }
        }
        .pc-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          color: #F4EADB;
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 999px;
        }
        .pc-info {
          padding: 0 4px;
        }
        .pc-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(1.1rem, 2.5vw, 1.3rem);
          color: #5A1F1A;
          line-height: 1.15;
          letter-spacing: -0.015em;
          margin-bottom: 6px;
        }
        .pc-price {
          font-family: var(--font-body);
          font-weight: 500;
          font-size: 0.875rem;
          color: rgba(90,31,26,0.6);
          margin-bottom: 12px;
          font-variant-numeric: tabular-nums;
        }
        .pc-action {
          padding: 0 4px;
        }
      `}</style>
    </article>
  );
}
