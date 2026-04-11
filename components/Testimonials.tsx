"use client";

import { motion, useReducedMotion } from "framer-motion";

const reviews = [
  {
    stars: "★★★★★",
    text: '"El Mix Europeo es adictivo. Pedí 2 kilos para la oficina y duraron 3 días."',
    author: "Camila R.",
    context: "Ejecutiva · Oficina, Santa Cruz",
  },
  {
    stars: "★★★★★",
    text: '"Soy mamá con poco tiempo. Pedí por WhatsApp un martes y el viernes ya estaba en la puerta. Super práctico."',
    author: "Tomás M.",
    context: "Cliente habitual · Santa Cruz",
  },
  {
    stars: "★★★★★",
    text: '"Los confites Chuby Bardú son los favoritos de mis hijos. Desde que los descubrí, siempre tengo un kilo guardado."',
    author: "Francisca L.",
    context: "Mamá de 3 · Santa Cruz",
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

export default function Testimonials() {
  const reduce = useReducedMotion();

  return (
    <section aria-label="Testimonios" className="wrap">
      <div style={{ padding: "0 0 20px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 400 }}>
          Lo que dicen nuestros clientes
        </h2>
      </div>
      <motion.div
        variants={reduce ? undefined : containerVariants}
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, paddingBottom: 48 }}
      >
        {reviews.map((r) => (
          <motion.div
            key={r.author}
            variants={reduce ? undefined : itemVariants}
            style={{ background: "var(--sand-soft)", borderRadius: "var(--r)", padding: 24 }}
          >
            <div style={{ fontSize: 14, marginBottom: 10, letterSpacing: 2 }}>{r.stars}</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 14, fontStyle: "italic", color: "var(--text)" }}>{r.text}</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{r.author}</p>
            <p style={{ fontSize: 11, color: "var(--sub)" }}>{r.context}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
