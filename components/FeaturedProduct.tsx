"use client";

import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { fmt } from "@/lib/cart-utils";

interface Props {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image_webp_url: string;
    stock_kg: number;
    min_unit_kg?: number;
    format_label?: string;
    format_short?: string;
    status?: string;
    copy?: string;
    long_copy?: string;
  };
  onOpen: () => void;
}

export default function FeaturedProduct({ product, onOpen }: Props) {
  const {
    name,
    price,
    image_webp_url,
    min_unit_kg = 1,
    format_short = "1 kg",
    status,
    stock_kg,
    long_copy,
  } = product;
  const agotado = status === "agotado";
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const bagPrice = price * min_unit_kg;
  const blurb =
    long_copy ??
    "Mezcla de cuatro frutos en proporciones definidas. Almendra, nuez, maní sin sal y avellana europea.";

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (agotado || stock_kg < min_unit_kg) return;
    addItem({ kind: "product", id: product.id, qty: min_unit_kg, name, pricePerUnit: price });
    addToast(`${name} · 1 bolsa`);
  };

  return (
    <section aria-label="Producto destacado" className="fp">
      <div className="fp-inner">
        <div className="fp-image-col">
          <div className="fp-image-wrap img-warm-frame">
            <button
              type="button"
              onClick={onOpen}
              aria-label={`Ver detalle de ${name}`}
              className="fp-image-btn"
            >
              <Image
                src={image_webp_url}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </button>
          </div>
        </div>

        <div className="fp-text-col">
          <p className="fp-kicker">
            <span className="fp-kicker-line" aria-hidden="true" />
            El repetido de todos los jueves
          </p>

          <h2 className="fp-name">{name}</h2>

          <p className="fp-blurb">{blurb}</p>

          <div className="fp-meta">
            <div className="fp-meta-block">
              <span className="fp-meta-label">Formato</span>
              <span className="fp-meta-value">Bolsa sellada · {format_short}</span>
            </div>
            <div className="fp-meta-block">
              <span className="fp-meta-label">Precio</span>
              <span className="fp-meta-value fp-meta-price">{fmt(bagPrice)}</span>
            </div>
            <div className="fp-meta-block">
              <span className="fp-meta-label">Stock</span>
              <span className="fp-meta-value">
                {agotado
                  ? "Agotado"
                  : stock_kg === 1
                    ? "Última bolsa"
                    : `${stock_kg} bolsas`}
              </span>
            </div>
          </div>

          <div className="fp-actions">
            <button
              type="button"
              onClick={handleAdd}
              disabled={agotado || stock_kg < min_unit_kg}
              className="fp-cta"
            >
              Agregar 1 bolsa
              <span className="fp-cta-divider" aria-hidden="true">·</span>
              {fmt(bagPrice)}
            </button>
            <button type="button" onClick={onOpen} className="fp-cta-secondary">
              Ver detalle
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .fp {
          background: #FFF9F1;
          padding: 4.5rem 1.5rem;
          position: relative;
          border-top: 1px solid rgba(90,31,26,0.06);
          border-bottom: 1px solid rgba(90,31,26,0.06);
        }
        .fp-inner {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
        }

        .fp-image-col { position: relative; }
        .fp-image-wrap {
          position: relative;
          aspect-ratio: 1/1;
          background: #EDE4D6;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 1px 0 rgba(90,31,26,0.08), 0 20px 40px -18px rgba(90,31,26,0.3);
        }
        .fp-image-btn {
          position: absolute;
          inset: 0;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .fp-image-btn img {
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .fp-image-btn:hover img { transform: scale(1.04); }
        }

        .fp-text-col {
          padding: 0.5rem 0;
          min-width: 0;
        }

        .fp-kicker {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #A8411A;
          margin: 0 0 1.25rem;
        }
        .fp-kicker-line {
          display: inline-block;
          width: 24px;
          height: 1px;
          background: currentColor;
          opacity: 0.55;
        }

        .fp-name {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(2.5rem, 7vw, 4.5rem);
          line-height: 0.95;
          letter-spacing: -0.04em;
          color: #5A1F1A;
          margin: 0 0 1.5rem;
        }

        .fp-blurb {
          font-family: var(--font-body);
          font-size: 1.0625rem;
          line-height: 1.7;
          color: rgba(90,31,26,0.78);
          max-width: 520px;
          margin: 0 0 2rem;
        }

        .fp-meta {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1.5rem 0;
          margin: 0 0 2rem;
          border-top: 1px solid rgba(90,31,26,0.12);
          border-bottom: 1px solid rgba(90,31,26,0.12);
        }
        .fp-meta-block { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
        .fp-meta-label {
          font-family: var(--font-body);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(90,31,26,0.55);
        }
        .fp-meta-value {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(0.95rem, 2.2vw, 1.15rem);
          color: #5A1F1A;
          letter-spacing: -0.015em;
          line-height: 1.2;
        }
        .fp-meta-price {
          font-variant-numeric: tabular-nums;
        }

        .fp-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem 1.75rem;
        }
        .fp-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 1rem;
          color: #F4EADB;
          background: #5A1F1A;
          padding: 1rem 1.75rem;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          box-shadow: 0 12px 28px -10px rgba(90,31,26,0.55);
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease;
        }
        .fp-cta-divider { opacity: 0.55; }
        @media (hover: hover) {
          .fp-cta:hover {
            transform: translateY(-3px);
            box-shadow: 0 18px 36px -10px rgba(90,31,26,0.65);
          }
        }
        .fp-cta:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }
        .fp-cta-secondary {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.9375rem;
          color: #5A1F1A;
          background: transparent;
          border: none;
          padding: 0.5rem 0;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 5px;
          text-decoration-thickness: 1px;
          text-decoration-color: rgba(90,31,26,0.3);
        }
        @media (hover: hover) {
          .fp-cta-secondary:hover { text-decoration-color: #A8411A; }
        }

        @media (min-width: 900px) {
          .fp { padding: 7rem 2.5rem; }
          .fp-inner {
            grid-template-columns: 0.95fr 1fr;
            gap: 4rem;
          }
          .fp-text-col { padding: 1rem 0 1rem 1rem; }
        }
      `}</style>
    </section>
  );
}
