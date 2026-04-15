"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { fmt } from "@/lib/cart-utils";
import { useCartStore } from "@/lib/store";
import { spring } from "@/lib/motion-tokens";
import StampButton from "./StampButton";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image_webp_url: string;
  image_url: string;
  badge: string | null;
  status: string;
  copy?: string;
  occasion?: string | null;
}

interface Props {
  product: Product;
  onOpen: () => void;
}

// Rediseño editorial:
// - La OCASIÓN es el hook (no la lista de ingredientes). Va en Fraunces italic
//   antes del nombre, como un "maridaje" de vino.
// - Sin box-shadow fuerte; la card respira dentro del layout sin verse como un botón.
// - Nombre con jerarquía clara, precio sobrio debajo.
// - Botón secundario visual: la tarjeta ENTERA es el tap target; el botón "Agregar" es CTA, no un "Comprar ya" gritado.
export default function ProductCard({ product, onOpen }: Props) {
  const { name, price, image_webp_url, badge, status, occasion } = product;
  const [added, setAdded] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const cardRef = useRef<HTMLElement | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const reducedMotion = useReducedMotion();
  const agotado = status === "agotado";
  const ultimoKg = status === "ultimo_kg";

  // Letterpress reveal — primera vez que la card entra en viewport.
  // IntersectionObserver (nativo, sin dependencias). Solo primera aparición.
  useEffect(() => {
    if (revealed) return;
    const el = cardRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setRevealed(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { rootMargin: "-40px 0px -40px 0px", threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [revealed]);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (agotado || added) return;
    // haptic orchestration viene de StampButton (chip + stamp)
    addItem({ kind: "product", id: product.id, qty: 1, name, pricePerUnit: price });
    addToast(`${name} · 1 kg`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const shouldAnimate = !reducedMotion && !revealed;

  return (
    <motion.article
      ref={cardRef as React.RefObject<HTMLElement>}
      onClick={agotado ? undefined : onOpen}
      role={agotado ? undefined : "button"}
      tabIndex={agotado ? undefined : 0}
      aria-label={agotado ? `${name} — agotado` : `Ver ${name}`}
      onKeyDown={(e) => { if (!agotado && (e.key === "Enter" || e.key === " ")) onOpen(); }}
      className={agotado ? undefined : "pcard"}
      initial={shouldAnimate ? { opacity: 0, y: 8, scale: 0.995 } : false}
      animate={revealed || reducedMotion ? { opacity: agotado ? 0.5 : 1, y: 0, scale: 1 } : undefined}
      transition={spring.arrive}
      style={{
        background: "transparent",
        overflow: "hidden",
        cursor: agotado ? "default" : "pointer",
        WebkitTapHighlightColor: "transparent",
        willChange: "transform, opacity",
      }}
    >
      {/* Foto */}
      <div style={{ position: "relative", aspectRatio: "4/5", background: "#EDE4D6", borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
        <Image src={image_webp_url} alt="" fill sizes="(max-width:640px) 50vw,33vw"
          style={{ objectFit: "cover" }} placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0VERTRENiI+PC9yZWN0Pjwvc3ZnPg==" />
        {(badge || ultimoKg) && (
          <span style={{
            position: "absolute", top: 10, left: 10,
            background: ultimoKg ? "#5A1F1A" : "#A8411A",
            color: "#F4EADB", fontSize: 10, fontWeight: 700,
            fontFamily: "var(--font-body)", padding: "4px 10px",
            borderRadius: 30, letterSpacing: "0.05em", textTransform: "uppercase",
          }}>
            {badge || "Último kg"}
          </span>
        )}
      </div>

      {/* Info — estilo editorial */}
      <div style={{ padding: "0 2px" }}>
        {/* Ocasión como hook (como maridaje de vino).
            Se preserva incluso en stock=0 con opacidad reducida — la
            narrativa editorial no desaparece cuando el producto se agota. */}
        {occasion && (
          <p style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 13,
            color: "#5E6B3E",
            lineHeight: 1.35,
            marginBottom: 6,
            opacity: agotado ? 0.55 : 1,
          }}>
            {occasion}
          </p>
        )}

        {/* Nombre */}
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 18,
          color: "#5A1F1A",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: 6,
        }}>
          {name}
        </h3>

        {/* Precio — sobrio */}
        <p className="price" style={{
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          fontSize: 14,
          color: agotado ? "#aaa" : "#5A1F1A",
          marginBottom: 12,
        }}>
          {agotado ? "Agotado" : (
            <>
              {fmt(price)}
              <span style={{ fontWeight: 400, color: "rgba(90,31,26,0.55)", marginLeft: 4 }}>· 1 kg</span>
            </>
          )}
        </p>

        {/* CTA — StampButton: press físico + ink-bleed al confirmar (Schultz 1997 anticipación/resolución) */}
        {!agotado && (
          <StampButton
            onClick={handleAdd}
            fullWidth
            size="sm"
            style={{
              background: added ? "#5E6B3E" : undefined,
            }}
          >
            {added ? "✓ Agregado" : "Agregar 1 kg"}
          </StampButton>
        )}
      </div>
    </motion.article>
  );
}
