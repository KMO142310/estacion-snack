"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { fmt, fmtKg, fmtDisplayPrice } from "@/lib/cart-utils";
import { useCartStore } from "@/lib/store";
import { spring } from "@/lib/motion-tokens";
import StampButton from "./StampButton";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  stock_kg: number;
  image_webp_url: string;
  image_url: string;
  badge: string | null;
  status: string;
  copy?: string;
  occasion?: string | null;
  min_unit_kg?: number;
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
  const { name, price, image_webp_url, badge, status, stock_kg, min_unit_kg = 1 } = product;
  const [added, setAdded] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const cardRef = useRef<HTMLElement | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const items = useCartStore((s) => s.items);
  const reducedMotion = useReducedMotion();
  const agotado = status === "agotado";
  const ultimoKg = status === "ultimo_kg";
  const currentQty = items.find((item) => item.kind === "product" && item.id === product.id)?.qty ?? 0;
  const remainingQty = Math.max(0, stock_kg - currentQty);

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
    if (agotado || added) return;
    if (remainingQty < min_unit_kg) {
      addToast(`Ya no queda stock disponible de ${name}`, "info");
      return;
    }
    addItem({ kind: "product", id: product.id, qty: min_unit_kg, name, pricePerUnit: price });
    addToast(`${name} · ${fmtKg(min_unit_kg)}`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.article
      ref={cardRef as React.RefObject<HTMLElement>}
      className={agotado ? undefined : "pcard"}
      initial={false}
      animate={{ opacity: agotado ? 0.5 : 1, y: 0, scale: 1 }}
      transition={revealed && !reducedMotion ? spring.arrive : { duration: 0 }}
      style={{
        background: "transparent",
        overflow: "hidden",
        cursor: agotado ? "default" : "pointer",
        WebkitTapHighlightColor: "transparent",
        willChange: "transform, opacity",
      }}
    >
      <button
        type="button"
        onClick={agotado ? undefined : onOpen}
        aria-label={agotado ? `${name} — agotado` : `Ver detalle de ${name}`}
        disabled={agotado}
        style={{
          textAlign: "left",
          width: "100%",
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: agotado ? "default" : "pointer",
        }}
      >
        <div style={{ position: "relative", aspectRatio: "4/5", background: "#EDE4D6", borderRadius: 18, overflow: "hidden", marginBottom: 14 }}>
          <Image src={image_webp_url} alt="" fill sizes="(max-width:640px) 50vw,33vw"
            style={{ objectFit: "cover" }} placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0VERTRENiI+PC9yZWN0Pjwvc3ZnPg==" />
          {(badge || ultimoKg) && (
            <span style={{
              position: "absolute", top: 10, left: 10,
              background: ultimoKg ? "#5A1F1A" : "#A8411A",
              color: "#F4EADB", fontSize: 10, fontWeight: 700,
              fontFamily: "var(--font-body)", padding: "4px 10px",
              borderRadius: 999, letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              {badge || "Último kg"}
            </span>
          )}
        </div>

        <div style={{ padding: "0 2px" }}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 19,
            color: "#5A1F1A",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}>
            {name}
          </h3>

          <p className="price" style={{
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: 14,
            color: agotado ? "#aaa" : "#5A1F1A",
            marginBottom: 6,
          }}>
            {agotado ? "Agotado" : (
              <>
                {fmtDisplayPrice(price, min_unit_kg).price}
                <span style={{ fontWeight: 400, color: "rgba(90,31,26,0.55)", marginLeft: 4 }}>· {fmtDisplayPrice(price, min_unit_kg).unit}</span>
              </>
            )}
          </p>

          {!agotado && remainingQty <= 2 && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(90,31,26,0.55)", marginBottom: 12 }}>
              {remainingQty <= 1 ? "Último kilo disponible." : `Quedan ${remainingQty.toLocaleString("es-CL")} kg disponibles.`}
            </p>
          )}
        </div>
      </button>

      {!agotado && (
        <div style={{ padding: "0 2px" }}>
          <StampButton
            onClick={handleAdd}
            fullWidth
            size="sm"
            style={{
              background: added ? "#5E6B3E" : undefined,
            }}
          >
            {added ? "✓ Agregado" : "Agregar"}
          </StampButton>
        </div>
      )}
    </motion.article>
  );
}
