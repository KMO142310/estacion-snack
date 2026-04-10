"use client";

import { useState, useEffect } from "react";
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
  const [visible, setVisible] = useState<Set<string>>(new Set());

  const filtered = products.filter((p) => {
    if (filter === "all")   return true;
    if (filter === "cheap") return p.price < 10000;
    return p.category === filter;
  });

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible((s) => new Set(s).add(e.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 18,
        paddingBottom: 48,
      }}>
        {filtered.map((product) => (
          <div key={product.id} className="reveal visible">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
