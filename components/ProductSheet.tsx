"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import FocusTrap from "focus-trap-react";
import { useCartStore } from "@/lib/store";
import { fmt, fmtKg, getChips } from "@/lib/cart-utils";
import { hapticLight, hapticSuccess } from "@/lib/haptics";
import X from "./icons/X";
import Plus from "./icons/Plus";
import Minus from "./icons/Minus";
import ArrowRight from "./icons/ArrowRight";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  stock_kg: number;
  image_webp_url: string;
  image_url: string;
  copy: string;
  long_copy?: string | null;
  min_unit_kg: number;
  status: string;
}

interface Props {
  product: Product;
  onClose: () => void;
}

export default function ProductSheet({ product, onClose }: Props) {
  const chips = getChips(product.min_unit_kg);
  const [selectedChip, setSelectedChip] = useState<number | null>(chips[1]); // default: second chip
  const [showStepper, setShowStepper] = useState(false);
  const [customQty, setCustomQty] = useState(chips[1]);
  const [adding, setAdding] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const items = useCartStore((s) => s.items);
  const setOrderOpen = useCartStore((s) => s.setOrderOpen);

  const selectedQty = selectedChip ?? customQty;
  const price = product.price * selectedQty;
  const currentQty = items.find((item) => item.kind === "product" && item.id === product.id)?.qty ?? 0;
  const remainingQty = Math.max(0, product.stock_kg - currentQty);
  const exceedsStock = selectedQty > remainingQty;

  // Lock body scroll when sheet open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleChipSelect = useCallback((kg: number) => {
    if (kg > remainingQty) return;
    hapticLight();
    setSelectedChip(kg);
    setShowStepper(false);
  }, [remainingQty]);

  const handleStepperToggle = useCallback(() => {
    hapticLight();
    setShowStepper((v) => !v);
    setSelectedChip(null);
    setCustomQty(product.min_unit_kg);
  }, [product.min_unit_kg]);

  const stepQty = product.min_unit_kg;

  const stepDown = () => {
    const next = Math.max(product.min_unit_kg, +(customQty - stepQty).toFixed(3));
    setCustomQty(next);
    hapticLight();
  };

  const stepUp = () => {
    setCustomQty(Math.min(remainingQty, +(customQty + stepQty).toFixed(3)));
    hapticLight();
  };

  const handleAdd = async () => {
    if (adding) return;
    if (remainingQty < product.min_unit_kg || exceedsStock) {
      addToast(`Quedan ${Math.max(remainingQty, 0).toLocaleString("es-CL")} kg disponibles`, "info");
      return;
    }
    setAdding(true);
    hapticSuccess();

    addItem({
      kind: "product",
      id: product.id,
      qty: selectedQty,
      name: product.name,
      pricePerUnit: product.price,
    });

    addToast(`${product.name} agregado · ${fmtKg(selectedQty)}`);

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
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(18,5,3,0.55)",
          zIndex: 500,
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
        aria-hidden="true"
      />

      {/* Sheet */}
      <motion.div
        key="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalles de ${product.name}`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={{ top: 0, bottom: 0.3 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100 || info.velocity.y > 500) onClose();
        }}
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
        {/* Handle + close */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.25rem 0",
            flexShrink: 0,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 40,
              height: 4,
              borderRadius: 9999,
              background: "rgba(90,31,26,0.18)",
            }}
          />
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(90,31,26,0.08)",
              color: "#5A1F1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Imagen */}
        <div
          style={{
            margin: "1rem 1.25rem 0",
            borderRadius: "16px",
            overflow: "hidden",
            aspectRatio: "16/9",
            background: "#E6D4BE",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <Image
            src={product.image_webp_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 600px"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Contenido */}
        <div style={{ padding: "1.25rem 1.25rem 0", flexShrink: 0 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "1.5rem",
              color: "#5A1F1A",
              lineHeight: 1.2,
              marginBottom: "0.5rem",
            }}
          >
            {product.name}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9375rem",
              color: "#5E6B3E",
              lineHeight: 1.65,
              marginBottom: "0.5rem",
            }}
          >
            {product.long_copy || product.copy}
          </p>
          <a
            href={`/producto/${product.slug}`}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "#A8411A",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            Ver ficha completa
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Selector de cantidad */}
        <div style={{ padding: "1.5rem 1.25rem 0", flexShrink: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "#5A1F1A",
              marginBottom: "0.75rem",
            }}
          >
            ¿Cuánto vas a pedir?
          </p>

          {/* Chips de cantidad */}
          <div
            role="group"
            aria-label="Cantidad en kilogramos"
            style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
          >
            {chips.map((kg) => {
              const isSelected = selectedChip === kg;
              return (
                <button
                  key={kg}
                  onClick={() => handleChipSelect(kg)}
                  disabled={kg > remainingQty}
                  aria-pressed={isSelected}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: "0.9375rem",
                    padding: "0.625rem 1.125rem",
                    borderRadius: "9999px",
                    border: `2px solid ${isSelected ? "#A8411A" : "rgba(90,31,26,0.15)"}`,
                    background: isSelected ? "#A8411A" : "transparent",
                    color: kg > remainingQty ? "rgba(90,31,26,0.28)" : isSelected ? "#F4EADB" : "#5A1F1A",
                    cursor: kg > remainingQty ? "not-allowed" : "pointer",
                    transition: "all 0.15s ease",
                    WebkitTapHighlightColor: "transparent",
                    opacity: kg > remainingQty ? 0.55 : 1,
                  }}
                >
                  {fmtKg(kg)}
                </button>
              );
            })}

            {/* Toggle "Otra cantidad" */}
            <button
              onClick={handleStepperToggle}
              aria-expanded={showStepper}
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: showStepper ? 600 : 500,
                fontSize: "0.9375rem",
                padding: "0.625rem 1.125rem",
                borderRadius: "9999px",
                border: `2px solid ${showStepper ? "#5A1F1A" : "rgba(90,31,26,0.15)"}`,
                background: showStepper ? "#5A1F1A" : "transparent",
                color: showStepper ? "#F4EADB" : "#5E6B3E",
                cursor: "pointer",
                transition: "all 0.15s ease",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              Otra cantidad
            </button>
          </div>

          {/* Stepper expandible */}
          <AnimatePresence>
            {showStepper && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginTop: "1rem",
                    padding: "1rem",
                    background: "rgba(90,31,26,0.05)",
                    borderRadius: "12px",
                  }}
                >
                  <button
                    onClick={stepDown}
                    disabled={customQty <= product.min_unit_kg}
                    aria-label="Menos"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: customQty <= product.min_unit_kg ? "rgba(90,31,26,0.08)" : "#5A1F1A",
                      color: customQty <= product.min_unit_kg ? "#5A1F1A80" : "#F4EADB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "none",
                      cursor: customQty <= product.min_unit_kg ? "not-allowed" : "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <Minus size={16} />
                  </button>

                  <div style={{ flex: 1, textAlign: "center" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "1.375rem",
                        color: "#5A1F1A",
                      }}
                    >
                      {Math.round(customQty / product.min_unit_kg)} {Math.round(customQty / product.min_unit_kg) === 1 ? "bolsa" : "bolsas"}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        color: "#5E6B3E",
                        marginTop: "2px",
                      }}
                    >
                      {fmtKg(customQty)} · bolsa de {fmtKg(product.min_unit_kg)}
                    </p>
                  </div>

                  <button
                    onClick={stepUp}
                    disabled={customQty >= remainingQty}
                    aria-label="Más"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: customQty >= remainingQty ? "rgba(90,31,26,0.08)" : "#5A1F1A",
                      color: customQty >= remainingQty ? "#5A1F1A80" : "#F4EADB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "none",
                      cursor: customQty >= remainingQty ? "not-allowed" : "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: exceedsStock ? "#B74432" : "#5E6B3E", lineHeight: 1.5, marginTop: 12 }}>
            {remainingQty <= 0
              ? "Ya no queda stock disponible para agregar."
              : exceedsStock
                ? `Solo quedan ${fmtKg(remainingQty)} disponibles en este momento.`
                : `Disponibles ahora: ${fmtKg(remainingQty)}.`}
          </p>
        </div>

        {/* Precio en tiempo real + CTA */}
        <div
          style={{
            padding: "1.25rem 1.25rem",
            paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))",
            marginTop: "auto",
            flexShrink: 0,
            background: "#F4EADB",
            borderTop: "1px solid rgba(90,31,26,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* Precio */}
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "#5E6B3E",
                fontWeight: 500,
              }}
            >
              {selectedQty === product.min_unit_kg ? "1 bolsa" : `${Math.round(selectedQty / product.min_unit_kg)} bolsas`} · {fmtKg(selectedQty)}
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "#5A1F1A",
                lineHeight: 1.1,
              }}
            >
              {fmt(price)}
            </p>
          </div>

          {/* Botón agregar */}
          <button
            onClick={handleAdd}
            disabled={adding || remainingQty < product.min_unit_kg || exceedsStock}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "1rem",
              color: "#F4EADB",
              background: adding ? "#A84019" : remainingQty < product.min_unit_kg || exceedsStock ? "#C0B0A8" : "#A8411A",
              border: "none",
              borderRadius: "12px",
              padding: "0.875rem 1.5rem",
              cursor: adding || remainingQty < product.min_unit_kg || exceedsStock ? "not-allowed" : "pointer",
              transition: "background 0.15s, transform 0.1s",
              transform: adding ? "scale(0.97)" : "scale(1)",
              whiteSpace: "nowrap",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {remainingQty < product.min_unit_kg
              ? "Sin stock"
              : exceedsStock
                ? "Ajusta la cantidad"
                : adding ? "Agregando..." : "Agregar al pedido"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
      </div>
    </FocusTrap>
  );
}
