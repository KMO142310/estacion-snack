"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderSheet from "@/components/OrderSheet";
import ToastStack from "@/components/Toast";
import { useCartStore } from "@/lib/store";
import { fmt, fmtKg, getChips } from "@/lib/cart-utils";
import { hapticSuccess } from "@/lib/haptics";
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

  const chips = getChips(product.min_unit_kg ?? 1);
  const isOut = product.status === "agotado";
  const price = product.price * selectedQty;

  const handleAdd = async () => {
    if (adding || isOut) return;
    setAdding(true);
    hapticSuccess();
    addItem({ kind: "product", id: product.id, qty: selectedQty, name: product.name, pricePerUnit: product.price });
    addToast(`${product.name} agregado · ${fmtKg(selectedQty)}`);
    await new Promise((r) => setTimeout(r, 300));
    setAdding(false);
    setOrderOpen(true);
  };

  return (
    <>
      <Header onOrderOpen={() => setOrderOpen(true)} />
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
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2rem", color: "#5A1F1A" }}>{fmt(product.price)}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#5E6B3E" }}>/ kg</span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(94,107,62,0.7)", marginBottom: 16 }}>
                {fmt(Math.round(product.price / 10))}/100 g
              </p>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5E6B3E", lineHeight: 1.7, marginBottom: 24 }}>{product.copy}</p>

              {/* Chips de cantidad */}
              {!isOut && (
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", color: "#5A1F1A", marginBottom: "0.75rem" }}>¿Cuánto vas a pedir?</p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                    {chips.map((kg) => (
                      <button key={kg} onClick={() => setSelectedQty(kg)} aria-pressed={selectedQty === kg} style={{ fontFamily: "var(--font-body)", fontWeight: selectedQty === kg ? 600 : 500, fontSize: "0.9375rem", padding: "0.625rem 1.125rem", borderRadius: "9999px", border: `2px solid ${selectedQty === kg ? "#A8411A" : "rgba(90,31,26,0.15)"}`, background: selectedQty === kg ? "#A8411A" : "transparent", color: selectedQty === kg ? "#F4EADB" : "#5A1F1A", cursor: "pointer" }}>
                        {fmtKg(kg)}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#5E6B3E" }}>
                    Subtotal: <strong style={{ color: "#5A1F1A", fontFamily: "var(--font-display)", fontSize: "1.125rem" }}>{fmt(price)}</strong>
                  </p>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={handleAdd}
                disabled={isOut || adding}
                style={{ width: "100%", maxWidth: 360, fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "1rem", color: "#F4EADB", background: isOut ? "#C0B0A8" : adding ? "#A84019" : "#A8411A", border: "none", borderRadius: "12px", padding: "1rem 1.5rem", cursor: isOut || adding ? "not-allowed" : "pointer" }}
              >
                {isOut ? "Agotado" : adding ? "Agregando..." : `Agregar ${fmtKg(selectedQty)} al pedido`}
              </button>

              {/* Info despacho */}
              <div style={{ marginTop: 20, padding: 16, background: "rgba(122,132,87,0.10)", borderRadius: 12, fontFamily: "var(--font-body)", fontSize: 13, color: "#5A1F1A" }}>
                <strong style={{ display: "block", marginBottom: 4, color: "#5A1F1A" }}>Despacho martes a sábado</strong>
                Marchigüe, Peralillo, Santa Cruz y Cunaco. Coordinamos por WhatsApp.
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
                      <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", color: "#5E6B3E" }}>{fmt(r.price)}/kg</p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "rgba(94,107,62,0.7)" }}>{fmt(Math.round(r.price / 10))}/100 g</p>
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
