"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FocusTrap from "focus-trap-react";
import { useCartStore } from "@/lib/store";
import { fmt, fmtKg } from "@/lib/cart-utils";
import { computeSavings, getPackAvailability, type Pack, type ProductStock } from "@/lib/pack-utils";
import { hapticSuccess } from "@/lib/haptics";
import X from "./icons/X";

interface Props {
  pack: Pack;
  products: ProductStock[];
  onClose: () => void;
}

export default function PackSheet({ pack, products, onClose }: Props) {
  const [adding, setAdding] = useState(false);
  const { sueltoTotal, savings } = computeSavings(pack);
  const { units } = getPackAvailability(pack, products);
  const isLow = units > 0 && units <= 3;

  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const setOrderOpen = useCartStore((s) => s.setOrderOpen);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleAdd = async () => {
    if (adding) return;
    setAdding(true);
    hapticSuccess();

    addItem({
      kind: "pack",
      id: pack.id,
      qty: 1,
      name: pack.name,
      pricePerUnit: pack.price,
    });

    addToast(`${pack.name} agregado al pedido`);

    await new Promise((r) => setTimeout(r, 250));
    setAdding(false);
    onClose();
    setTimeout(() => setOrderOpen(true), 300);
  };

  return (
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
    <AnimatePresence>
      <motion.div
        key="pack-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(18,5,3,0.55)", zIndex: 500, backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}
        aria-hidden="true"
      />

      <motion.div
        key="pack-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalles de ${pack.name}`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={{ top: 0, bottom: 0.3 }}
        onDragEnd={(_, info) => { if (info.offset.y > 100 || info.velocity.y > 500) onClose(); }}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 600,
          background: "#F4EADB",
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -8px 56px rgba(90,31,26,0.18)",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Handle + cerrar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem 0", flexShrink: 0 }}>
          <div aria-hidden="true" style={{ width: 40, height: 4, borderRadius: 9999, background: "rgba(90,31,26,0.18)" }} />
          <button onClick={onClose} aria-label="Cerrar" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(90,31,26,0.08)", color: "#5A1F1A", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "1.25rem", overflowY: "auto" }}>
          {/* Nombre y tagline */}
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.625rem", color: "#5A1F1A", marginBottom: "0.375rem" }}>
            {pack.name}
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5E6B3E", lineHeight: 1.55, marginBottom: isLow ? "0.75rem" : "1.5rem" }}>
            {pack.tagline}
          </p>

          {isLow && (
            <div style={{ background: "rgba(208,85,31,0.10)", border: "1px solid rgba(208,85,31,0.25)", borderRadius: "10px", padding: "0.625rem 0.875rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, fontFamily: "var(--font-body)", color: "#A8411A" }}>
                Últimas {units} {units === 1 ? "unidad disponible" : "unidades disponibles"}
              </span>
            </div>
          )}

          {/* Qué incluye */}
          <div style={{ marginBottom: "1.5rem" }}>
            {pack.items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 0", borderBottom: i < pack.items.length - 1 ? "1px solid rgba(90,31,26,0.06)" : "none" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5A1F1A", flex: 1 }}>
                  {item.name}
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600, color: "#5E6B3E" }}>
                  {fmtKg(item.kg)}
                </span>
              </div>
            ))}
          </div>

          {/* Precio — simple y directo */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.625rem", marginBottom: "0.25rem" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.75rem", color: "#5A1F1A" }}>{fmt(pack.price)}</span>
            {savings > 0 && (
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "#5E6B3E", textDecoration: "line-through" }}>{fmt(sueltoTotal)}</span>
            )}
          </div>
          {savings > 0 && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "#A8411A", fontWeight: 600, marginBottom: "1rem" }}>
              Ahorras {fmt(savings)} vs comprar por separado
            </p>
          )}
        </div>

        {/* CTA fijo */}
        <div style={{
          padding: "1rem 1.25rem",
          paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))",
          flexShrink: 0,
          borderTop: "1px solid rgba(90,31,26,0.08)",
          background: "#F4EADB",
        }}>
          <button
            onClick={handleAdd}
            disabled={adding || units === 0}
            style={{
              width: "100%",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "1.0625rem",
              color: "#F4EADB",
              background: units === 0 ? "#C0B0A8" : adding ? "#A84019" : "#A8411A",
              border: "none",
              borderRadius: "12px",
              padding: "1rem",
              cursor: adding || units === 0 ? "not-allowed" : "pointer",
              transition: "background 0.15s",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {units === 0 ? "Momentáneamente agotado" : adding ? "Agregando..." : `Agregar ${pack.name} al pedido · ${fmt(pack.price)}`}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
      </div>
    </FocusTrap>
  );
}
