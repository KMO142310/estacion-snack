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
          Dos productos juntos, 1 kilo de cada uno, en bolsas separadas. Sale más barato que comprarlos por separado.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 16,
        maxWidth: 420,
        margin: "0 auto",
      }} className="pack-grid-inline">
        {packs.map((pack) => (
          <PackCard
            key={pack.id}
            pack={pack}
            products={products}
            onOpen={() => setSelected(pack)}
          />
        ))}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .pack-grid-inline { grid-template-columns: repeat(3, 1fr) !important; max-width: none !important; margin: 0 !important; }
        }
      `}</style>

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
