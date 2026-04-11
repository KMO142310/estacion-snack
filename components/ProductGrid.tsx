"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";

const FILTERS = [
  { id: "all",    label: "Todos" },
  { id: "frutos", label: "Frutos Secos" },
  { id: "dulces", label: "Dulces" },
  { id: "cheap",  label: "Menos de $10.000/kg" },
];

interface Props {
  products: Product[];
}

export default function ProductGrid({ products }: Props) {
  const [filter, setFilter] = useState("all");
  const reduce = useReducedMotion();

  const filtered = products.filter((p) => {
    if (filter === "all")   return true;
    if (filter === "cheap") return p.price < 10000;
    return p.category === filter;
  });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduce ? 0 : 0.07 },
    },
  };

  const itemVariants = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  return (
    <div className="wrap" id="productos">
      <div style={{
        padding: "0 0 20px",
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8,
      }}>
        <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 400 }}>
          Todos los productos
        </h2>
        <span style={{ fontSize: 13, color: "var(--sub)" }}>{filtered.length} disponibles</span>
      </div>

      {/* Filter chips */}
      <div
        role="tablist"
        aria-label="Filtrar productos"
        style={{ display: "flex", gap: 8, paddingBottom: 20, overflowX: "auto", scrollbarWidth: "none" }}
      >
        {FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            style={{
              flexShrink: 0,
              padding: "8px 16px",
              minHeight: 40,
              fontSize: 13,
              fontWeight: 700,
              background: filter === f.id ? "var(--text)" : "var(--bg)",
              border: `2px solid ${filter === f.id ? "var(--text)" : "rgba(0,0,0,.1)"}`,
              color: filter === f.id ? "#fff" : "var(--sub)",
              borderRadius: "var(--r-full)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid con stagger */}
      <motion.div
        key={filter}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 18,
          paddingBottom: 48,
        }}
      >
        {filtered.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
