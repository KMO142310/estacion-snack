"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import PackCard from "./PackCard";

// Dynamic import — PackSheet solo carga cuando el usuario abre un pack.
const PackSheet = dynamic(() => import("./PackSheet"), { ssr: false });
import packsData from "@/data/packs.json";
import productsData from "@/data/products.json";
import type { Pack, ProductStock } from "@/lib/pack-utils";

export default function PackSection() {
  const [selected, setSelected] = useState<Pack | null>(null);
  const packs = packsData as Pack[];
  const products = productsData as unknown as ProductStock[];

  return (
    <section aria-label="Packs armados" className="pack-inline">
      <div className="pack-grid-inline">
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
        .pack-inline {
          padding: 0.5rem 0 0;
        }
        .pack-grid-inline {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          max-width: 29rem;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .pack-grid-inline {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1.5rem;
            max-width: none;
            margin: 0;
          }
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
