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
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedQty, setSelectedQty] = useState<number>(() => {
    const chips = getChips(product.min_unit_kg ?? 1);
    return chips[1];
  });
  const [adding, setAdding] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const items = useCartStore((s) => s.items);

  const chips = getChips(product.min_unit_kg ?? 1);
  const minQty = product.min_unit_kg ?? 1;
  const isOut = product.status === "agotado";
  const currentQty = items.find((item) => item.kind === "product" && item.id === product.id)?.qty ?? 0;
  const remainingQty = Math.max(0, product.stock_kg - currentQty);
  const exceedsStock = selectedQty > remainingQty;
  const price = product.price * selectedQty;

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
      <main style={{ paddingTop: 24, paddingBottom: 80 }}>
        <div className="wrap">
          {/* Breadcrumb */}
          <nav aria-label="Ruta de navegación" style={{ fontSize: 13, color: "#5E6B3E", marginBottom: 20, display: "flex", gap: 6, flexWrap: "wrap", fontFamily: "var(--font-body)" }}>
            <Link href="/" style={{ color: "#5E6B3E" }}>Inicio</Link>
            <span>›</span>
            <Link href="/#productos" style={{ color: "#5E6B3E" }}>{product.cat_label}</Link>
            <span>›</span>
            <span style={{ color: "#5A1F1A", fontWeight: 600 }}>{product.name}</span>
          </nav>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 32 }} className="product-detail-grid">
            {/* Imagen */}
            <div style={{ aspectRatio: "1/1", borderRadius: "16px", overflow: "hidden", background: "#F4EADB", position: "relative" }}>
              <Image src={product.image_webp_url || product.image_url} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} priority />
              {product.badge && (
                <span style={{ position: "absolute", top: 12, left: 12, background: "#A8411A", color: "#F4EADB", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 8, fontFamily: "var(--font-body)" }}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Info */}
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#5E6B3E", marginBottom: 8 }}>{product.cat_label}</p>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(1.75rem, 5vw, 3rem)", color: "#5A1F1A", lineHeight: 1.1, marginBottom: 16 }}>
                {product.name}
              </h1>

              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2rem", color: "#5A1F1A" }}>{fmt(product.price * (product.min_unit_kg ?? 1))}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#5E6B3E" }}>· Bolsa sellada {(product.min_unit_kg ?? 1) < 1 ? "500 g" : "1 kg"}</span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(94,107,62,0.7)", marginBottom: 16 }}>
                Equivale a {fmt(Math.round(product.price / 10))} cada 100 g
              </p>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5E6B3E", lineHeight: 1.7, marginBottom: 24 }}>{product.copy}</p>

              {/* Chips de cantidad — spring scale al seleccionar (Apple HIG press feedback) */}
              {!isOut && (
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", color: "#5A1F1A", marginBottom: "0.75rem" }}>¿Cuánto vas a pedir?</p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                    {chips.map((kg) => (
                      <motion.button
                        key={kg}
                        onClick={() => { setSelectedQty(kg); hapticChip(); }}
                        aria-pressed={selectedQty === kg}
                        whileTap={{ scale: 0.94 }}
                        transition={spring.press}
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
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#5E6B3E" }}>
                    Subtotal: <Odometer
                      value={price}
                      style={{ color: "#5A1F1A", fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700 }}
                    />
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: exceedsStock ? "#B74432" : "rgba(94,107,62,0.78)", marginTop: 8 }}>
                    {remainingQty <= 0
                      ? "Este producto ya no tiene kilos disponibles para agregar."
                      : exceedsStock
                        ? `Solo quedan ${fmtKg(remainingQty)} disponibles.`
                        : `Disponibles ahora: ${fmtKg(remainingQty)}.`}
                  </p>
                </div>
              )}

              {/* CTA — StampButton: press + ink-bleed (railway dopamine, Schultz 1997) */}
              <StampButton
                onClick={handleAdd}
                disabled={isOut || adding || remainingQty < minQty || exceedsStock}
                size="lg"
                style={{ maxWidth: 360, background: isOut || remainingQty < minQty || exceedsStock ? "#C0B0A8" : undefined }}
              >
                {isOut
                  ? "Agotado"
                  : remainingQty < minQty
                    ? "Sin stock disponible"
                    : exceedsStock
                      ? "Ajusta la cantidad"
                      : adding ? "Agregando..." : `Agregar ${fmtKg(selectedQty)} al pedido`}
              </StampButton>

              <div style={{
                marginTop: 20,
                padding: "16px 18px",
                background: "#fff",
                border: "1.5px solid rgba(90,31,26,0.15)",
                borderRadius: 12,
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "#5A1F1A",
                fontVariantNumeric: "tabular-nums",
              }}>
                <p style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#A8411A",
                  marginBottom: 6,
                }}>
                  Despacho local
                </p>
                <p style={{ marginBottom: 2, fontWeight: 600 }}>
                  Martes a sábado, 19:30–21:00
                </p>
                <p style={{ color: "#5E6B3E", fontSize: 12 }}>
                  Santa Cruz · Palmilla · Peralillo · Marchigüe. Retiro en local gratis. Coordinamos por WhatsApp.
                </p>
              </div>
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
          @media (min-width: 768px) {
            .product-detail-grid { grid-template-columns: 1fr 1fr !important; gap: 48px !important; align-items: start; }
          }
        `}</style>
      </main>
      <Footer />
      <OrderSheet open={orderOpen} onClose={() => setOrderOpen(false)} />
      <ToastStack />
    </>
  );
}
