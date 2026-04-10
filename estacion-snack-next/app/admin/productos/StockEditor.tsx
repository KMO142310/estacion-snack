"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fmt } from "@/lib/products";
import type { Product } from "@/lib/types";

const STATUS_COLOR: Record<string, string> = {
  disponible: "#4A8C3F",
  pocas:      "#E8A817",
  ultimo_kg:  "#FF6B35",
  agotado:    "#D94B4B",
};

const STATUS_LABEL: Record<string, string> = {
  disponible: "Disponible",
  pocas:      "Pocas",
  ultimo_kg:  "Último kg",
  agotado:    "Agotado",
};

interface Props {
  products: Product[];
}

export default function StockEditor({ products: initial }: Props) {
  const [products, setProducts] = useState(initial);
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const startEdit = (id: string, currentStock: number) => {
    setEditing((e) => ({ ...e, [id]: String(currentStock) }));
  };

  const saveStock = async (product: Product) => {
    const newStock = parseFloat(editing[product.id] ?? String(product.stock_kg));
    if (isNaN(newStock) || newStock < 0) return;

    setSaving((s) => ({ ...s, [product.id]: true }));
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ stock_kg: newStock })
      .eq("id", product.id);

    setSaving((s) => ({ ...s, [product.id]: false }));
    if (!error) {
      setProducts((ps) =>
        ps.map((p) => p.id === product.id ? { ...p, stock_kg: newStock } : p)
      );
      setEditing((e) => { const n = { ...e }; delete n[product.id]; return n; });
      setSaved((s) => ({ ...s, [product.id]: true }));
      setTimeout(() => setSaved((s) => ({ ...s, [product.id]: false })), 2000);
    }
  };

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid rgba(0,0,0,.06)", overflow: "hidden" }}>
      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "48px 1fr 120px 160px 100px 80px", gap: 16, padding: "12px 20px", background: "#f8f8f6", borderBottom: "1.5px solid rgba(0,0,0,.06)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#5F5A52" }}>
        <span></span>
        <span>Producto</span>
        <span>Precio</span>
        <span>Stock (kg)</span>
        <span>Estado</span>
        <span></span>
      </div>

      {products.map((p) => {
        const isEditing = editing[p.id] !== undefined;
        const isSaving = saving[p.id];
        const wasSaved = saved[p.id];

        return (
          <div
            key={p.id}
            style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr 120px 160px 100px 80px",
              gap: 16,
              padding: "16px 20px",
              borderBottom: "1px solid rgba(0,0,0,.04)",
              alignItems: "center",
            }}
          >
            {/* Thumb */}
            <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", background: "#FFF3EC" }}>
              <img src={p.image_url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            {/* Name */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "#5F5A52", marginTop: 2 }}>{p.cat_label}</div>
            </div>

            {/* Price */}
            <div style={{ fontSize: 15, fontWeight: 700 }}>{fmt(p.price)}</div>

            {/* Stock editable */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {isEditing ? (
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={editing[p.id]}
                  onChange={(e) => setEditing((ed) => ({ ...ed, [p.id]: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === "Enter") saveStock(p); if (e.key === "Escape") setEditing((ed) => { const n = { ...ed }; delete n[p.id]; return n; }); }}
                  autoFocus
                  style={{
                    width: 80,
                    padding: "8px 12px",
                    border: "2px solid #FF6B35",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              ) : (
                <button
                  onClick={() => startEdit(p.id, p.stock_kg)}
                  style={{
                    padding: "8px 12px",
                    background: "rgba(0,0,0,.04)",
                    border: "2px solid transparent",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    minWidth: 80,
                  }}
                >
                  {p.stock_kg} kg
                  <span style={{ fontSize: 10, color: "#5F5A52" }}>✏️</span>
                </button>
              )}
              {wasSaved && <span style={{ fontSize: 12, color: "#4A8C3F" }}>✓ Guardado</span>}
            </div>

            {/* Status */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              color: STATUS_COLOR[p.status] ?? "#5F5A52",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR[p.status] ?? "#5F5A52", flexShrink: 0, display: "inline-block" }} />
              {STATUS_LABEL[p.status] ?? p.status}
            </div>

            {/* Save button */}
            <div>
              {isEditing && (
                <button
                  onClick={() => saveStock(p)}
                  disabled={isSaving}
                  style={{
                    padding: "8px 14px",
                    background: "#1A1816",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: 8,
                    border: "none",
                    cursor: isSaving ? "not-allowed" : "pointer",
                    opacity: isSaving ? 0.6 : 1,
                  }}
                >
                  {isSaving ? "…" : "Guardar"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
