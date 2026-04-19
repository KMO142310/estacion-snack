"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import FocusTrap from "focus-trap-react";
import { useCartStore } from "@/lib/store";
import { fmt, fmtKg } from "@/lib/cart-utils";
import { hapticChip, hapticWhistle } from "@/lib/haptics";
import { buildWaUrl } from "@/lib/whatsapp";
import { captureOrder } from "@/lib/actions";
import { getPackAvailability, type Pack, type ProductStock } from "@/lib/pack-utils";
import { COMUNAS, COMUNA_DEFAULT, FREE_SHIPPING_MIN, getShippingCost, type Comuna } from "@/lib/shipping";
import X from "./icons/X";
import Minus from "./icons/Minus";
import Plus from "./icons/Plus";
import Odometer from "./Odometer";
import StampButton from "./StampButton";
import TicketProgress from "./TicketProgress";
import productsData from "@/data/products.json";
import packsData from "@/data/packs.json";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function OrderSheet({ open, onClose }: Props) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [comuna, setComuna] = useState<Comuna>(COMUNA_DEFAULT);

  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const addToast = useCartStore((s) => s.addToast);
  const clear = useCartStore((s) => s.clear);

  // Totales: subtotal (items), shipping (según comuna), total (subtotal + shipping)
  // Ley 19.496 Art. 1 N°2: el precio total debe ser visible antes del cierre de compra.
  const subtotal = items.reduce((sum, item) => sum + getSubtotal(item), 0);
  const shipping = getShippingCost(comuna, subtotal);
  const total = subtotal + shipping;

  const totalWeight = items.reduce((sum, item) => {
    if (item.kind === "product") return sum + item.qty;
    const pk = (packsData as Pack[]).find((p) => p.id === item.id);
    return sum + (pk ? pk.items.reduce((s, i) => s + i.kg, 0) * item.qty : 0);
  }, 0);

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
    // Silbato de partida — momento culminante del flow de pedido
    hapticWhistle();

    // iOS Safari: el popup se abre SINCRÓNICAMENTE durante el gesto del usuario.
    // Si se abre después del await, Safari lo bloquea como popup.
    // Ref: https://webkit.org/blog/7763/a-closer-look-into-wkwebview/ + E2E research 2026-04-13
    const popup = typeof window !== "undefined"
      ? window.open("about:blank", "_blank", "noopener,noreferrer")
      : null;

    // Capture order intent for analytics (non-blocking — WhatsApp flow continues on failure)
    const captureItems = items.map((item) => {
      if (item.kind === "product") {
        const p = productsData.find((x) => x.id === item.id);
        return {
          product_name: p?.name ?? item.name ?? "Producto",
          qty: item.qty,
          unit_price: p?.price ?? 0,
        };
      } else {
        const pk = (packsData as Pack[]).find((x) => x.id === item.id);
        return {
          product_name: `${pk?.name ?? item.name ?? "Pack"} (pack)`,
          qty: item.qty,
          unit_price: pk?.price ?? 0,
        };
      }
    });

    const captureResult = await captureOrder(captureItems, note, { comuna, shipping }).catch(() => ({ ok: false, orderId: undefined }));
    const orderRef = captureResult.ok && captureResult.orderId
      ? captureResult.orderId.slice(0, 8)
      : undefined;

    const url = buildWaUrl(
      items,
      productsData.map((p) => ({ id: p.id, name: p.name, price: p.price })),
      packsData as Pack[],
      note,
      orderRef,
      { comuna, shipping, total },
    );
    if (captureResult.ok) {
      clear();
    } else {
      addToast("Abrimos WhatsApp, pero el pedido no quedó guardado en la app todavía.", "info");
    }
    onClose();

    if (popup && !popup.closed) {
      popup.location.href = url;
    } else {
      // popup bloqueado — fallback: misma pestaña
      window.location.href = url;
    }
  };

  function stepQty(item: typeof items[number], delta: number) {
    hapticChip();
    const min = item.kind === "product"
      ? (productsData.find((p) => p.id === item.id)?.min_unit_kg ?? 1)
      : 1;
    const step = min; // step by min_unit_kg (0.5 for Chuby, 1 for others)
    const newQty = +(item.qty + delta * step).toFixed(3);
    const max = getMaxQty(item);
    if (newQty < min) {
      removeItem(item.id, item.kind);
      addToast("Eliminado", "info");
      return;
    }
    if (newQty > max) return;
    updateQty(item.id, item.kind, newQty);
  }

  return (
    <AnimatePresence>
      {open && (
        <FocusTrap
          focusTrapOptions={{
            initialFocus: false,
            clickOutsideDeactivates: true,
            escapeDeactivates: false,
            allowOutsideClick: true,
            returnFocusOnDeactivate: true,
          }}
        >
        <div>
          <motion.div
            key="order-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(18,5,3,0.55)", zIndex: 700, backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}
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
              maxHeight: "94vh", display: "flex", flexDirection: "column",
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

            {/* Shipping progress — TicketProgress ferroviario */}
            {items.length > 0 && (
              <div style={{ padding: "0 1.25rem 0.75rem", flexShrink: 0 }}>
                <TicketProgress current={subtotal} threshold={FREE_SHIPPING_MIN} />
              </div>
            )}

            {/* Items — scroll-hint: fade en el borde inferior para indicar
                que hay más contenido cuando la lista excede el alto del sheet.
                overscroll-contain evita que el gesto pase al body detrás. */}
            <div style={{
              flex: 1, overflowY: "auto", padding: "0 1.25rem",
              overscrollBehavior: "contain",
              WebkitMaskImage: "linear-gradient(to bottom, black calc(100% - 18px), transparent 100%)",
              maskImage: "linear-gradient(to bottom, black calc(100% - 18px), transparent 100%)",
            }}>
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

                      const imageSrc = item.kind === "product"
                        ? productsData.find((p) => p.id === item.id)?.image_webp_url
                        : (packsData as Pack[]).find((p) => p.id === item.id)?.image_webp_url;

                      return (
                        <motion.div
                          key={`${item.kind}-${item.id}`}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
                          style={{
                            display: "flex",
                            gap: 12,
                            padding: "0.875rem 0",
                            borderBottom: "1px solid rgba(90,31,26,0.08)",
                            alignItems: "center",
                          }}
                        >
                          {/* Thumbnail */}
                          {imageSrc && (
                            <div style={{
                              width: 64, height: 64, borderRadius: 10, overflow: "hidden",
                              position: "relative", flexShrink: 0, background: "#EDE4D6",
                            }}>
                              <Image
                                src={imageSrc}
                                alt=""
                                fill
                                sizes="64px"
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                          )}

                          {/* Main content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Nombre */}
                            <p style={{
                              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9375rem",
                              color: "#5A1F1A", lineHeight: 1.3, marginBottom: 8,
                            }}>
                              {getLabel(item)}
                            </p>

                            {/* Stepper + subtotal */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                              <div style={{
                                display: "inline-flex", alignItems: "center",
                                background: "#fff", borderRadius: 999,
                                border: "1px solid rgba(90,31,26,0.12)",
                              }}>
                                <button
                                  onClick={() => stepQty(item, -1)}
                                  aria-label={atMin ? "Eliminar" : "Menos"}
                                  style={{
                                    width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
                                    border: "none", borderRadius: "999px 0 0 999px", cursor: "pointer",
                                    background: "transparent",
                                    color: "#5A1F1A",
                                    WebkitTapHighlightColor: "transparent",
                                  }}
                                >
                                  <Minus size={16} />
                                </button>
                                <span style={{
                                  minWidth: 48, textAlign: "center", fontFamily: "var(--font-body)",
                                  fontWeight: 700, fontSize: "0.9375rem", color: "#5A1F1A",
                                  userSelect: "none",
                                }}>
                                  {item.kind === "product" ? fmtKg(item.qty) : `×${item.qty}`}
                                </span>
                                <button
                                  onClick={() => stepQty(item, 1)}
                                  disabled={atMax}
                                  aria-label="Más"
                                  style={{
                                    width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
                                    border: "none", borderRadius: "0 999px 999px 0", cursor: atMax ? "default" : "pointer",
                                    background: "transparent",
                                    color: atMax ? "rgba(90,31,26,0.2)" : "#5A1F1A",
                                    WebkitTapHighlightColor: "transparent",
                                  }}
                                >
                                  <Plus size={16} />
                                </button>
                              </div>

                              <Odometer
                                value={getSubtotal(item)}
                                style={{
                                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem",
                                  color: "#5A1F1A", marginLeft: "auto",
                                }}
                              />
                            </div>
                          </div>

                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {/* Selector de comuna — necesario para calcular envío antes del cierre (Ley 19.496) */}
                  <div style={{ padding: "1rem 0 0" }}>
                    <p style={{
                      fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem",
                      color: "#5A1F1A", marginBottom: 8,
                    }}>
                      Entregar en
                    </p>
                    <div
                      role="radiogroup"
                      aria-label="Comuna de entrega"
                      style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}
                    >
                      {COMUNAS.map((c) => {
                        const selected = comuna === c;
                        return (
                          <button
                            key={c}
                            role="radio"
                            aria-checked={selected}
                            onClick={() => setComuna(c)}
                            style={{
                              fontFamily: "var(--font-body)", fontSize: "0.875rem",
                              fontWeight: selected ? 600 : 500,
                              padding: "10px 16px",
                              minHeight: 44,
                              borderRadius: 999,
                              border: `1.5px solid ${selected ? "#A8411A" : "rgba(90,31,26,0.15)"}`,
                              background: selected ? "#A8411A" : "transparent",
                              color: selected ? "#F4EADB" : "#5A1F1A",
                              cursor: "pointer",
                              WebkitTapHighlightColor: "transparent",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>

                    {/* Desglose: Subtotal + Envío + Total — visible antes del cierre (Ley 19.496 Art. 1 N°2) */}
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5E6B3E", marginBottom: 4 }}>
                      <span>Subtotal</span>
                      <Odometer value={subtotal} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5E6B3E", marginBottom: 8 }}>
                      <span>Envío {comuna}</span>
                      <span>
                        {shipping === 0 ? "Gratis" : <Odometer value={shipping} />}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 8, borderTop: "1px solid rgba(90,31,26,0.08)" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "1rem", color: "#5A1F1A" }}>
                          Total
                        </p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#5E6B3E", marginTop: 2 }}>
                          {fmtKg(totalWeight)} en total
                        </p>
                      </div>
                      <Odometer
                        value={total}
                        style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.75rem", color: "#5A1F1A" }}
                      />
                    </div>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "#5E6B3E",
                      lineHeight: 1.5, marginTop: 8, marginBottom: "1.25rem",
                    }}>
                      Revisa este total antes de pasar a WhatsApp. Ahí seguimos contigo y cerramos el despacho.
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
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#A8411A"; }}
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
              {items.length > 0 && (
                <div style={{
                  display: "flex", alignItems: "baseline", justifyContent: "space-between",
                  gap: 12, marginBottom: "0.75rem",
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{
                      fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
                      letterSpacing: "0.14em", textTransform: "uppercase",
                      color: "rgba(90,31,26,0.55)",
                    }}>
                      Total
                    </span>
                    <Odometer
                      value={total}
                      style={{
                        fontFamily: "var(--font-display)", fontWeight: 700,
                        fontSize: "1.5rem", color: "#5A1F1A", lineHeight: 1,
                      }}
                    />
                  </div>
                  {shipping === 0 && subtotal >= FREE_SHIPPING_MIN && (
                    <span style={{
                      fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      color: "#5E6B3E",
                    }}>
                      Envío gratis
                    </span>
                  )}
                </div>
              )}
              {items.length === 0 ? (
                <StampButton
                  onClick={onClose}
                  fullWidth
                  style={{ background: "#5A1F1A", color: "#F4EADB" }}
                >
                  Ver las mezclas
                </StampButton>
              ) : (
                <StampButton
                  onClick={handleConfirm}
                  disabled={loading}
                  fullWidth
                  size="lg"
                  style={{ background: loading ? "#A84019" : "#A8411A" }}
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
                      Pasar a WhatsApp
                    </>
                  )}
                </StampButton>
              )}

              {items.length > 0 && (
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: 11, color: "#5E6B3E",
                  lineHeight: 1.4, marginTop: 10, textAlign: "center",
                }}>
                  Al continuar compartís tu número con Estación Snack para coordinar tu pedido. Ver <a href="/privacidad" style={{ color: "#A8411A", textDecoration: "underline", textUnderlineOffset: 2 }}>política</a>.
                </p>
              )}
            </div>
          </motion.div>
        </div>
        </FocusTrap>
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
