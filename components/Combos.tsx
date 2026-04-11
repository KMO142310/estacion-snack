"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { fmt } from "@/lib/products";
import type { Product } from "@/lib/types";

// Packs armados = combinación sugerida de 2 SKUs base. El carrito agrega
// los 2 productos base a precio completo; NO hay descuento aplicado en
// ningún lado de la lógica. Por eso `price` acá es exactamente la suma
// de los precios de `slugA` + `slugB`. Mostrar un `oldPrice` tachado o un
// "Ahorrá $X" constituiría publicidad engañosa bajo Ley 19.496 (Chile)
// porque el cliente nunca paga menos que la suma real. Ver FL-3 en
// SECURITY_AUDIT.md y el plan del Bloque 2.5 si se quiere implementar
// un descuento REAL en el carrito a futuro.
interface ComboConfig {
  id: string;
  tag: string;
  title: string;
  desc: string;
  slugA: string;
  slugB: string;
  price: number;
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
    price: 18990, // 13000 (mix-europeo) + 5990 (mani-confitado-tropical)
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
    price: 18490, // 9990 (chuby-bardu) + 8500 (gomita-osito-docile)
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
    price: 29000, // 13000 (mix-europeo) + 16000 (almendra-entera)
    bg: "var(--green-soft)",
    emoji: "🥜🌰",
    image: "/img/pack-proteina.jpg",
    imageWebp: "/img/pack-proteina.webp",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

interface Props {
  products: Product[];
}

export default function Combos({ products }: Props) {
  const { addItem } = useCart();
  const reduce = useReducedMotion();

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
        <span style={{ fontSize: 13, color: "var(--sub)" }}>Combinaciones listas para pedir</span>
      </div>

      <motion.div
        variants={reduce ? undefined : containerVariants}
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
          paddingBottom: 48,
        }}
      >
        {COMBOS.map((combo) => (
          <motion.div
            key={combo.id}
            variants={reduce ? undefined : itemVariants}
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
