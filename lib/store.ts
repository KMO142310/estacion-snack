"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLineKind = "product" | "pack";

export interface CartLine {
  kind: CartLineKind;
  id: string;
  qty: number; // kg for products, count for packs
  name?: string; // snapshot for display
  pricePerUnit?: number; // price per kg or pack price
}

interface Toast {
  id: string;
  message: string;
  type?: "success" | "info";
}

interface CartState {
  items: CartLine[];
  expiresAt: number;
  toasts: Toast[];

  addItem: (item: Omit<CartLine, "kind"> & { kind: CartLineKind }) => void;
  updateQty: (id: string, kind: CartLineKind, qty: number) => void;
  removeItem: (id: string, kind: CartLineKind) => void;
  clear: () => void;

  addToast: (message: string, type?: "success" | "info") => void;
  removeToast: (id: string) => void;
}

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

function freshExpiry() {
  return Date.now() + SEVEN_DAYS;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      expiresAt: freshExpiry(),
      toasts: [],

      addItem: (item) =>
        set((s) => {
          const existing = s.items.find(
            (i) => i.id === item.id && i.kind === item.kind
          );
          const updated = existing
            ? s.items.map((i) =>
                i.id === item.id && i.kind === item.kind
                  ? { ...i, qty: +(i.qty + item.qty).toFixed(3) }
                  : i
              )
            : [...s.items, { ...item }];
          return { items: updated, expiresAt: freshExpiry() };
        }),

      updateQty: (id, kind, qty) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id && i.kind === kind ? { ...i, qty: +qty.toFixed(3) } : i
          ),
          expiresAt: freshExpiry(),
        })),

      removeItem: (id, kind) =>
        set((s) => ({
          items: s.items.filter((i) => !(i.id === id && i.kind === kind)),
        })),

      clear: () => set({ items: [], expiresAt: freshExpiry() }),

      addToast: (message, type = "success") =>
        set((s) => {
          const id = `t-${Date.now()}`;
          return { toasts: [...s.toasts.slice(-2), { id, message, type }] };
        }),

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: "es_cart_v2",
      version: 2,
      skipHydration: true,
      partialize: (state) => ({
        items: state.items,
        expiresAt: state.expiresAt,
      }),
      merge: (persisted, current) => {
        const p = persisted as { expiresAt?: number; items?: CartLine[] };
        if (p.expiresAt && Date.now() > p.expiresAt) {
          // Cart expired — start fresh
          return { ...current };
        }
        return { ...current, items: p.items ?? [], expiresAt: p.expiresAt ?? freshExpiry() };
      },
    }
  )
);

// Selector helpers
export const cartItemCount = (state: CartState) =>
  state.items.reduce((n, i) => n + (i.kind === "product" ? 1 : i.qty), 0);

export const cartTotal = (state: CartState) =>
  state.items.reduce((sum, i) => {
    const price = i.pricePerUnit ?? 0;
    return sum + (i.kind === "product" ? price * i.qty : price * i.qty);
  }, 0);
