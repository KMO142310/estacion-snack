"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { placeOrder } from "@/lib/actions";
import { trackBeginCheckout, trackPurchase } from "@/lib/analytics";
import { fmt } from "@/lib/products";
import type { Product } from "@/lib/types";

// Zona única de despacho — expansión futura vía shipping_zones.is_visible
const COMUNA_ENTREGA = "Santa Cruz";

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("569") && digits.length === 11) return `+${digits}`;
  if (digits.startsWith("9") && digits.length === 9) return `+56${digits}`;
  if (digits.startsWith("56") && digits.length === 11) return `+${digits}`;
  return raw.trim();
}

function isValidChileanPhone(raw: string): boolean {
  return /^\+569\d{8}$/.test(normalizePhone(raw));
}

interface Props {
  open: boolean;
  onClose: () => void;
  products: Product[];
}

export default function Drawer({ open, onClose, products }: Props) {
  const { items, sessionId, secondsLeft, updateQty, removeItem, clearCart, totalPrice } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [phoneErr, setPhoneErr] = useState(false);
  const [addressErr, setAddressErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const cartEntries = Object.entries(items).filter(([, qty]) => qty > 0);
  const subtotal = totalPrice(products);
  const total = subtotal; // Envío gratis — Santa Cruz

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSend = async () => {
    let valid = true;
    if (!name.trim()) { setNameErr(true); valid = false; }
    if (!isValidChileanPhone(phone)) { setPhoneErr(true); valid = false; }
    if (address.trim().length < 4) { setAddressErr(true); valid = false; }
    if (!valid) return;
    if (!sessionId) { showToast("Recargá la página e intentá de nuevo"); return; }
    if (cartEntries.length === 0) return;

    setLoading(true);
    const itemsArr = cartEntries.map(([id, qty]) => ({ product_id: id, qty }));
    const trackedItems = cartEntries
      .map(([id, qty]) => {
        const p = products.find((x) => x.id === id);
        if (!p) return null;
        return { id: p.id, name: p.name, price: p.price, category: p.cat_label, qty };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    trackBeginCheckout(trackedItems, total);

    const notesWithComuna = [
      `Dirección: ${address.trim() || "—"}`,
      notes.trim(),
    ].filter(Boolean).join(" | ");

    const result = await placeOrder({
      sessionId,
      customerName: name.trim(),
      customerPhone: normalizePhone(phone),
      items: itemsArr,
      notes: notesWithComuna || undefined,
    });
    setLoading(false);

    if (!result.ok) {
      showToast("Error: " + result.error);
      return;
    }

    if (result.orderId) {
      trackPurchase(result.orderId, trackedItems, total);
    }

    clearCart();
    onClose();
    window.open(result.waUrl, "_blank");
    if (result.orderId) {
      window.location.href = `/pedido/${result.orderId}`;
    }
  };

  const fmtCountdown = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(26,24,22,.5)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition: "opacity .3s",
        }}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tu pedido"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 210,
          background: "var(--bg)",
          transform: open ? "translateY(0)" : "translateY(105%)",
          transition: "transform .4s cubic-bezier(.32,.72,0,1)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "92dvh",
          borderTop: "2px solid rgba(0,0,0,.06)",
          borderRadius: "20px 20px 0 0",
        }}
        className="drawer-panel"
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: "rgba(0,0,0,.12)", borderRadius: 2, margin: "8px auto 0" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "2px solid rgba(0,0,0,.04)" }}>
          <h3 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 22 }}>Tu pedido</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar carrito"
            style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,0,0,.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "var(--sub)", border: "none", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {cartEntries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🛒</div>
              <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Tu carrito está vacío</p>
              <span style={{ fontSize: 13, color: "var(--sub)" }}>Agrega productos para empezar</span>
            </div>
          ) : (
            <>
              {/* Reservation countdown */}
              {secondsLeft !== null && (
                <div style={{ background: "var(--orange-soft)", borderRadius: 12, padding: "10px 14px", marginBottom: 12, fontSize: 13, fontWeight: 700, color: "var(--orange)" }}>
                  Reserva válida por {fmtCountdown(secondsLeft)}
                </div>
              )}

              {/* Items */}
              {cartEntries.map(([productId, qty]) => {
                const product = products.find((p) => p.id === productId);
                if (!product) return null;
                return (
                  <div key={productId} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: "1px solid rgba(0,0,0,.05)" }}>
                    <div style={{ width: 52, height: 60, borderRadius: 10, flexShrink: 0, background: "var(--orange-soft)", overflow: "hidden" }}>
                      <picture>
                        <source srcSet={product.image_webp_url} type="image/webp" />
                        <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                      </picture>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{product.name}</div>
                      <div style={{ fontSize: 12, color: "var(--sub)" }}>{fmt(product.price)} / kg</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 15, fontWeight: 800 }}>{fmt(product.price * qty)}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", border: "2px solid rgba(0,0,0,.1)", borderRadius: 10, overflow: "hidden" }}>
                          <button onClick={() => updateQty(product, Math.max(0, qty - 0.5))} style={{ width: 36, height: 32, background: "none", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                          <span style={{ padding: "0 10px", fontSize: 13, fontWeight: 800, borderLeft: "2px solid rgba(0,0,0,.1)", borderRight: "2px solid rgba(0,0,0,.1)", height: 32, display: "flex", alignItems: "center" }}>{qty} kg</span>
                          <button onClick={() => updateQty(product, qty + 0.5)} style={{ width: 36, height: 32, background: "none", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                        </div>
                        <button onClick={() => removeItem(productId)} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,0,0,.04)", color: "var(--sub)", fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label={`Quitar ${product.name}`}>
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Subtotal + envío + total */}
              <div style={{ padding: "12px 0", borderTop: "1px solid rgba(0,0,0,.06)", marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--sub)", marginBottom: 6 }}>
                  <span>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
                  <span style={{ color: "var(--sub)" }}>Envío · {COMUNA_ENTREGA}</span>
                  <span style={{ color: "var(--green)", fontWeight: 700 }}>Gratis</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "3px solid var(--text)", paddingTop: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--sub)" }}>Total</span>
                  <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-.02em" }}>{fmt(total)}</span>
                </div>
              </div>

              {/* Entrega info */}
              <div style={{ background: "var(--green-soft)", borderRadius: 14, padding: 14, marginBottom: 12, fontSize: 13, color: "var(--sub)", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--text)", display: "block", marginBottom: 2 }}>Entrega coordinada · Santa Cruz</strong>
                Coordinamos día y horario exacto por WhatsApp tras confirmar el pedido.
              </div>

              {/* Customer form */}
              <label htmlFor="drawer-name" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--sub)", display: "block", marginBottom: 5 }}>
                Tu nombre
              </label>
              <input
                id="drawer-name"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameErr(false); }}
                placeholder="Nombre completo"
                autoComplete="name"
                aria-invalid={nameErr}
                aria-describedby={nameErr ? "drawer-name-err" : undefined}
                style={{
                  width: "100%",
                  padding: 12,
                  background: "rgba(0,0,0,.03)",
                  border: `2px solid ${nameErr ? "var(--red)" : "rgba(0,0,0,.06)"}`,
                  borderRadius: 12,
                  fontSize: 14,
                  color: "var(--text)",
                  outline: "none",
                  marginBottom: nameErr ? 4 : 12,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              {nameErr && (
                <p id="drawer-name-err" role="alert" style={{ fontSize: 11, color: "var(--red)", marginBottom: 12 }}>
                  Ingresa tu nombre
                </p>
              )}

              <label htmlFor="drawer-phone" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--sub)", display: "block", marginBottom: 5 }}>
                Tu celular
              </label>
              <input
                id="drawer-phone"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setPhoneErr(false); }}
                placeholder="+56 9 XXXX XXXX"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                aria-invalid={phoneErr}
                aria-describedby={phoneErr ? "drawer-phone-err" : undefined}
                style={{
                  width: "100%",
                  padding: 12,
                  background: "rgba(0,0,0,.03)",
                  border: `2px solid ${phoneErr ? "var(--red)" : "rgba(0,0,0,.06)"}`,
                  borderRadius: 12,
                  fontSize: 14,
                  color: "var(--text)",
                  outline: "none",
                  marginBottom: phoneErr ? 4 : 12,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              {phoneErr && (
                <p id="drawer-phone-err" role="alert" style={{ fontSize: 11, color: "var(--red)", marginBottom: 12 }}>
                  Ingresa un celular válido: +569XXXXXXXX
                </p>
              )}

              <label htmlFor="drawer-address" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--sub)", display: "block", marginBottom: 5 }}>
                Dirección de entrega
              </label>
              <input
                id="drawer-address"
                value={address}
                onChange={(e) => { setAddress(e.target.value); setAddressErr(false); }}
                placeholder="Calle, número, sector…"
                autoComplete="street-address"
                aria-invalid={addressErr}
                aria-describedby={addressErr ? "drawer-address-err" : undefined}
                style={{
                  width: "100%",
                  padding: 12,
                  background: "rgba(0,0,0,.03)",
                  border: `2px solid ${addressErr ? "var(--red)" : "rgba(0,0,0,.06)"}`,
                  borderRadius: 12,
                  fontSize: 14,
                  color: "var(--text)",
                  outline: "none",
                  marginBottom: addressErr ? 4 : 12,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              {addressErr && (
                <p id="drawer-address-err" role="alert" style={{ fontSize: 11, color: "var(--red)", marginBottom: 12 }}>
                  Ingresa tu dirección de entrega
                </p>
              )}

              <label htmlFor="drawer-notes" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--sub)", display: "block", marginBottom: 5 }}>
                Notas (opcional)
              </label>
              <input
                id="drawer-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Horario preferido, alguna indicación…"
                style={{
                  width: "100%",
                  padding: 12,
                  background: "rgba(0,0,0,.03)",
                  border: "2px solid rgba(0,0,0,.06)",
                  borderRadius: 12,
                  fontSize: 14,
                  color: "var(--text)",
                  outline: "none",
                  marginBottom: 4,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <p style={{ fontSize: 11, color: "var(--sub)", marginBottom: 12 }}>
                Pago: transferencia bancaria o efectivo al recibir.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        {cartEntries.length > 0 && (
          <div style={{ padding: "12px 20px calc(env(safe-area-inset-bottom, 12px) + 12px)", borderTop: "2px solid rgba(0,0,0,.04)" }}>
            <button
              onClick={handleSend}
              disabled={loading}
              style={{
                width: "100%",
                padding: 16,
                background: "#1A7A42",
                color: "#fff",
                fontSize: 15,
                fontWeight: 800,
                borderRadius: 14,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {loading ? "Procesando…" : "Pedir por WhatsApp"}
            </button>
            <p style={{ textAlign: "center", fontSize: 11, color: "var(--sub)", marginTop: 8 }}>
              Pago: transferencia o efectivo · Se abrirá WhatsApp con tu pedido
            </p>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 400,
            background: "var(--text)",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "var(--r-full)",
            fontSize: 14,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {toast}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .drawer-panel {
            top: 0 !important;
            bottom: 0 !important;
            left: auto !important;
            width: 420px !important;
            max-height: none !important;
            border-top: none !important;
            border-left: 2px solid rgba(0,0,0,.06) !important;
            border-radius: 0 !important;
            transform: translateX(${open ? "0" : "105%"}) !important;
          }
        }
      `}</style>
    </>
  );
}
