"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Bnav from "@/components/Bnav";
import Drawer from "@/components/Drawer";
import Announce from "@/components/Announce";
import { useCart } from "@/lib/cart-context";
import { trackViewItem } from "@/lib/analytics";
import { fmt } from "@/lib/products";
import type { Product } from "@/lib/types";

const COLOR_ACCENT: Record<string, string> = {
  orange: "var(--orange)",
  green:  "var(--green)",
  red:    "var(--red)",
  purple: "var(--purple)",
  yellow: "var(--yellow)",
  sand:   "var(--sand)",
};

const COLOR_SOFT: Record<string, string> = {
  orange: "var(--orange-soft)",
  green:  "var(--green-soft)",
  red:    "var(--red-soft)",
  purple: "var(--purple-soft)",
  yellow: "var(--yellow-soft)",
  sand:   "var(--sand-soft)",
};

const STATUS_LABEL: Record<string, string> = {
  disponible: "En stock",
  pocas:      "Pocas unidades",
  ultimo_kg:  "Último kg",
  agotado:    "Agotado",
};

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetail({ product, related }: Props) {
  const { items, addItem, updateQty } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [qty, setQty] = useState(0.5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    trackViewItem({ id: product.id, name: product.name, price: product.price, category: product.cat_label });
  }, [product.id, product.name, product.price, product.cat_label]);
  const inCart = items[product.id] ?? 0;
  const accent = COLOR_ACCENT[product.color] ?? "var(--orange)";
  const soft = COLOR_SOFT[product.color] ?? "var(--orange-soft)";
  const isOut = product.status === "agotado";

  const handleAdd = async () => {
    setLoading(true);
    await addItem(product, qty);
    setLoading(false);
    setDrawerOpen(true);
  };

  const handleCartUpdate = async (newQty: number) => {
    setLoading(true);
    await updateQty(product, Math.max(0, newQty));
    setLoading(false);
  };

  return (
    <>
      <Announce />
      <Header onCartOpen={() => setDrawerOpen(true)} />
      <main style={{ paddingTop: 24, paddingBottom: 48 }}>
        <div className="wrap">
          <nav aria-label="Ruta de navegación" style={{ fontSize: 12, color: "var(--sub)", marginBottom: 20, display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Link href="/">Inicio</Link>
            <span>›</span>
            <Link href={`/#productos`}>{product.cat_label}</Link>
            <span>›</span>
            <span style={{ color: "var(--text)", fontWeight: 600 }}>{product.name}</span>
          </nav>

          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 32,
          }} className="product-detail-grid">
            {/* Image */}
            <div>
              <div style={{
                aspectRatio: "1/1",
                borderRadius: "var(--r-lg)",
                overflow: "hidden",
                background: soft,
                position: "relative",
              }}>
                <picture>
                  <source srcSet={product.image_webp_url} type="image/webp" />
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </picture>
                {product.badge && (
                  <span style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "6px 14px",
                    background: "var(--text)",
                    color: "#fff",
                    borderRadius: "var(--r-full)",
                  }}>
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: accent, marginBottom: 8 }}>
                {product.cat_label}
              </div>
              <h1 style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontSize: "clamp(32px, 5vw, 48px)",
                lineHeight: 1.05,
                marginBottom: 16,
                fontWeight: 400,
              }}>
                {product.name}
              </h1>

              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-.02em" }}>{fmt(product.price)}</span>
                <span style={{ fontSize: 15, color: "var(--sub)" }}>/ kg</span>
              </div>

              <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--sub)", marginBottom: 20 }}>
                {product.copy}
              </p>

              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                background: soft,
                borderRadius: "var(--r-full)",
                fontSize: 12,
                fontWeight: 700,
                color: accent,
                marginBottom: 24,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: accent, display: "inline-block" }} />
                {STATUS_LABEL[product.status]}
              </div>

              {/* Qty selector */}
              {!isOut && inCart === 0 && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--sub)", marginBottom: 8 }}>
                    Cantidad
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[0.5, 1, 1.5, 2, 3].map((v) => (
                      <button
                        key={v}
                        onClick={() => setQty(v)}
                        style={{
                          padding: "10px 16px",
                          fontSize: 13,
                          fontWeight: 700,
                          border: `2px solid ${qty === v ? "var(--text)" : "rgba(0,0,0,.1)"}`,
                          background: qty === v ? "var(--text)" : "#fff",
                          color: qty === v ? "#fff" : "var(--text)",
                          borderRadius: 10,
                          cursor: "pointer",
                        }}
                      >
                        {v} kg
                      </button>
                    ))}
                  </div>
                  <p style={{ marginTop: 8, fontSize: 13, color: "var(--sub)" }}>
                    Subtotal: <strong style={{ color: "var(--text)" }}>{fmt(product.price * qty)}</strong>
                  </p>
                </div>
              )}

              {/* Add to cart / update qty */}
              {inCart === 0 ? (
                <button
                  onClick={handleAdd}
                  disabled={isOut || loading}
                  style={{
                    width: "100%",
                    maxWidth: 360,
                    padding: 18,
                    fontSize: 16,
                    fontWeight: 800,
                    borderRadius: 14,
                    background: isOut ? "rgba(0,0,0,.08)" : "var(--text)",
                    color: isOut ? "var(--sub)" : "#fff",
                    border: "none",
                    cursor: isOut || loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {isOut ? "Agotado" : `Agregar ${qty} kg al pedido`}
                </button>
              ) : (
                <div style={{ maxWidth: 360 }}>
                  <div style={{
                    display: "flex",
                    border: "2px solid var(--text)",
                    borderRadius: 14,
                    overflow: "hidden",
                    marginBottom: 12,
                  }}>
                    <button onClick={() => handleCartUpdate(inCart - 0.5)} disabled={loading} style={{ width: 56, height: 56, background: "#fff", fontSize: 22, fontWeight: 700, border: "none", cursor: "pointer" }}>−</button>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, borderLeft: "2px solid var(--text)", borderRight: "2px solid var(--text)" }}>
                      {inCart} kg en el carrito
                    </div>
                    <button onClick={() => handleCartUpdate(inCart + 0.5)} disabled={loading} style={{ width: 56, height: 56, background: "#fff", fontSize: 22, fontWeight: 700, border: "none", cursor: "pointer" }}>+</button>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(true)}
                    style={{
                      width: "100%",
                      padding: 16,
                      fontSize: 15,
                      fontWeight: 800,
                      borderRadius: 14,
                      background: "var(--text)",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Ver pedido ({fmt(product.price * inCart)})
                  </button>
                </div>
              )}

              {/* Delivery info */}
              <div style={{ marginTop: 24, padding: 16, background: "var(--green-soft)", borderRadius: 14, fontSize: 13, color: "var(--sub)" }}>
                <strong style={{ color: "var(--text)", display: "block", marginBottom: 4 }}>Despacho martes y viernes</strong>
                Santa Cruz y alrededores. Coordinamos horario por WhatsApp.
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section style={{ marginTop: 64 }}>
              <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 20 }}>
                También te puede gustar
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 18,
              }}>
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/producto/${r.slug}`}
                    style={{
                      display: "block",
                      borderRadius: "var(--r)",
                      overflow: "hidden",
                      background: "var(--bg)",
                      border: "1.5px solid rgba(0,0,0,.06)",
                      transition: "transform .2s",
                    }}
                  >
                    <div style={{ aspectRatio: "1/1", background: COLOR_SOFT[r.color] ?? "var(--orange-soft)", overflow: "hidden" }}>
                      <picture>
                        <source srcSet={r.image_webp_url} type="image/webp" />
                        <img src={r.image_url} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </picture>
                    </div>
                    <div style={{ padding: 14 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{r.name}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: COLOR_ACCENT[r.color] ?? "var(--orange)" }}>{fmt(r.price)} / kg</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <style>{`
          @media (min-width: 768px) {
            .product-detail-grid {
              grid-template-columns: 1fr 1fr !important;
              gap: 48px !important;
              align-items: start;
            }
          }
        `}</style>
      </main>
      <Footer />
      <Bnav onCartOpen={() => setDrawerOpen(true)} />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} products={[product, ...related]} />
    </>
  );
}
