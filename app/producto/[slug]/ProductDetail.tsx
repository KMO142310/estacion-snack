"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Announce from "@/components/Announce";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderSheet from "@/components/OrderSheet";
import ToastStack from "@/components/Toast";
import StampButton from "@/components/StampButton";
import Odometer from "@/components/Odometer";
import { useCartStore } from "@/lib/store";
import { fmt, fmtKg, getChips } from "@/lib/cart-utils";
import { hapticChip } from "@/lib/haptics";
import { spring } from "@/lib/motion-tokens";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";

interface Props {
  product: Product;
  related: Product[];
  allProducts: Product[];
}

export default function ProductDetail({ product, related }: Props) {
  const minQty = product.min_unit_kg ?? 1;
  const chips = getChips(minQty);
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedQty, setSelectedQty] = useState<number>(() => {
    return chips[0] ?? minQty;
  });
  const [adding, setAdding] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const items = useCartStore((s) => s.items);

  const isOut = product.status === "agotado";
  const currentQty = items.find((item) => item.kind === "product" && item.id === product.id)?.qty ?? 0;
  const remainingQty = Math.max(0, product.stock_kg - currentQty);
  const hasAvailableQty = remainingQty >= minQty;
  const exceedsStock = selectedQty > remainingQty;
  const price = product.price * selectedQty;
  const expandedCopy = product.long_copy?.trim();
  const hasExpandedCopy = Boolean(expandedCopy && expandedCopy !== product.copy);
  const formatLabel = (product.min_unit_kg ?? 1) < 1 ? "500 g" : "1 kg";
  const ctaDisabled = isOut || adding || !hasAvailableQty || exceedsStock;
  const ctaLabel = isOut
    ? "Agotado"
    : !hasAvailableQty
      ? "Sin stock disponible"
      : exceedsStock
        ? "Ajusta la cantidad"
        : adding
          ? "Agregando..."
          : `Agregar ${fmtKg(selectedQty)} al pedido`;
  const buyboxLead = currentQty > 0
    ? `Ya llevas ${fmtKg(currentQty)} de este producto en tu pedido.`
    : "Elige la cantidad y te la dejamos lista para cerrar por WhatsApp.";
  const stickyNote = currentQty > 0
    ? `Ya llevas ${fmtKg(currentQty)} en tu pedido`
    : "Se suma a tu pedido y abre la bolsa para revisar";
  const stickyActionLabel = adding
    ? "Agregando..."
    : isOut
      ? "Agotado"
      : !hasAvailableQty
        ? "Sin stock"
        : exceedsStock
          ? "Ajusta"
          : "Agregar";

  const handleAdd = async () => {
    if (adding || isOut) return;
    if (remainingQty < minQty || exceedsStock) {
      addToast(`Quedan ${Math.max(remainingQty, 0).toLocaleString("es-CL")} kg disponibles`, "info");
      return;
    }
    setAdding(true);
    // haptic orchestration en StampButton (chip + stamp)
    addItem({ kind: "product", id: product.id, qty: selectedQty, name: product.name, pricePerUnit: product.price });
    addToast(`${product.name} agregado · ${fmtKg(selectedQty)}`);
    await new Promise((r) => setTimeout(r, 300));
    setAdding(false);
    setOrderOpen(true);
  };

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 200 }}>
        <Announce />
        <Header onOrderOpen={() => setOrderOpen(true)} />
      </div>
      <main className="pd-main">
        <div className="wrap">
          {/* Breadcrumb */}
          <nav aria-label="Ruta de navegación" style={{ fontSize: 13, color: "#5E6B3E", marginBottom: 20, display: "flex", gap: 6, flexWrap: "wrap", fontFamily: "var(--font-body)" }}>
            <Link href="/" style={{ color: "#5E6B3E" }}>Inicio</Link>
            <span>›</span>
            <Link href="/#productos" style={{ color: "#5E6B3E" }}>Productos</Link>
            <span>›</span>
            <span style={{ color: "#5A1F1A", fontWeight: 600 }}>{product.name}</span>
          </nav>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 32 }} className="product-detail-grid">
            {/* Imagen */}
            <div style={{ aspectRatio: "1/1", borderRadius: "16px", overflow: "hidden", background: "#F4EADB", position: "relative" }}>
              <Image
                src={product.image_webp_url || product.image_url}
                alt={`${product.name} en bolsa sellada de ${formatLabel}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
              />
              {product.badge && (
                <span style={{ position: "absolute", top: 12, left: 12, background: "#A8411A", color: "#F4EADB", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 8, fontFamily: "var(--font-body)" }}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="pd-info">
              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#5E6B3E", marginBottom: 8 }}>{product.cat_label}</p>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(1.75rem, 5vw, 3rem)", color: "#5A1F1A", lineHeight: 1.1, marginBottom: 16 }}>
                {product.name}
              </h1>

              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2rem", color: "#5A1F1A" }}>{fmt(product.price * (product.min_unit_kg ?? 1))}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#5E6B3E" }}>· Bolsa sellada {formatLabel}</span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(94,107,62,0.7)", marginBottom: 16 }}>
                Equivale a {fmt(Math.round(product.price / 10))} cada 100 g
              </p>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5E6B3E", lineHeight: 1.7, marginBottom: 24 }}>{product.copy}</p>
              {hasExpandedCopy && (
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.125rem", color: "#5A1F1A", marginBottom: 10 }}>
                    Más sobre este producto
                  </h2>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5E6B3E", lineHeight: 1.75, margin: 0 }}>
                    {expandedCopy}
                  </p>
                </div>
              )}

              <section className="pd-buybox" aria-label="Armar pedido">
                <div className="pd-buybox-head">
                  <p className="pd-buybox-kicker">Arma tu pedido</p>
                  <p className="pd-buybox-copy">{buyboxLead}</p>
                </div>

                {!isOut && (
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", color: "#5A1F1A", marginBottom: "0.75rem" }}>¿Cuánto vas a pedir?</p>
                    <div className="pd-chip-list">
                      {chips.map((kg) => (
                        <motion.button
                          key={kg}
                          onClick={() => { setSelectedQty(kg); hapticChip(); }}
                          aria-pressed={selectedQty === kg}
                          whileTap={{ scale: 0.94 }}
                          transition={spring.press}
                          className="pd-chip"
                          style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: selectedQty === kg ? 600 : 500,
                            fontSize: "0.9375rem",
                            padding: "0.625rem 1.125rem",
                            borderRadius: "9999px",
                            border: `2px solid ${selectedQty === kg ? "#A8411A" : "rgba(90,31,26,0.15)"}`,
                            background: selectedQty === kg ? "#A8411A" : "transparent",
                            color: selectedQty === kg ? "#F4EADB" : "#5A1F1A",
                            cursor: "pointer",
                            WebkitTapHighlightColor: "transparent",
                            minHeight: 44,
                          }}
                        >
                          {fmtKg(kg)}
                        </motion.button>
                      ))}
                    </div>
                    <p className="pd-subtotal">
                      Subtotal: <Odometer
                        value={price}
                        style={{ color: "#5A1F1A", fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700 }}
                      />
                    </p>
                    <p className="pd-stock-note" style={{ color: exceedsStock ? "#B74432" : "rgba(94,107,62,0.78)" }}>
                      {remainingQty <= 0
                        ? "Este producto ya no tiene kilos disponibles para agregar."
                        : exceedsStock
                          ? `Solo quedan ${fmtKg(remainingQty)} disponibles.`
                          : `Disponibles ahora: ${fmtKg(remainingQty)}.`}
                    </p>
                  </div>
                )}

                <div className="pd-cta-stack">
                  <StampButton
                    onClick={handleAdd}
                    disabled={ctaDisabled}
                    size="lg"
                    fullWidth
                    className="pd-cta-button"
                    style={ctaDisabled ? { background: "#C0B0A8" } : undefined}
                  >
                    {ctaLabel}
                  </StampButton>
                  <p className="pd-cta-help">Se agrega a tu pedido y te abre la bolsa para revisar antes de escribir.</p>
                </div>

                <div className="pd-shipping-card">
                  <p className="pd-shipping-kicker">
                    Despacho local
                  </p>
                  <p className="pd-shipping-title">
                    Martes a sábado, 19:30-21:00
                  </p>
                  <p className="pd-shipping-copy">
                    Santa Cruz, Palmilla, Peralillo y Marchigüe. Retiro en local gratis. Coordinamos todo por WhatsApp.
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Productos relacionados */}
          {related.length > 0 && (
            <section style={{ marginTop: 64 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.75rem", color: "#5A1F1A", marginBottom: 20 }}>
                También te puede gustar
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                {related.map((r) => (
                  <Link key={r.id} href={`/producto/${r.slug}`} style={{ display: "block", borderRadius: "16px", overflow: "hidden", background: "#fff", boxShadow: "0 2px 12px rgba(90,31,26,0.07)", textDecoration: "none" }}>
                    <div style={{ aspectRatio: "1/1", background: "#F4EADB", position: "relative" }}>
                      <Image src={r.image_webp_url || r.image_url} alt={r.name} fill sizes="200px" style={{ objectFit: "cover" }} loading="lazy" />
                    </div>
                    <div style={{ padding: 14 }}>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9375rem", color: "#5A1F1A", marginBottom: 4 }}>{r.name}</p>
                      <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", color: "#5E6B3E" }}>{fmt(r.price * (r.min_unit_kg ?? 1))} · {(r.min_unit_kg ?? 1) < 1 ? "500 g" : "1 kg"}</p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "rgba(94,107,62,0.7)" }}>{fmt(Math.round(r.price / 10))} / 100 g</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <style>{`
          .pd-main {
            padding-top: 24px;
            padding-bottom: 144px;
          }
          .pd-info {
            display: flex;
            flex-direction: column;
          }
          .pd-buybox {
            margin-top: 8px;
            padding: 1.1rem;
            border-radius: 22px;
            background: linear-gradient(180deg, rgba(255, 249, 241, 0.98) 0%, rgba(244, 234, 219, 0.92) 100%);
            border: 1px solid rgba(90,31,26,0.1);
            box-shadow: 0 18px 36px -28px rgba(90,31,26,0.35);
          }
          .pd-buybox-head {
            margin-bottom: 1rem;
          }
          .pd-buybox-kicker {
            margin: 0 0 0.35rem;
            font-family: var(--font-body);
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #A8411A;
          }
          .pd-buybox-copy {
            margin: 0;
            font-family: var(--font-body);
            font-size: 0.875rem;
            line-height: 1.6;
            color: #5E6B3E;
          }
          .pd-chip-list {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin-bottom: 0.75rem;
          }
          .pd-chip {
            flex: 0 0 auto;
          }
          .pd-subtotal {
            font-family: var(--font-body);
            font-size: 0.875rem;
            color: #5E6B3E;
          }
          .pd-stock-note {
            font-family: var(--font-body);
            font-size: 12px;
            margin-top: 8px;
          }
          .pd-cta-stack {
            display: flex;
            flex-direction: column;
            gap: 0.65rem;
          }
          .pd-cta-button {
            width: 100%;
          }
          .pd-cta-help {
            margin: 0;
            font-family: var(--font-body);
            font-size: 0.75rem;
            line-height: 1.5;
            color: rgba(90,31,26,0.72);
          }
          .pd-shipping-card {
            margin-top: 1rem;
            padding: 16px 18px;
            background: rgba(255,255,255,0.92);
            border: 1.5px solid rgba(90,31,26,0.15);
            border-radius: 16px;
            font-family: var(--font-body);
            font-size: 13px;
            color: #5A1F1A;
            font-variant-numeric: tabular-nums;
          }
          .pd-shipping-kicker {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #A8411A;
            margin-bottom: 6px;
          }
          .pd-shipping-title {
            margin-bottom: 2px;
            font-weight: 600;
          }
          .pd-shipping-copy {
            color: #5E6B3E;
            font-size: 12px;
            line-height: 1.55;
          }
          .pd-sticky-wrap {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 110;
            padding: 0 1rem calc(0.9rem + env(safe-area-inset-bottom, 0px));
            pointer-events: none;
          }
          .pd-sticky {
            width: min(100%, 36rem);
            margin: 0 auto;
            min-height: 68px;
            padding: 0.85rem 0.9rem 0.85rem 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.9rem;
            border: 1px solid rgba(244, 234, 219, 0.12);
            border-radius: 22px;
            background: rgba(29, 29, 31, 0.96);
            color: #fff;
            box-shadow: 0 24px 40px -24px rgba(18,18,21,0.76);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            pointer-events: auto;
            -webkit-tap-highlight-color: transparent;
          }
          .pd-sticky:disabled {
            opacity: 0.72;
          }
          .pd-sticky-copy {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
            min-width: 0;
          }
          .pd-sticky-label {
            font-size: 0.9375rem;
            font-weight: 700;
            line-height: 1.2;
            color: #fff;
          }
          .pd-sticky-note {
            font-size: 11px;
            line-height: 1.35;
            color: rgba(244,234,219,0.74);
          }
          .pd-sticky-action {
            min-height: 42px;
            padding: 0 1rem;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(244,234,219,0.12);
            color: #F4EADB;
            font-size: 0.8125rem;
            font-weight: 700;
            white-space: nowrap;
          }
          @media (min-width: 768px) {
            .pd-main { padding-bottom: 96px; }
            .product-detail-grid { grid-template-columns: 1fr 1fr !important; gap: 48px !important; align-items: start; }
            .pd-buybox {
              padding: 1.35rem;
            }
            .pd-sticky-wrap {
              display: none;
            }
          }
        `}</style>
      </main>
      <Footer />
      {!orderOpen && (
        <div className="pd-sticky-wrap">
          <button
            type="button"
            onClick={handleAdd}
            disabled={ctaDisabled}
            aria-label={ctaLabel}
            className="pd-sticky"
          >
            <span className="pd-sticky-copy">
              <span className="pd-sticky-label">{fmtKg(selectedQty)} · {fmt(price)}</span>
              <span className="pd-sticky-note">{stickyNote}</span>
            </span>
            <span className="pd-sticky-action">{stickyActionLabel}</span>
          </button>
        </div>
      )}
      <OrderSheet open={orderOpen} onClose={() => setOrderOpen(false)} />
      <ToastStack />
    </>
  );
}
