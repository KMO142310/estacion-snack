"use client";

import { useCart } from "@/lib/cart-context";
import { PRODUCTS, fmt } from "@/lib/products";
import type { Product } from "@/lib/types";

interface ComboConfig {
  id: string;
  tag: string;
  title: string;
  desc: string;
  slugA: string;
  slugB: string;
  price: number;
  oldPrice: number;
  bg: string;
  emoji: string;
  image?: string;
  imageWebp?: string;
}

const COMBOS: ComboConfig[] = [
  {
    id: "pack_pica",
    tag: "🏢 Oficina",
    title: "Pack Pica",
    desc: "Para la mesa de la oficina o la junta con amigos. Salado + dulce.",
    slugA: "mix-europeo",
    slugB: "mani-confitado-tropical",
    price: 17500,
    oldPrice: 18990,
    bg: "var(--orange-soft)",
    emoji: "🥜🍬",
    image: "/img/pack-pica.jpg",
    imageWebp: "/img/pack-pica.webp",
  },
  {
    id: "pack_dulce",
    tag: "📚 Estudio",
    title: "Pack Dulce",
    desc: "Para las sesiones de estudio o las tardes de Netflix con los amigos.",
    slugA: "chuby-bardu",
    slugB: "gomita-osito-docile",
    price: 17000,
    oldPrice: 18490,
    bg: "var(--purple-soft)",
    emoji: "🍭🐻",
    image: "/img/pack-dulce.jpg",
    imageWebp: "/img/pack-dulce.webp",
  },
  {
    id: "pack_proteina",
    tag: "💪 Gimnasio",
    title: "Pack Proteína",
    desc: "Snack natural para antes o después de entrenar. Energía pura.",
    slugA: "mix-europeo",
    slugB: "almendra-entera",
    price: 27000,
    oldPrice: 29000,
    bg: "var(--green-soft)",
    emoji: "🥜🌰",
    image: "/img/pack-proteina.jpg",
    imageWebp: "/img/pack-proteina.webp",
  },
];

interface Props {
  products: Product[];
}

export default function Combos({ products }: Props) {
  const { addItem } = useCart();

  const addCombo = async (combo: ComboConfig) => {
    const a = products.find((p) => p.slug === combo.slugA);
    const b = products.find((p) => p.slug === combo.slugB);
    if (a) await addItem(a, 1);
    if (b) await addItem(b, 1);
  };

  return (
    <div className="wrap" id="combos">
      <div style={{
        padding: "0 0 20px",
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8,
      }}>
        <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 400 }}>
          Packs armados
        </h2>
        <span style={{ fontSize: 13, color: "var(--sub)" }}>Ahorra comprando juntos</span>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 12,
        paddingBottom: 48,
      }}>
        {COMBOS.map((combo) => {
          const save = combo.oldPrice - combo.price;
          const pct = Math.round((save / combo.oldPrice) * 100);
          return (
            <div
              key={combo.id}
              className="reveal"
              style={{
                borderRadius: "var(--r)",
                padding: 20,
                position: "relative",
                overflow: "hidden",
                border: "1.5px solid rgba(0,0,0,.06)",
                background: combo.bg,
              }}
            >
              <div style={{
                aspectRatio: "16/10",
                margin: "-20px -20px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
                borderBottom: "1.5px solid rgba(0,0,0,.06)",
                background: combo.bg,
                overflow: "hidden",
              }}>
                {combo.image ? (
                  <picture>
                    {combo.imageWebp && <source srcSet={combo.imageWebp} type="image/webp" />}
                    <img
                      src={combo.image}
                      alt={combo.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      loading="lazy"
                    />
                  </picture>
                ) : (
                  combo.emoji
                )}
              </div>
              <span style={{
                position: "absolute",
                top: 14,
                right: 14,
                background: "var(--green)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 800,
                padding: "5px 10px",
                borderRadius: "var(--r-full)",
              }}>
                -{pct}%
              </span>
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                marginBottom: 10,
                display: "inline-block",
                padding: "4px 10px",
                background: "rgba(0,0,0,.05)",
                borderRadius: "var(--r-full)",
                color: "var(--sub)",
              }}>
                {combo.tag}
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, lineHeight: 1.2 }}>
                {combo.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--sub)", lineHeight: 1.5, marginBottom: 14 }}>
                {combo.desc}
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20, fontWeight: 900 }}>{fmt(combo.price)}</span>
                <span style={{ fontSize: 13, color: "var(--sub)", textDecoration: "line-through" }}>{fmt(combo.oldPrice)}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: "var(--green)", background: "var(--green-soft)", padding: "3px 8px", borderRadius: "var(--r-full)" }}>
                  Ahorra {fmt(save)}
                </span>
              </div>
              <button
                onClick={() => addCombo(combo)}
                style={{
                  width: "100%",
                  padding: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 10,
                  border: "2px solid var(--text)",
                  background: "transparent",
                  color: "var(--text)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  minHeight: 44,
                  cursor: "pointer",
                }}
              >
                Agregar pack
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
