"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import FocusTrap from "focus-trap-react";
import { useCartStore } from "@/lib/store";
import { fmt } from "@/lib/cart-utils";
import { hapticChip, hapticWhistle } from "@/lib/haptics";
import { buildWaUrl } from "@/lib/whatsapp";
import { captureOrder } from "@/lib/actions";
import { getPackAvailability, type Pack, type ProductStock } from "@/lib/pack-utils";
import { COMUNAS, COMUNA_DEFAULT, FREE_SHIPPING_MIN, getShippingCost, type Comuna } from "@/lib/shipping";
import X from "./icons/X";
import productsData from "@/data/products.json";
import packsData from "@/data/packs.json";

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * OrderSheet — Apple Bag style.
 *
 * Inspirado en apple.com Bag (carrito). Limpio, blanco, tipografía sistema,
 * pill buttons, total prominente. Reemplaza el sheet cream/burdeo previo.
 *
 * Mantiene lógica de negocio crítica del flujo:
 * - Popup window.open SINCRÓNICO antes del await (iOS Safari fix).
 * - captureOrder fire-and-forget paralelo a buildWaUrl.
 * - Step de cantidad respeta min_unit_kg (0.5 para Chuby) y stock_kg.
 * - Comuna selector con cálculo de envío (Ley 19.496 Art. 1 N°2).
 */
export default function OrderSheet({ open, onClose }: Props) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [comuna, setComuna] = useState<Comuna>(COMUNA_DEFAULT);

  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const addToast = useCartStore((s) => s.addToast);
  const clear = useCartStore((s) => s.clear);

  const subtotal = items.reduce((sum, item) => sum + getSubtotal(item), 0);
  const shipping = getShippingCost(comuna, subtotal);
  const total = subtotal + shipping;
  const remainingForFree = Math.max(0, FREE_SHIPPING_MIN - subtotal);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleConfirm = async () => {
    if (loading || items.length === 0) return;
    setLoading(true);
    hapticWhistle();

    // iOS Safari: popup debe abrirse SINCRÓNICO durante el gesto.
    const popup =
      typeof window !== "undefined"
        ? window.open("about:blank", "_blank", "noopener,noreferrer")
        : null;

    const captureItems = items.map((item) => {
      if (item.kind === "product") {
        const p = productsData.find((x) => x.id === item.id);
        return {
          product_name: p?.name ?? item.name ?? "Producto",
          qty: item.qty,
          unit_price: p?.price ?? 0,
        };
      }
      const pk = (packsData as Pack[]).find((x) => x.id === item.id);
      return {
        product_name: `${pk?.name ?? item.name ?? "Pack"} (pack)`,
        qty: item.qty,
        unit_price: pk?.price ?? 0,
      };
    });

    const captureResult = await captureOrder(captureItems, note, { comuna, shipping }).catch(
      () => ({ ok: false, orderId: undefined }),
    );
    const orderRef =
      captureResult.ok && captureResult.orderId ? captureResult.orderId.slice(0, 8) : undefined;

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
      // eslint-disable-next-line react-hooks/immutability
      popup.location.href = url;
    } else {
      // Fallback: misma pestaña (popup bloqueado por el navegador).
      // eslint-disable-next-line react-hooks/immutability
      window.location.href = url;
    }
  };

  function stepQty(item: typeof items[number], delta: number) {
    hapticChip();
    const min =
      item.kind === "product"
        ? productsData.find((p) => p.id === item.id)?.min_unit_kg ?? 1
        : 1;
    const newQty = +(item.qty + delta * min).toFixed(3);
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
            {/* Backdrop blur estilo Apple sheet */}
            <motion.div
              key="ord-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="ord-backdrop"
              aria-hidden="true"
            />

            {/* Sheet */}
            <motion.div
              key="ord-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Tu bolsa"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80 || info.velocity.y > 500) onClose();
              }}
              className="ord-sheet"
            >
              {/* Header — drag handle + título + close */}
              <div className="ord-head">
                <div className="ord-handle" aria-hidden="true" />
                <div className="ord-head-row">
                  <h2 className="ord-title">Tu bolsa</h2>
                  <button onClick={onClose} aria-label="Cerrar" className="ord-close">
                    <X size={18} />
                  </button>
                </div>
                {items.length > 0 && (
                  <p className="ord-head-sub">
                    {items.length} {items.length === 1 ? "ítem" : "ítems"}
                    {remainingForFree > 0 && comuna !== "Retiro en local" ? (
                      <> · agrega {fmt(remainingForFree)} para envío gratis</>
                    ) : null}
                  </p>
                )}
              </div>

              {/* Scrollable content */}
              <div className="ord-content">
                {items.length === 0 ? (
                  <div className="ord-empty">
                    <div className="ord-empty-mark" aria-hidden="true">
                      <svg viewBox="0 0 64 64" width="56" height="56" fill="none">
                        <rect width="64" height="64" rx="14" fill="#f5f5f7" />
                        <path
                          d="M22 24h20l-2 22H24l-2-22z M26 24v-4a6 6 0 0 1 12 0v4"
                          stroke="#86868b"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="ord-empty-title">Tu bolsa está vacía</p>
                    <p className="ord-empty-sub">
                      Agrega productos desde el catálogo y vuelve acá para confirmar el pedido.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Items */}
                    <ul className="ord-items">
                      <AnimatePresence>
                        {items.map((item) => {
                          const max = getMaxQty(item);
                          const min =
                            item.kind === "product"
                              ? productsData.find((p) => p.id === item.id)?.min_unit_kg ?? 1
                              : 1;
                          const atMax = item.qty >= max;
                          const imageSrc =
                            item.kind === "product"
                              ? productsData.find((p) => p.id === item.id)?.image_webp_url
                              : (packsData as Pack[]).find((p) => p.id === item.id)?.image_webp_url;
                          const formatLabel =
                            item.kind === "product"
                              ? productsData.find((p) => p.id === item.id)?.format_short ?? "1 kg"
                              : "Pack";
                          const bagsCount = Math.round(item.qty / min);

                          return (
                            <motion.li
                              key={`${item.kind}-${item.id}`}
                              layout
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: 40, transition: { duration: 0.18 } }}
                              className="ord-item"
                            >
                              {imageSrc && (
                                <div className="ord-item-thumb">
                                  <Image
                                    src={imageSrc}
                                    alt=""
                                    fill
                                    sizes="72px"
                                    style={{ objectFit: "contain" }}
                                  />
                                </div>
                              )}
                              <div className="ord-item-body">
                                <p className="ord-item-name">{getLabel(item)}</p>
                                <p className="ord-item-meta">
                                  {item.kind === "product"
                                    ? `${bagsCount} ${bagsCount === 1 ? "bolsa" : "bolsas"} · ${formatLabel}`
                                    : `Pack · ×${item.qty}`}
                                </p>
                                <div className="ord-item-foot">
                                  <div className="ord-stepper" role="group" aria-label="Cantidad">
                                    <button
                                      type="button"
                                      onClick={() => stepQty(item, -1)}
                                      aria-label={item.qty <= min ? "Eliminar" : "Menos"}
                                      className="ord-stepper-btn"
                                    >
                                      −
                                    </button>
                                    <span className="ord-stepper-val">{bagsCount}</span>
                                    <button
                                      type="button"
                                      onClick={() => stepQty(item, 1)}
                                      disabled={atMax}
                                      aria-label="Más"
                                      className="ord-stepper-btn"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <span className="ord-item-price">{fmt(getSubtotal(item))}</span>
                                </div>
                              </div>
                            </motion.li>
                          );
                        })}
                      </AnimatePresence>
                    </ul>

                    {/* Comuna */}
                    <div className="ord-section">
                      <p className="ord-section-label">Entregar en</p>
                      <div role="radiogroup" aria-label="Comuna" className="ord-comunas">
                        {COMUNAS.map((c) => {
                          const selected = comuna === c;
                          return (
                            <button
                              key={c}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              onClick={() => setComuna(c)}
                              className={`ord-comuna ${selected ? "ord-comuna--selected" : ""}`}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Totales */}
                    <div className="ord-totals">
                      <div className="ord-totals-row">
                        <span>Subtotal</span>
                        <span>{fmt(subtotal)}</span>
                      </div>
                      <div className="ord-totals-row">
                        <span>Envío · {comuna}</span>
                        <span>{shipping === 0 ? "Gratis" : fmt(shipping)}</span>
                      </div>
                      <div className="ord-totals-total">
                        <span>Total</span>
                        <span>{fmt(total)}</span>
                      </div>
                    </div>

                    {/* Nota */}
                    <div className="ord-section">
                      <label htmlFor="ord-note" className="ord-section-label">
                        Nota (opcional)
                      </label>
                      <textarea
                        id="ord-note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Sin sal · llamar antes · portón rojo…"
                        rows={2}
                        className="ord-note"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Sticky CTA bottom */}
              <div className="ord-cta">
                {items.length === 0 ? (
                  <button type="button" onClick={onClose} className="ord-btn-secondary">
                    Ver productos
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={loading}
                    className="ord-btn-primary"
                  >
                    {loading ? (
                      <span className="ord-spinner" aria-hidden="true" />
                    ) : (
                      <>
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Pasar a WhatsApp · {fmt(total)}
                      </>
                    )}
                  </button>
                )}
                {items.length > 0 && (
                  <p className="ord-fineprint">
                    Al continuar compartís tu número con Estación Snack para coordinar tu pedido. Ver{" "}
                    <a href="/privacidad">política</a>.
                  </p>
                )}
              </div>
            </motion.div>

            <style>{`
              @keyframes ord-spin { to { transform: rotate(360deg); } }

              .ord-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.4);
                z-index: 700;
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
              }

              .ord-sheet {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 800;
                background: #ffffff;
                border-radius: 18px 18px 0 0;
                box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.18);
                max-height: 92vh;
                display: flex;
                flex-direction: column;
                color: #1d1d1f;
                letter-spacing: -0.011em;
              }

              .ord-head {
                padding: 0.5rem 1.25rem 0.75rem;
                border-bottom: 1px solid #e6e6e6;
                flex-shrink: 0;
              }
              .ord-handle {
                width: 36px;
                height: 4px;
                border-radius: 999px;
                background: #d2d2d7;
                margin: 8px auto 14px;
              }
              .ord-head-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
              }
              .ord-title {
                font-size: 1.375rem;
                font-weight: 600;
                color: #1d1d1f;
                margin: 0;
                letter-spacing: -0.022em;
                line-height: 1;
              }
              .ord-head-sub {
                font-size: 13px;
                color: #6e6e73;
                margin: 6px 0 0;
                letter-spacing: -0.005em;
              }
              .ord-close {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: #f5f5f7;
                color: #1d1d1f;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border: none;
                cursor: pointer;
                transition: background 0.15s ease;
              }
              .ord-close:hover { background: #e6e6e8; }

              .ord-content {
                flex: 1;
                overflow-y: auto;
                padding: 1rem 1.25rem 0;
                overscroll-behavior: contain;
              }

              .ord-empty {
                padding: 3rem 0 4rem;
                text-align: center;
              }
              .ord-empty-mark {
                display: inline-block;
                margin-bottom: 1rem;
              }
              .ord-empty-title {
                font-size: 1.125rem;
                font-weight: 500;
                color: #1d1d1f;
                margin: 0 0 0.5rem;
                letter-spacing: -0.014em;
              }
              .ord-empty-sub {
                font-size: 0.9375rem;
                color: #6e6e73;
                margin: 0 auto;
                max-width: 360px;
                line-height: 1.45;
              }

              .ord-items {
                list-style: none;
                margin: 0;
                padding: 0;
              }
              .ord-item {
                display: flex;
                gap: 14px;
                padding: 1rem 0;
                border-bottom: 1px solid #f0f0f2;
              }
              .ord-item:last-child { border-bottom: none; }
              .ord-item-thumb {
                position: relative;
                width: 72px;
                height: 72px;
                background: #f5f5f7;
                border-radius: 12px;
                overflow: hidden;
                flex-shrink: 0;
              }
              .ord-item-body {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 4px;
              }
              .ord-item-name {
                font-size: 0.9375rem;
                font-weight: 500;
                color: #1d1d1f;
                margin: 0;
                line-height: 1.25;
                letter-spacing: -0.011em;
              }
              .ord-item-meta {
                font-size: 12px;
                color: #6e6e73;
                margin: 0;
                letter-spacing: -0.005em;
              }
              .ord-item-foot {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 6px;
                gap: 12px;
              }
              .ord-item-price {
                font-size: 0.9375rem;
                font-weight: 500;
                color: #1d1d1f;
                font-variant-numeric: tabular-nums;
              }

              .ord-stepper {
                display: inline-flex;
                align-items: center;
                background: #f5f5f7;
                border-radius: 999px;
                padding: 2px;
              }
              .ord-stepper-btn {
                width: 28px;
                height: 28px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                font-weight: 500;
                color: #1d1d1f;
                background: transparent;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                line-height: 1;
                transition: background 0.15s ease, color 0.15s ease;
              }
              .ord-stepper-btn:hover { background: #ffffff; }
              .ord-stepper-btn:disabled {
                color: #c7c7cc;
                cursor: not-allowed;
              }
              .ord-stepper-val {
                min-width: 26px;
                text-align: center;
                font-size: 14px;
                font-weight: 500;
                color: #1d1d1f;
                font-variant-numeric: tabular-nums;
                user-select: none;
              }

              .ord-section {
                padding: 1.25rem 0 0.5rem;
              }
              .ord-section-label {
                font-size: 13px;
                font-weight: 500;
                color: #1d1d1f;
                margin: 0 0 10px;
                letter-spacing: -0.005em;
              }
              .ord-comunas {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
              }
              .ord-comuna {
                font-size: 13px;
                font-weight: 400;
                padding: 8px 14px;
                min-height: 36px;
                background: #f5f5f7;
                color: #1d1d1f;
                border: 1px solid transparent;
                border-radius: 999px;
                cursor: pointer;
                letter-spacing: -0.005em;
                transition: all 0.15s ease;
              }
              .ord-comuna:hover { background: #e6e6e8; }
              .ord-comuna--selected {
                background: #1d1d1f;
                color: #ffffff;
                font-weight: 500;
              }
              .ord-comuna--selected:hover { background: #424245; }

              .ord-totals {
                margin-top: 1rem;
                padding: 1rem 0 0.25rem;
                border-top: 1px solid #e6e6e6;
              }
              .ord-totals-row {
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                color: #1d1d1f;
                margin-bottom: 8px;
                font-variant-numeric: tabular-nums;
              }
              .ord-totals-row span:first-child { color: #6e6e73; }
              .ord-totals-total {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                font-size: 1.5rem;
                font-weight: 600;
                color: #1d1d1f;
                margin-top: 4px;
                padding-top: 12px;
                border-top: 1px solid #f0f0f2;
                font-variant-numeric: tabular-nums;
                letter-spacing: -0.022em;
              }
              .ord-totals-total span:first-child { font-weight: 500; }

              .ord-note {
                width: 100%;
                font-family: inherit;
                font-size: 14px;
                color: #1d1d1f;
                background: #f5f5f7;
                border: 1px solid transparent;
                border-radius: 12px;
                padding: 12px;
                resize: none;
                outline: none;
                line-height: 1.4;
                letter-spacing: -0.005em;
                transition: background 0.15s ease, border-color 0.15s ease;
              }
              .ord-note:focus {
                background: #ffffff;
                border-color: #0071e3;
              }

              .ord-cta {
                padding: 14px 1.25rem;
                padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px));
                flex-shrink: 0;
                border-top: 1px solid #e6e6e6;
                background: #ffffff;
              }
              .ord-btn-primary {
                width: 100%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                padding: 14px 20px;
                background: #1d1d1f;
                color: #ffffff;
                font-size: 0.9375rem;
                font-weight: 500;
                letter-spacing: -0.005em;
                border: none;
                border-radius: 980px;
                cursor: pointer;
                min-height: 50px;
                transition: background 0.15s ease, transform 0.15s ease;
              }
              .ord-btn-primary:hover { background: #424245; }
              .ord-btn-primary:active { transform: scale(0.98); }
              .ord-btn-primary:disabled {
                background: #424245;
                cursor: wait;
              }
              .ord-btn-secondary {
                width: 100%;
                padding: 14px 20px;
                background: #f5f5f7;
                color: #1d1d1f;
                font-size: 0.9375rem;
                font-weight: 500;
                border: none;
                border-radius: 980px;
                cursor: pointer;
                min-height: 50px;
                transition: background 0.15s ease;
              }
              .ord-btn-secondary:hover { background: #e6e6e8; }

              .ord-spinner {
                width: 18px;
                height: 18px;
                border: 2px solid rgba(255, 255, 255, 0.4);
                border-top-color: #ffffff;
                border-radius: 50%;
                display: inline-block;
                animation: ord-spin 0.7s linear infinite;
              }

              .ord-fineprint {
                font-size: 11px;
                color: #86868b;
                line-height: 1.4;
                margin: 10px 0 0;
                text-align: center;
                letter-spacing: -0.005em;
              }
              .ord-fineprint a {
                color: #0071e3;
                text-decoration: none;
              }

              /* Desktop: centrar el sheet en vez de full-width bottom (Apple Bag style) */
              @media (min-width: 768px) {
                .ord-sheet {
                  max-width: 480px;
                  left: 50%;
                  transform: translateX(-50%) !important;
                  bottom: 16px;
                  border-radius: 18px;
                  max-height: min(720px, 90vh);
                }
              }
            `}</style>
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
