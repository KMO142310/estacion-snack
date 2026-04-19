"use client";

import Image from "next/image";
import productsData from "@/data/products.json";
import { fmt } from "@/lib/cart-utils";

interface HeroProps {
  onOrderOpen: () => void;
}

const heroProducts = productsData.slice(0, 3);

export default function Hero({ onOrderOpen }: HeroProps) {
  const lead = heroProducts[0];
  const accents = heroProducts.slice(1);

  return (
    <section
      aria-label="Inicio"
      style={{
        background: "linear-gradient(180deg, #F7F0E4 0%, #F4EADB 100%)",
        padding: "1.35rem 16px 2.4rem",
      }}
    >
      <div className="container hero-shell">
        <div style={{ maxWidth: 520 }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "#A8411A",
              fontSize: "0.74rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: "0 0 1rem",
            }}
          >
            Santa Cruz · Frutos secos por kilo
          </p>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              color: "#5A1F1A",
              fontWeight: 600,
              fontSize: "clamp(2.7rem, 9vw, 5.4rem)",
              lineHeight: 0.94,
              letterSpacing: "-0.05em",
              marginBottom: "0.85rem",
            }}
          >
            Compra rico.
            <br />
            Pide simple.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#5E6B3E",
              fontSize: "clamp(1.02rem, 2.8vw, 1.35rem)",
              lineHeight: 1.4,
              marginBottom: "0.85rem",
              maxWidth: 460,
            }}
          >
            Mezclas, frutos secos, dulces y packs listos para cerrar por WhatsApp.
          </p>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              color: "rgba(90,31,26,0.78)",
              fontSize: "0.98rem",
              lineHeight: 1.65,
              marginBottom: "1.35rem",
              maxWidth: 480,
            }}
          >
            Lo mejor del catálogo primero. Sin vueltas, sin registro raro y con despacho local de martes a sábado.
          </p>

          <div className="hero-meta">
            {["Desde 1 kg", "Santa Cruz y alrededores", "Pago al recibir"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="hero-cta-grid" style={{ marginTop: "1.35rem" }}>
            <a href="#productos" className="hero-primary-cta">
              Ver productos
              <span aria-hidden="true">→</span>
            </a>
            <button onClick={onOrderOpen} className="hero-secondary-cta">
              Abrir pedido
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>

        <div className="hero-stage">
          <article className="hero-lead-card">
            <div className="hero-lead-image">
              <Image
                src={lead.image_webp_url}
                alt={lead.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="hero-lead-copy">
              <p className="hero-kicker">Más pedido</p>
              <div>
                <h2>{lead.name}</h2>
                <p>{fmt(lead.price)} · 1 kg</p>
              </div>
            </div>
          </article>

          <div className="hero-mini-grid">
            {accents.map((product) => (
              <article key={product.id} className="hero-mini-card">
                <div className="hero-mini-image">
                  <Image
                    src={product.image_webp_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 18vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <p>{product.name}</p>
                  <span>{fmt(product.price)}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hero-shell {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 1.35rem;
          align-items: center;
        }
        .hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }
        .hero-meta span {
          padding: 0.5rem 0.8rem;
          border-radius: 999px;
          border: 1px solid rgba(90,31,26,0.12);
          background: rgba(255,249,241,0.84);
          color: #5A1F1A;
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 600;
        }
        .hero-cta-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          max-width: 430px;
        }
        .hero-primary-cta,
        .hero-secondary-cta {
          font-family: var(--font-body);
          font-size: 0.95rem;
          border-radius: 14px;
          padding: 1rem 1.2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          min-height: 54px;
        }
        .hero-primary-cta {
          font-weight: 700;
          color: #F4EADB;
          background: #A8411A;
          box-shadow: 0 12px 30px rgba(168,65,26,0.22);
        }
        .hero-secondary-cta {
          font-weight: 600;
          color: #5A1F1A;
          background: rgba(255,249,241,0.86);
          border: 1px solid rgba(90,31,26,0.14);
        }
        .hero-stage {
          display: grid;
          gap: 0.8rem;
        }
        .hero-lead-card {
          background: #FFF9F1;
          border-radius: 26px;
          overflow: hidden;
          border: 1px solid rgba(90,31,26,0.08);
          box-shadow: 0 22px 44px rgba(90,31,26,0.08);
        }
        .hero-lead-image {
          position: relative;
          aspect-ratio: 4 / 4.1;
          background: #EDE4D6;
        }
        .hero-lead-copy {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1rem 1.1rem;
        }
        .hero-kicker {
          font-family: var(--font-body);
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #A8411A;
        }
        .hero-lead-copy h2 {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 600;
          line-height: 1.05;
          color: #5A1F1A;
          margin-bottom: 0.2rem;
        }
        .hero-lead-copy p:last-child {
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: #5E6B3E;
          font-weight: 600;
        }
        .hero-mini-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .hero-mini-card {
          display: grid;
          grid-template-columns: 84px minmax(0, 1fr);
          gap: 0.7rem;
          align-items: center;
          background: rgba(255,249,241,0.72);
          border: 1px solid rgba(90,31,26,0.08);
          border-radius: 20px;
          padding: 0.7rem;
        }
        .hero-mini-image {
          position: relative;
          aspect-ratio: 1 / 1;
          border-radius: 14px;
          overflow: hidden;
          background: #EDE4D6;
        }
        .hero-mini-card p {
          font-family: var(--font-display);
          font-size: 0.94rem;
          line-height: 1.08;
          color: #5A1F1A;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .hero-mini-card span {
          font-family: var(--font-body);
          font-size: 0.78rem;
          color: #5E6B3E;
          font-weight: 600;
        }
        @media (min-width: 640px) {
          .hero-cta-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
          .hero-shell {
            grid-template-columns: minmax(0, 1.02fr) minmax(420px, 0.98fr);
            gap: 2.5rem;
          }
        }
      `}</style>
    </section>
  );
}
