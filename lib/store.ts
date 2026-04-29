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

export interface LastOrder {
  ref: string;
  waUrl: string;
  total: number;
  at: number;
}

interface CartState {
  items: CartLine[];
  expiresAt: number;
  toasts: Toast[];
  orderOpen: boolean;
  lastOrder: LastOrder | null;

  addItem: (item: Omit<CartLine, "kind"> & { kind: CartLineKind }) => void;
  updateQty: (id: string, kind: CartLineKind, qty: number) => void;
  removeItem: (id: string, kind: CartLineKind) => void;
  clear: () => void;
  setOrderOpen: (open: boolean) => void;

  addToast: (message: string, type?: "success" | "info") => void;
  removeToast: (id: string) => void;

  setLastOrder: (order: LastOrder) => void;
  clearLastOrder: () => void;
}

const ONE_HOUR = 60 * 60 * 1000;

function freshExpiry() {
  return Date.now() + ONE_HOUR;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      expiresAt: freshExpiry(),
      toasts: [],
      orderOpen: false,
      lastOrder: null,

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

      setOrderOpen: (open) => set({ orderOpen: open }),

      addToast: (message, type = "success") =>
        set((s) => {
          const id = `t-${Date.now()}`;
          return { toasts: [...s.toasts.slice(-2), { id, message, type }] };
        }),

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      setLastOrder: (order) => set({ lastOrder: order }),
      clearLastOrder: () => set({ lastOrder: null }),
    }),
    {
      name: "es_cart_v4",
      version: 4,
      skipHydration: true,
      partialize: (state) => ({
        items: state.items,
        expiresAt: state.expiresAt,
        lastOrder: state.lastOrder,
      }),
      merge: (persisted, current) => {
        const p = persisted as {
          expiresAt?: number;
          items?: CartLine[];
          lastOrder?: LastOrder | null;
        };
        if (p.expiresAt && Date.now() > p.expiresAt) {
          // Cart expired — preserve lastOrder pero descarta items.
          return { ...current, lastOrder: p.lastOrder ?? null };
        }
        return {
          ...current,
          items: p.items ?? [],
          expiresAt: p.expiresAt ?? freshExpiry(),
          lastOrder: p.lastOrder ?? null,
        };
      },
    }
  )
);

