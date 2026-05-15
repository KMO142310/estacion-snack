"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FocusTrap from "focus-trap-react";
import { useCartStore } from "@/lib/store";
import { fmt, fmtKg } from "@/lib/cart-utils";
import { computeSavings, getPackAvailability, totalKg, type Pack, type ProductStock } from "@/lib/pack-utils";
import { hapticSuccess } from "@/lib/haptics";
import X from "./icons/X";

interface Props {
  pack: Pack;
  products: ProductStock[];
  onClose: () => void;
}

export default function PackSheet({ pack, products, onClose }: Props) {
  const [adding, setAdding] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const { sueltoTotal, savings } = computeSavings(pack);
  const { units } = getPackAvailability(pack, products);
  const totalWeight = totalKg(pack);
  const isLow = units > 0 && units <= 3;

  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const setOrderOpen = useCartStore((s) => s.setOrderOpen);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 960px)");
    const sync = () => setIsDesktop(media.matches);
    sync();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", sync);
      return () => media.removeEventListener("change", sync);
    }

    media.addListener(sync);
    return () => media.removeListener(sync);
  }, []);

  const handleAdd = async () => {
    if (adding || units === 0) return;

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

    await new Promise((resolve) => setTimeout(resolve, 250));
    setAdding(false);
    onClose();
    setTimeout(() => setOrderOpen(true), 300);
  };

  const ctaLabel = units === 0
    ? "Momentáneamente agotado"
    : adding
      ? "Agregando..."
      : `Agregar ${pack.name} · ${fmt(pack.price)}`;

  const ctaBg = units === 0 ? "rgba(140, 133, 121, 0.7)" : adding ? "#8F3715" : "#A8411A";
  const ctaHoverBg = units === 0 ? "rgba(140, 133, 121, 0.7)" : "#8F3715";
  const ctaCursor = adding || units === 0 ? "not-allowed" : "pointer";

  const sheetStyles = `
    .pks-frame {
      position: fixed;
      inset: 0;
      z-index: 600;
      display: flex;
      justify-content: center;
      pointer-events: none;
    }
    .pks-frame-mobile {
      align-items: flex-end;
    }
    .pks-frame-desktop {
      align-items: center;
      padding: 1.5rem;
    }
    .pks-sheet {
      width: 100%;
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background:
        radial-gradient(circle at top left, rgba(168, 65, 26, 0.08), transparent 34%),
        linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,241,231,0.98) 100%);
      border: 1px solid rgba(90, 31, 26, 0.1);
      box-shadow: 0 24px 56px -36px rgba(90, 31, 26, 0.4);
    }
    .pks-sheet-mobile {
      max-height: min(92vh, 920px);
      border-radius: 30px 30px 0 0;
    }
    .pks-sheet-desktop {
      width: min(980px, calc(100vw - 3rem));
      max-height: min(86vh, 760px);
      border-radius: 32px;
    }
    .pks-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.9rem 1rem 0.45rem;
      flex-shrink: 0;
    }
    .pks-handle {
      width: 44px;
      height: 5px;
      margin-left: auto;
      border-radius: 999px;
      background: rgba(90, 31, 26, 0.16);
    }
    .pks-close {
      width: 40px;
      height: 40px;
      margin-left: auto;
      border: none;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(90, 31, 26, 0.08);
      color: #5A1F1A;
      cursor: pointer;
    }
    .pks-scroll {
      overflow-y: auto;
      padding: 0 1rem 1rem;
    }
    .pks-hero {
      display: grid;
      gap: 0.95rem;
    }
    .pks-media {
      position: relative;
      min-height: 230px;
      aspect-ratio: 1.06 / 1;
      overflow: hidden;
      border-radius: 24px;
      border: 1px solid rgba(90, 31, 26, 0.08);
      background:
        radial-gradient(circle at top left, rgba(255,255,255,0.5), transparent 42%),
        linear-gradient(180deg, #F7F0E5 0%, #F0E6D9 100%);
    }
    .pks-chip {
      position: absolute;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      min-height: 32px;
      padding: 0.4rem 0.72rem;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.03em;
    }
    .pks-chip-top {
      top: 0.8rem;
      left: 0.8rem;
      background: rgba(255,255,255,0.92);
      color: #5A1F1A;
    }
    .pks-chip-badge,
    .pks-chip-out {
      right: 0.8rem;
      bottom: 0.8rem;
      color: #FBF8F3;
      background: rgba(29, 29, 31, 0.92);
    }
    .pks-chip-out {
      background: rgba(90, 31, 26, 0.82);
    }
    .pks-summary {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      border-radius: 24px;
      border: 1px solid rgba(90, 31, 26, 0.08);
      background: rgba(255,255,255,0.72);
    }
    .pks-summary-top {
      display: grid;
      gap: 0.45rem;
    }
    .pks-kicker-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }
    .pks-kicker,
    .pks-total {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .pks-kicker {
      color: #A8411A;
    }
    .pks-total {
      color: rgba(90, 31, 26, 0.56);
    }
    .pks-title {
      margin: 0;
      font-family: var(--font-display);
      font-size: clamp(1.65rem, 5vw, 2.35rem);
      font-weight: 600;
      line-height: 1;
      letter-spacing: -0.03em;
      color: #5A1F1A;
    }
    .pks-tagline {
      margin: 0;
      font-size: 0.96rem;
      line-height: 1.65;
      color: #6B6459;
    }
    .pks-price-box {
      display: grid;
      gap: 0.35rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(90, 31, 26, 0.08);
    }
    .pks-price-row {
      display: flex;
      align-items: baseline;
      gap: 0.65rem;
      flex-wrap: wrap;
      font-variant-numeric: tabular-nums;
    }
    .pks-price {
      font-family: var(--font-display);
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1;
      color: #5A1F1A;
    }
    .pks-price-strike {
      font-size: 0.9rem;
      color: rgba(90, 31, 26, 0.52);
      text-decoration: line-through;
    }
    .pks-price-note {
      margin: 0;
      font-size: 0.86rem;
      line-height: 1.55;
      color: #A8411A;
      font-weight: 600;
    }
    .pks-facts {
      display: flex;
      flex-wrap: wrap;
      gap: 0.55rem;
    }
    .pks-fact {
      display: inline-flex;
      align-items: center;
      min-height: 34px;
      padding: 0.45rem 0.78rem;
      border-radius: 999px;
      background: rgba(90, 31, 26, 0.06);
      color: #5A1F1A;
      font-size: 0.78rem;
      font-weight: 600;
    }
    .pks-body-grid {
      display: grid;
      gap: 0.95rem;
      margin-top: 0.95rem;
    }
    .pks-block {
      padding: 1rem;
      border-radius: 24px;
      border: 1px solid rgba(90, 31, 26, 0.08);
      background: rgba(255,255,255,0.78);
    }
    .pks-block-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.85rem;
    }
    .pks-block-head h3 {
      margin: 0;
      font-family: var(--font-display);
      font-size: 1.08rem;
      font-weight: 600;
      color: #5A1F1A;
    }
    .pks-block-head p {
      margin: 0;
      font-size: 0.8rem;
      color: rgba(90, 31, 26, 0.56);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .pks-items {
      display: grid;
      gap: 0.7rem;
    }
    .pks-item-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.85rem;
      padding: 0.85rem 0.9rem;
      border-radius: 18px;
      background: rgba(244, 238, 227, 0.9);
      border: 1px solid rgba(90, 31, 26, 0.05);
    }
    .pks-item-name {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: #5A1F1A;
    }
    .pks-item-note {
      margin: 0.18rem 0 0;
      font-size: 0.8rem;
      color: #6B6459;
    }
    .pks-item-kg {
      flex-shrink: 0;
      font-size: 0.87rem;
      font-weight: 700;
      color: #5E6B3E;
    }
    .pks-block-note {
      align-content: start;
    }
    .pks-note-copy,
    .pks-note-alert {
      margin: 0;
      font-size: 0.92rem;
      line-height: 1.65;
      color: #6B6459;
    }
    .pks-note-alert {
      margin-top: 0.75rem;
      color: #A8411A;
      font-weight: 600;
    }
    .pks-footer {
      flex-shrink: 0;
      padding: 1rem;
      padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
      border-top: 1px solid rgba(90, 31, 26, 0.08);
      background: rgba(251, 248, 243, 0.92);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .pks-cta {
      width: 100%;
      min-height: 52px;
      border: none;
      border-radius: 16px;
      padding: 0.95rem 1rem;
      background: ${ctaBg};
      color: #FBF8F3;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      cursor: ${ctaCursor};
    }
    @media (hover: hover) {
      .pks-cta:hover {
        background: ${ctaHoverBg};
      }
    }
    @media (min-width: 960px) {
      .pks-head {
        padding: 1rem 1rem 0.25rem;
      }
      .pks-scroll {
        padding: 0 1rem 1rem;
      }
      .pks-hero {
        grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
        align-items: stretch;
      }
      .pks-media {
        min-height: 100%;
        aspect-ratio: auto;
      }
      .pks-summary {
        min-height: 100%;
      }
      .pks-body-grid {
        grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
        align-items: start;
      }
    }
  `;

  const sheetContent = (
    <>
      <div className="pks-head">
        {!isDesktop && <span className="pks-handle" aria-hidden="true" />}
        <button type="button" onClick={onClose} aria-label="Cerrar" className="pks-close">
          <X size={18} />
        </button>
      </div>

      <div className="pks-scroll">
        <div className="pks-hero">
          <div className="pks-media">
            <Image
              src={pack.image_400_url || pack.image_webp_url}
              alt={pack.name}
              fill
              sizes={isDesktop ? "(max-width: 1200px) 40vw, 420px" : "92vw"}
              style={{ objectFit: "cover" }}
            />

            <span className="pks-chip pks-chip-top">Pack listo</span>
            <span className={`pks-chip ${units === 0 ? "pks-chip-out" : "pks-chip-badge"}`}>
              {units === 0
                ? "Sin stock"
                : isLow
                  ? units === 1
                    ? "Última unidad"
                    : `Últimas ${units} unidades`
                  : pack.badge || `${totalWeight} kg total`}
            </span>
          </div>

          <div className="pks-summary">
            <div className="pks-summary-top">
              <div className="pks-kicker-row">
                <span className="pks-kicker">Pack armado</span>
                <span className="pks-total">{totalWeight} kg total</span>
              </div>
              <h2 className="pks-title">{pack.name}</h2>
              <p className="pks-tagline">{pack.tagline}</p>
            </div>

            <div className="pks-price-box">
              <div className="pks-price-row">
                <span className="pks-price">{fmt(pack.price)}</span>
                {savings > 0 && <span className="pks-price-strike">{fmt(sueltoTotal)}</span>}
              </div>
              <p className="pks-price-note">
                {savings > 0
                  ? `Ahorras ${fmt(savings)} frente a comprarlo por separado.`
                  : "Cada producto va en su propia bolsa y se suma directo al pedido."}
              </p>
            </div>

            <div className="pks-facts" aria-label="Detalles del pack">
              <span className="pks-fact">Bolsas separadas</span>
              <span className="pks-fact">Stock visible</span>
              <span className="pks-fact">Cierre por WhatsApp</span>
            </div>
          </div>
        </div>

        <div className="pks-body-grid">
          <section className="pks-block" aria-label="Qué incluye el pack">
            <div className="pks-block-head">
              <h3>Qué incluye</h3>
              <p>{pack.items.length} productos</p>
            </div>

            <div className="pks-items">
              {pack.items.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="pks-item-row">
                  <div>
                    <p className="pks-item-name">{item.name}</p>
                    <p className="pks-item-note">Bolsa individual</p>
                  </div>
                  <span className="pks-item-kg">{fmtKg(item.kg)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="pks-block pks-block-note" aria-label="Cómo se coordina">
            <div className="pks-block-head">
              <h3>Cómo llega</h3>
              <p>Sin vueltas</p>
            </div>
            <p className="pks-note-copy">
              Armamos el pack tal como aparece en el catálogo y luego coordinamos comuna, horario y pago por WhatsApp.
            </p>
            {isLow && (
              <p className="pks-note-alert">
                Quedan pocas unidades por el stock actual de sus componentes.
              </p>
            )}
          </section>
        </div>
      </div>

      <div className="pks-footer">
        <button
          type="button"
          onClick={handleAdd}
          disabled={adding || units === 0}
          className="pks-cta"
        >
          {ctaLabel}
        </button>
      </div>
    </>
  );

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
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(18, 5, 3, 0.54)",
              zIndex: 500,
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
            aria-hidden="true"
          />

          <div className={`pks-frame ${isDesktop ? "pks-frame-desktop" : "pks-frame-mobile"}`}>
            {isDesktop ? (
              <motion.div
                key="pack-sheet-desktop"
                role="dialog"
                aria-modal="true"
                aria-label={`Detalles de ${pack.name}`}
                className="pks-sheet pks-sheet-desktop"
                initial={{ opacity: 0, y: 24, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.985 }}
                transition={{ duration: 0.22 }}
              >
                {sheetContent}
              </motion.div>
            ) : (
              <motion.div
                key="pack-sheet-mobile"
                role="dialog"
                aria-modal="true"
                aria-label={`Detalles de ${pack.name}`}
                className="pks-sheet pks-sheet-mobile"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                drag="y"
                dragConstraints={{ top: 0 }}
                dragElastic={{ top: 0, bottom: 0.26 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 110 || info.velocity.y > 500) onClose();
                }}
              >
                {sheetContent}
              </motion.div>
            )}
            <style>{sheetStyles}</style>
          </div>
        </AnimatePresence>
      </div>
    </FocusTrap>
  );
}
