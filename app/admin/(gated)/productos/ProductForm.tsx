"use client";

import { useState, useTransition } from "react";
import { upsertProduct } from "@/lib/admin-actions";
import type { Product } from "@/lib/types";
import type { ProductUpsertPayload } from "@/lib/supabase/admin";

const COLORS = ["orange", "green", "red", "purple", "yellow", "sand"];
const CATEGORIES = [
  { value: "frutos", label: "Frutos secos" },
  { value: "dulces", label: "Dulces" },
];

interface Props {
  product?: Product;
  onClose: () => void;
  onSaved: () => void;
}

function field(label: string, children: React.ReactNode) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#5F5A52", marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "#fff",
  border: "2px solid rgba(0,0,0,.08)",
  borderRadius: 10,
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  color: "#1A1816",
};

export default function ProductForm({ product, onClose, onSaved }: Props) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState({
    slug:             product?.slug             ?? "",
    name:             product?.name             ?? "",
    category:         product?.category         ?? "frutos",
    price:            product?.price            ?? 0,
    unit:             product?.unit             ?? "kg",
    stock_kg:         product?.stock_kg         ?? 0,
    low_threshold:    product?.low_threshold     ?? 1,
    image_url:        product?.image_url         ?? "",
    image_webp_url:   product?.image_webp_url    ?? "",
    image_400_url:    product?.image_400_url     ?? "",
    copy:             product?.copy              ?? "",
    badge:            product?.badge             ?? "",
    color:            product?.color             ?? "orange",
    sort_order:       product?.sort_order        ?? 99,
    long_description: product?.long_description  ?? "",
    is_active:        product?.is_active         ?? true,
    min_unit_kg:      product?.min_unit_kg       ?? 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const set = (k: keyof typeof form, v: string | number | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    setError(null);
    if (!form.slug || !form.name || form.price <= 0) {
      setError("Slug, nombre y precio son obligatorios.");
      return;
    }
    const payload: ProductUpsertPayload = {
      ...(isEdit && product ? { id: product.id } : {}),
      slug:             form.slug.trim(),
      name:             form.name.trim(),
      category:         form.category,
      price:            Number(form.price),
      unit:             form.unit,
      stock_kg:         Number(form.stock_kg),
      low_threshold:    Number(form.low_threshold),
      image_url:        form.image_url.trim(),
      image_webp_url:   form.image_webp_url.trim(),
      image_400_url:    form.image_400_url.trim(),
      copy:             form.copy.trim(),
      badge:            form.badge.trim() || null,
      color:            form.color,
      sort_order:       Number(form.sort_order),
      long_description: form.long_description.trim() || null,
      is_active:        form.is_active,
      min_unit_kg:      Number(form.min_unit_kg),
    };
    start(async () => {
      const result = await upsertProduct(payload);
      if (result.ok) {
        onSaved();
        onClose();
      } else {
        setError(result.error ?? "Error al guardar");
      }
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,.4)", backdropFilter: "blur(4px)" }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 210,
        background: "#fff",
        borderRadius: 20,
        padding: 28,
        width: "min(680px, calc(100vw - 32px))",
        maxHeight: "90dvh",
        overflowY: "auto",
        boxShadow: "0 24px 64px rgba(0,0,0,.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 24, fontWeight: 400 }}>
            {isEdit ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,0,0,.06)", border: "none", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <div>
            {field("Nombre", <input style={inputStyle} value={form.name} onChange={(e) => {
              set("name", e.target.value);
              if (!isEdit) set("slug", e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
            }} placeholder="Mix Europeo" />)}

            {field("Slug (URL)", <input style={inputStyle} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="mix-europeo" />)}

            {field("Categoría",
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            )}

            {field("Precio (CLP / kg)", <input style={inputStyle} type="number" min={0} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="13000" />)}

            {field("Stock (kg)", <input style={inputStyle} type="number" min={0} step={0.5} value={form.stock_kg} onChange={(e) => set("stock_kg", e.target.value)} />)}

            {field("Umbral bajo stock", <input style={inputStyle} type="number" min={0} step={0.5} value={form.low_threshold} onChange={(e) => set("low_threshold", e.target.value)} />)}

            {field("Unidad mínima de venta",
              <select style={{ ...inputStyle, cursor: "pointer" }} value={String(form.min_unit_kg)} onChange={(e) => set("min_unit_kg", parseFloat(e.target.value))}>
                <option value="1">1 kg (formato único)</option>
              </select>
            )}
          </div>

          <div>
            {field("Color de tarjeta",
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => set("color", c)}
                    title={c}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: `3px solid ${form.color === c ? "#1A1816" : "transparent"}`,
                      background: `var(--${c})`,
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            )}

            {field("Badge (opcional)", <input style={inputStyle} value={form.badge} onChange={(e) => set("badge", e.target.value)} placeholder="Top ventas" />)}

            {field("Orden (sort_order)", <input style={inputStyle} type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} />)}

            {field("URL imagen JPG", <input style={inputStyle} value={form.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="/img/nombre.jpg" />)}

            {field("URL imagen WebP", <input style={inputStyle} value={form.image_webp_url} onChange={(e) => set("image_webp_url", e.target.value)} placeholder="/img/nombre.webp" />)}

            {field("URL imagen 400px WebP", <input style={inputStyle} value={form.image_400_url} onChange={(e) => set("image_400_url", e.target.value)} placeholder="/img/nombre-400.webp" />)}
          </div>
        </div>

        {field("Copy (descripción corta)",
          <textarea
            style={{ ...inputStyle, resize: "vertical" }}
            rows={2}
            value={form.copy}
            onChange={(e) => set("copy", e.target.value)}
            placeholder="Descripción corta que aparece en la tarjeta del producto."
          />
        )}

        {field("Descripción larga (opcional)",
          <textarea
            style={{ ...inputStyle, resize: "vertical" }}
            rows={4}
            value={form.long_description}
            onChange={(e) => set("long_description", e.target.value)}
            placeholder="Descripción detallada que aparece en la página del producto."
          />
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => set("is_active", !form.is_active)}
            style={{
              width: 44,
              height: 26,
              borderRadius: 13,
              background: form.is_active ? "#4A8C3F" : "rgba(0,0,0,.15)",
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
              left: form.is_active ? 21 : 3,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#fff",
              transition: "left .2s",
              display: "block",
            }} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: form.is_active ? "#4A8C3F" : "#5F5A52" }}>
            {form.is_active ? "Visible en catálogo" : "Oculto en catálogo"}
          </span>
        </div>

        {error && (
          <p style={{ marginBottom: 16, fontSize: 13, color: "#D94B4B", fontWeight: 600 }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{ padding: "12px 20px", fontSize: 14, fontWeight: 700, borderRadius: 12, border: "2px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={pending}
            style={{ padding: "12px 24px", fontSize: 14, fontWeight: 700, borderRadius: 12, background: "#1A1816", color: "#fff", border: "none", cursor: pending ? "not-allowed" : "pointer", opacity: pending ? 0.7 : 1 }}
          >
            {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </div>
    </>
  );
}
