"use client";

import { useState } from "react";
import PackCard from "./PackCard";
import PackSheet from "./PackSheet";
import packsData from "@/data/packs.json";
import productsData from "@/data/products.json";
import type { Pack, ProductStock } from "@/lib/pack-utils";

export default function PackSection() {
  const [selected, setSelected] = useState<Pack | null>(null);
  const packs = packsData as Pack[];
  const products = productsData as unknown as ProductStock[];

  return (
    <section id="packs" aria-label="Packs armados" style={{ padding: "5rem 1.25rem 3rem" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(1.75rem, 6vw, 2.5rem)",
            color: "#5A1F1A",
            lineHeight: 1.15,
            marginBottom: "0.625rem",
          }}
        >
          Packs armados
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9375rem",
            color: "#5E6B3E",
            lineHeight: 1.6,
            maxWidth: 480,
          }}
        >
          Para cuando querés probar de todo sin comprar 1 kilo de cada uno. El ahorro viene solo.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollPaddingLeft: "1.25rem",
          paddingBottom: "0.75rem",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {packs.map((pack) => (
          <div key={pack.id} style={{ flexShrink: 0, width: "82vw", maxWidth: 360, scrollSnapAlign: "start" }}>
            <PackCard
              pack={pack}
              products={products}
              onOpen={() => setSelected(pack)}
            />
          </div>
        ))}
      </div>

      {selected && (
        <PackSheet
          pack={selected}
          products={products}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
