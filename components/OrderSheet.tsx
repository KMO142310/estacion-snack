"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { fmt, fmtKg } from "@/lib/cart-utils";
import { hapticLight, hapticSuccess } from "@/lib/haptics";
import { buildWaUrl } from "@/lib/whatsapp";
import { getPackAvailability, type Pack, type ProductStock } from "@/lib/pack-utils";
import X from "./icons/X";
import Minus from "./icons/Minus";
import Plus from "./icons/Plus";
import productsData from "@/data/products.json";
import packsData from "@/data/packs.json";

const FREE_SHIPPING = 25000;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function OrderSheet({ open, onClose }: Props) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const addToast = useCartStore((s) => s.addToast);
  const clear = useCartStore((s) => s.clear);

  // Totals
  const total = items.reduce((sum, item) => sum + getSubtotal(item), 0);
  const totalWeight = items.reduce((sum, item) => {
    if (item.kind === "product") return sum + item.qty;
    const pk = (packsData as Pack[]).find((p) => p.id === item.id);
    return sum + (pk ? pk.items.reduce((s, i) => s + i.kg, 0) * item.qty : 0);
  }, 0);

  const envioGratis = total >= FREE_SHIPPING;
  const falta = FREE_SHIPPING - total;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleConfirm = async () => {
    if (loading || items.length === 0) return;
    setLoading(true);
    hapticSuccess();
    await new Promise((r) => setTimeout(r, 600));
    const url = buildWaUrl(
      items,
      productsData.map((p) => ({ id: p.id, name: p.name, price: p.price })),
      packsData as Pack[],
      note
    );
    clear();
    onClose();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  function stepQty(item: typeof items[number], delta: number) {
    hapticLight();
    const newQty = item.qty + delta;
    const min = item.kind === "product"
      ? (productsData.find((p) => p.id === item.id)?.min_unit_kg ?? 1)
      : 1;
    const max = getMaxQty(item);
    if (newQty < min || newQty > max) return;
    updateQty(item.id, item.kind, newQty);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="order-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(18,5,3,0.55)", zIndex: 700, backdropFilter: "blur(2px)" }}
            aria-hidden="true"
          />

          <motion.div
            key="order-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Tu pedido"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={(_, info) => { if (info.offset.y > 80 || info.velocity.y > 500) onClose(); }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 800,
              background: "#F4EADB", borderRadius: "24px 24px 0 0",
              boxShadow: "0 -8px 56px rgba(90,31,26,0.20)",
              maxHeight: "94svh", display: "flex", flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "1rem 1.25rem 0.75rem", flexShrink: 0,
            }}>
              <div>
                <div aria-hidden="true" style={{ width: 40, height: 4, borderRadius: 9999, background: "rgba(90,31,26,0.18)", marginBottom: "0.75rem" }} />
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.375rem", color: "#5A1F1A" }}>
                  Tu pedido
                </h2>
              </div>
              <button onClick={onClose} aria-label="Cerrar" style={{
                width: 36, height: 36, borderRadius: "50%", background: "rgba(90,31,26,0.08)",
                color: "#5A1F1A", display: "flex", alignItems: "center", justifyContent: "center",
                border: "none", cursor: "pointer",
              }}>
                <X size={18} />
              </button>
            </div>

            {/* Shipping progress */}
            {items.length > 0 && (
              <div style={{ padding: "0 1.25rem 0.75rem", flexShrink: 0 }}>
                <div style={{
                  background: "rgba(90,31,26,0.05)", borderRadius: 10, padding: "10px 14px",
                }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginBottom: 6,
                  }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: envioGratis ? "#5E6B3E" : "#5A1F1A" }}>
                      {envioGratis ? "✓ Envío gratis" : `Te faltan ${fmt(falta)} para envío gratis`}
                    </span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#5E6B3E" }}>
                      {fmt(FREE_SHIPPING)}
                    </span>
                  </div>
                  <div style={{
                    height: 4, borderRadius: 9999, background: "rgba(90,31,26,0.1)", overflow: "hidden",
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (total / FREE_SHIPPING) * 100)}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                      style={{
                        height: "100%", borderRadius: 9999,
                        background: envioGratis
                          ? "linear-gradient(90deg, #5E6B3E, #9DAB75)"
                          : "linear-gradient(90deg, #D0551F, #E0784D)",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 1.25rem" }}>
              {items.length === 0 ? (
                <div style={{ padding: "3rem 0", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#5A1F1A", marginBottom: "0.5rem" }}>
                    Tu carrito está tranquilo.
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5E6B3E", lineHeight: 1.6 }}>
                    Cuando agregues algo, acá va a aparecer el resumen antes de mandarlo por WhatsApp.
                  </p>
                </div>
              ) : (
                <div style={{ paddingTop: "0.25rem" }}>
                  <AnimatePresence>
                    {items.map((item) => {
                      const maxQty = getMaxQty(item);
                      const minQty = item.kind === "product"
                        ? (productsData.find((p) => p.id === item.id)?.min_unit_kg ?? 1)
                        : 1;
                      const atMin = item.qty <= minQty;
                      const atMax = item.qty >= maxQty;
                      const unitPrice = getUnitPrice(item);
                      const stockKg = item.kind === "product"
                        ? productsData.find((p) => p.id === item.id)?.stock_kg ?? 99
                        : null;
                      const stockLow = stockKg !== null && stockKg <= 3;

                      return (
                        <motion.div
                          key={`${item.kind}-${item.id}`}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
                          style={{
                            padding: "0.875rem 0",
                            borderBottom: "1px solid rgba(90,31,26,0.08)",
                          }}
                        >
                          {/* Row 1: Name + delete */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                            <p style={{
                              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9375rem",
                              color: "#5A1F1A", flex: 1, lineHeight: 1.3,
                            }}>
                              {getLabel(item)}
                            </p>
                            <button
                              onClick={() => { removeItem(item.id, item.kind); addToast("Producto eliminado", "info"); }}
                              aria-label={`Eliminar ${getLabel(item)}`}
                              style={{
                                width: 28, height: 28, borderRadius: "50%", background: "rgba(90,31,26,0.06)",
                                color: "rgba(90,31,26,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
                                border: "none", cursor: "pointer", flexShrink: 0, marginLeft: 8,
                              }}
                            >
                              <X size={12} />
                            </button>
                          </div>

                          {/* Row 2: Stepper + subtotal */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            {/* Stepper pill */}
                            <div style={{
                              display: "inline-flex", alignItems: "center",
                              background: "rgba(90,31,26,0.06)", borderRadius: 10,
                            }}>
                              <button
                                onClick={() => stepQty(item, -1)}
                                disabled={atMin}
                                aria-label="Menos"
                                style={{
                                  width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                                  border: "none", borderRadius: "10px 0 0 10px", cursor: atMin ? "default" : "pointer",
                                  background: atMin ? "transparent" : "rgba(90,31,26,0.08)",
                                  color: atMin ? "rgba(90,31,26,0.2)" : "#5A1F1A",
                                  transition: "all 0.15s ease",
                                }}
                              >
                                <Minus size={14} />
                              </button>
                              <span style={{
                                minWidth: 52, textAlign: "center", fontFamily: "var(--font-display)",
                                fontWeight: 600, fontSize: "0.9375rem", color: "#5A1F1A",
                                padding: "0 4px", userSelect: "none",
                              }}>
                                {item.kind === "product" ? fmtKg(item.qty) : `×${item.qty}`}
                              </span>
                              <button
                                onClick={() => stepQty(item, 1)}
                                disabled={atMax}
                                aria-label="Más"
                                style={{
                                  width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                                  border: "none", borderRadius: "0 10px 10px 0", cursor: atMax ? "default" : "pointer",
                                  background: atMax ? "transparent" : "#5A1F1A",
                                  color: atMax ? "rgba(90,31,26,0.2)" : "#F4EADB",
                                  transition: "all 0.15s ease",
                                }}
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Subtotal */}
                            <p style={{
                              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem",
                              color: "#5A1F1A",
                            }}>
                              {fmt(getSubtotal(item))}
                            </p>
                          </div>

                          {/* Row 3: Unit price + stock info */}
                          <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#5E6B3E" }}>
                              {item.kind === "product"
                                ? `${fmt(unitPrice)}/kg · ${fmt(Math.round(unitPrice / 10))}/100 g`
                                : `${fmt(unitPrice)} por pack`}
                            </span>
                            {item.kind === "product" && stockLow && (
                              <span style={{
                                fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600,
                                color: "#D0551F",
                              }}>
                                {stockKg === 1 ? "Último kg" : `Quedan ${stockKg} kg`}
                              </span>
                            )}
                            {atMax && !stockLow && (
                              <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#5E6B3E" }}>
                                Máximo disponible
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {/* Total + weight */}
                  <div style={{ padding: "1rem 0 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "1rem", color: "#5A1F1A" }}>
                          Total estimado
                        </p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#5E6B3E", marginTop: 2 }}>
                          {fmtKg(totalWeight)} en total
                        </p>
                      </div>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.75rem", color: "#5A1F1A" }}>
                        {fmt(total)}
                      </p>
                    </div>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "#5E6B3E",
                      lineHeight: 1.5, marginTop: 8, marginBottom: "1.25rem",
                    }}>
                      El precio final puede variar levemente según el peso exacto. Confirmamos antes de despachar.
                    </p>

                    {/* Nota opcional */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label htmlFor="order-note" style={{
                        fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem",
                        color: "#5A1F1A", display: "block", marginBottom: "0.5rem",
                      }}>
                        Nota (opcional)
                      </label>
                      <textarea
                        id="order-note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ej: sin sal, horario preferido, etc."
                        rows={2}
                        style={{
                          width: "100%", fontFamily: "var(--font-body)", fontSize: "0.9375rem",
                          color: "#5A1F1A", background: "rgba(90,31,26,0.04)",
                          border: "1.5px solid rgba(90,31,26,0.15)", borderRadius: "10px",
                          padding: "0.75rem", resize: "none", outline: "none", lineHeight: 1.5,
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#D0551F"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(90,31,26,0.15)"; }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div style={{
              padding: "0.875rem 1.25rem",
              paddingBottom: "calc(0.875rem + env(safe-area-inset-bottom, 0px))",
              flexShrink: 0, borderTop: "1px solid rgba(90,31,26,0.08)", background: "#F4EADB",
            }}>
              {items.length === 0 ? (
                <button onClick={onClose} style={{
                  width: "100%", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "1rem",
                  color: "#F4EADB", background: "#5A1F1A", border: "none", borderRadius: "12px",
                  padding: "1rem", cursor: "pointer",
                }}>
                  Ver las mezclas
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  style={{
                    width: "100%", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "1.0625rem",
                    color: "#F4EADB", background: loading ? "#A84019" : "#D0551F",
                    border: "none", borderRadius: "12px", padding: "1rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    transition: "background 0.15s", WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{
                        width: 18, height: 18, border: "2px solid rgba(244,234,219,0.4)",
                        borderTopColor: "#F4EADB", borderRadius: "50%",
                        animation: "spin 0.7s linear infinite", display: "inline-block",
                      }} />
                      Preparando mensaje...
                    </>
                  ) : (
                    <>
                      <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Quiero pedir
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Helpers ── */

function getLabel(item: { kind: string; id: string; name?: string }) {
  if (item.kind === "product") {
    return productsData.find((p) => p.id === item.id)?.name ?? item.name ?? "Producto";
  }
  return (packsData as Pack[]).find((p) => p.id === item.id)?.name ?? item.name ?? "Pack";
}

function getUnitPrice(item: { kind: string; id: string }) {
  if (item.kind === "product") {
    return productsData.find((p) => p.id === item.id)?.price ?? 0;
  }
  return (packsData as Pack[]).find((p) => p.id === item.id)?.price ?? 0;
}

function getSubtotal(item: { kind: string; id: string; qty: number }) {
  return getUnitPrice(item) * item.qty;
}

function getMaxQty(item: { kind: string; id: string }) {
  if (item.kind === "product") {
    return productsData.find((p) => p.id === item.id)?.stock_kg ?? 99;
  }
  const pk = (packsData as Pack[]).find((p) => p.id === item.id);
  if (!pk) return 99;
  return getPackAvailability(pk, productsData as unknown as ProductStock[]).units;
}
