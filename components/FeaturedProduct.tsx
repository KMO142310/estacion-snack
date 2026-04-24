"use client";

import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { fmt, fmtKg } from "@/lib/cart-utils";

/**
 * Producto destacado con layout editorial — no es una card más del grid.
 * Foto dominante, copy rico, CTA directo. Rompe la monotonía del grid.
 */
interface Props {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image_webp_url: string;
    stock_kg: number;
    min_unit_kg?: number;
    status?: string;
    copy?: string;
  };
  onOpen: () => void;
}

const BLURB = "Almendra, nuez, maní sin sal y avellana europea. Mezcla de cuatro frutos, pensada para picar sin elegir. La proporción que le pusimos es la que hace que no se termine solo el rico.";

export default function FeaturedProduct({ product, onOpen }: Props) {
  const { name, price, image_webp_url, min_unit_kg = 1, status, stock_kg } = product;
  const agotado = status === "agotado";
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (agotado || stock_kg < min_unit_kg) return;
    addItem({ kind: "product", id: product.id, qty: min_unit_kg, name, pricePerUnit: price });
    addToast(`${name} · ${fmtKg(min_unit_kg)}`);
  };

  return (
    <section aria-label="Producto destacado" className="fp">
      <div className="fp-inner">
        <div className="fp-image-col">
          <div className="fp-image-wrap">
            <span className="fp-label" aria-hidden="true">El más pedido</span>
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
          <div className="fp-ticket" aria-hidden="true">
            <div className="fp-ticket-dots">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>
          </div>
        </div>

        <div className="fp-text-col">
          <p className="fp-kicker">
            <span className="fp-kicker-num">01</span>
            <span className="fp-kicker-sep" aria-hidden="true">—</span>
            Clásico de la casa
          </p>

          <h2 className="fp-name">{name}</h2>

          <p className="fp-tagline">Cuatro frutos, una sola mezcla.</p>

          <p className="fp-blurb">{BLURB}</p>

          <dl className="fp-specs">
            <div>
              <dt>Precio</dt>
              <dd>{fmt(price)} <span>/ kg</span></dd>
            </div>
            <div>
              <dt>Desde</dt>
              <dd>{fmtKg(min_unit_kg)}</dd>
            </div>
            <div>
              <dt>Stock</dt>
              <dd>{agotado ? "Agotado" : `${stock_kg} kg`}</dd>
            </div>
          </dl>

          <div className="fp-actions">
            <button
              type="button"
              onClick={handleAdd}
              disabled={agotado || stock_kg < min_unit_kg}
              className="fp-cta"
            >
              Agregar 1 kg · {fmt(price)}
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </button>
            <button type="button" onClick={onOpen} className="fp-cta-secondary">
              Ver detalle
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .fp {
          background: #F4EADB;
          padding: 4rem 1.5rem;
          position: relative;
        }
        .fp-inner {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }

        .fp-image-col {
          position: relative;
        }
        .fp-image-wrap {
          position: relative;
          aspect-ratio: 4/5;
          background: #EDE4D6;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 24px 60px -20px rgba(90,31,26,0.25);
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
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .fp-image-btn:hover img {
            transform: scale(1.04);
          }
        }
        .fp-label {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 2;
          padding: 6px 12px;
          background: rgba(90,31,26,0.9);
          color: #F4EADB;
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          border-radius: 999px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .fp-ticket {
          display: none;
        }

        .fp-text-col {
          padding: 0.5rem 0;
        }

        .fp-kicker {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-body);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #A8411A;
          margin: 0 0 1.25rem;
        }
        .fp-kicker-num {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 14px;
          font-weight: 500;
          color: rgba(90,31,26,0.55);
          letter-spacing: 0;
        }
        .fp-kicker-sep { color: rgba(90,31,26,0.3); }

        .fp-name {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(2.4rem, 7vw, 4.5rem);
          line-height: 0.95;
          letter-spacing: -0.04em;
          color: #5A1F1A;
          margin: 0 0 0.75rem;
        }
        .fp-tagline {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 300;
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          color: #5E6B3E;
          margin: 0 0 1.5rem;
          line-height: 1.3;
        }
        .fp-blurb {
          font-family: var(--font-body);
          font-size: 1rem;
          line-height: 1.75;
          color: rgba(90,31,26,0.82);
          max-width: 500px;
          margin: 0 0 2rem;
        }

        .fp-specs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          padding: 1.25rem 0;
          margin: 0 0 2rem;
          border-top: 1px solid rgba(90,31,26,0.12);
          border-bottom: 1px solid rgba(90,31,26,0.12);
        }
        .fp-specs > div { margin: 0; min-width: 0; }
        .fp-specs dt {
          font-family: var(--font-body);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(90,31,26,0.55);
          margin: 0 0 4px;
        }
        .fp-specs dd {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          color: #5A1F1A;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .fp-specs dd span {
          font-family: var(--font-body);
          font-weight: 400;
          font-size: 0.65em;
          color: rgba(90,31,26,0.55);
          letter-spacing: 0;
        }

        .fp-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.9rem 1.5rem;
        }
        .fp-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 1rem;
          color: #F4EADB;
          background: #5A1F1A;
          padding: 0.95rem 1.75rem;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          box-shadow: 0 10px 24px -8px rgba(90,31,26,0.55);
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        @media (hover: hover) {
          .fp-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 14px 32px -8px rgba(90,31,26,0.65);
            background: #3d1613;
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
          .fp-image-wrap { aspect-ratio: 4/5.3; }
          .fp-text-col { padding: 2rem 0 2rem 1rem; }
          .fp-ticket {
            display: block;
            position: absolute;
            bottom: -28px;
            left: 28px;
            right: 28px;
            height: 28px;
            background: #F4EADB;
            border-radius: 0 0 24px 24px;
            overflow: hidden;
          }
          .fp-ticket-dots {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            height: 100%;
          }
          .fp-ticket-dots span {
            flex: 1;
            height: 2px;
            border-radius: 1px;
            background: rgba(90,31,26,0.15);
          }
        }
      `}</style>
    </section>
  );
}
