"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import ProductSheet from "./ProductSheet";
import productsData from "@/data/products.json";

type Product = typeof productsData[number];

export default function ProductGrid() {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <section id="productos" aria-label="Mezclas" style={{ padding: "5rem 1.25rem 3rem" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(1.75rem, 6vw, 2.5rem)", color: "#5A1F1A", lineHeight: 1.15, marginBottom: "0.625rem" }}>
          Las mezclas
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#5E6B3E", lineHeight: 1.6, maxWidth: 480 }}>
          Seis recetas. Las probamos todas, muchas veces, hasta dejar solo las que uno se termina sin darse cuenta.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", maxWidth: 720 }}>
        {productsData.map((product) => (
          <ProductCard key={product.id} {...product} onOpen={() => setSelected(product)} />
        ))}
      </div>
      {selected && <ProductSheet product={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
