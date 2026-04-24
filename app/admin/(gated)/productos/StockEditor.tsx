"use client";

import { useState, useTransition } from "react";
import { updateStock, updateProductActive } from "@/lib/admin-actions";
import { fmt } from "@/lib/cart-utils";
import type { Product } from "@/lib/types";
import ProductForm from "./ProductForm";

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
  const [, startToggle] = useTransition();
  const [formProduct, setFormProduct] = useState<Product | null | "new">(null);

  const startEdit = (id: string, currentStock: number) => {
    setEditing((e) => ({ ...e, [id]: String(currentStock) }));
  };

  const [errorMsg, setErrorMsg] = useState<Record<string, string>>({});

  const saveStock = async (product: Product) => {
    const newStock = parseFloat(editing[product.id] ?? String(product.stock_kg));
    if (isNaN(newStock) || newStock < 0) return;

    setSaving((s) => ({ ...s, [product.id]: true }));
    setErrorMsg((e) => { const n = { ...e }; delete n[product.id]; return n; });
    const result = await updateStock(product.id, newStock);
    setSaving((s) => ({ ...s, [product.id]: false }));

    if (result.ok) {
      setProducts((ps) =>
        ps.map((p) => {
          if (p.id !== product.id) return p;
          const status =
            newStock === 0 ? "agotado" :
            newStock <= 1 ? "ultimo_kg" :
            newStock <= p.low_threshold ? "pocas" : "disponible";
          return { ...p, stock_kg: newStock, status };
        })
      );
      setEditing((e) => { const n = { ...e }; delete n[product.id]; return n; });
      setSaved((s) => ({ ...s, [product.id]: true }));
      setTimeout(() => setSaved((s) => ({ ...s, [product.id]: false })), 2000);
    } else {
      setErrorMsg((e) => ({ ...e, [product.id]: result.error ?? "Error" }));
    }
  };

  const toggleActive = (product: Product) => {
    const next = !(product.is_active ?? true);
    setProducts((ps) => ps.map((p) => p.id === product.id ? { ...p, is_active: next } : p));
    startToggle(async () => {
      const result = await updateProductActive(product.id, next);
      if (!result.ok) {
        // Revert on error
        setProducts((ps) => ps.map((p) => p.id === product.id ? { ...p, is_active: !next } : p));
      }
    });
  };

  return (
    <>
    {formProduct !== null && (
      <ProductForm
        product={formProduct === "new" ? undefined : formProduct}
        onClose={() => setFormProduct(null)}
        onSaved={() => {
          // Reload is triggered by revalidatePath on the server action
          setFormProduct(null);
          window.location.reload();
        }}
      />
    )}
    <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
      <button
        onClick={() => setFormProduct("new")}
        style={{ padding: "10px 20px", fontSize: 13, fontWeight: 700, borderRadius: 12, background: "#FF6B35", color: "#fff", border: "none", cursor: "pointer" }}
      >
        + Nuevo producto
      </button>
    </div>
    <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid rgba(0,0,0,.06)", overflow: "hidden" }}>
      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "48px 1fr 120px 160px 100px 80px 60px", gap: 16, padding: "12px 20px", background: "#f8f8f6", borderBottom: "1.5px solid rgba(0,0,0,.06)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#5F5A52" }}>
        <span></span>
        <span>Producto</span>
        <span>Precio</span>
        <span>Stock (kg)</span>
        <span>Estado</span>
        <span></span>
        <span>Visible</span>
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
              gridTemplateColumns: "48px 1fr 120px 160px 100px 80px 60px",
              gap: 16,
              padding: "16px 20px",
              borderBottom: "1px solid rgba(0,0,0,.04)",
              alignItems: "center",
              opacity: (p.is_active ?? true) ? 1 : 0.5,
            }}
          >
            {/* Thumb */}
            <div style={{ position: "relative", width: 48, height: 48, borderRadius: 10, overflow: "hidden", background: "#FFF3EC", flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- admin panel, img.src es URL dinámica de Supabase storage sin dominio whitelisted */}
              <img src={p.image_url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            {/* Name + edit button */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</span>
                <button
                  onClick={() => setFormProduct(p)}
                  title="Editar producto"
                  style={{ padding: "2px 8px", fontSize: 11, fontWeight: 700, borderRadius: 6, border: "1.5px solid rgba(0,0,0,.12)", background: "#fff", cursor: "pointer", color: "#5F5A52" }}
                >
                  Editar
                </button>
              </div>
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
              {errorMsg[p.id] && <span style={{ fontSize: 11, color: "#D94B4B" }}>{errorMsg[p.id]}</span>}
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

            {/* is_active toggle */}
            <button
              onClick={() => toggleActive(p)}
              title={(p.is_active ?? true) ? "Ocultar del catálogo" : "Mostrar en catálogo"}
              style={{
                width: 40,
                height: 24,
                borderRadius: 12,
                background: (p.is_active ?? true) ? "#4A8C3F" : "rgba(0,0,0,.15)",
                border: "none",
                cursor: "pointer",
                position: "relative",
                transition: "background .2s",
                flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute",
                top: 3,
                left: (p.is_active ?? true) ? 19 : 3,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#fff",
                transition: "left .2s",
                display: "block",
              }} />
            </button>
          </div>
        );
      })}
    </div>
    </>
  );
}
