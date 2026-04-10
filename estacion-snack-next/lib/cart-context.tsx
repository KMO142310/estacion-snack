"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { reserveStock } from "./actions";
import type { Product } from "./types";

interface CartState {
  items: Record<string, number>; // productId -> kg
  sessionId: string;
  reservationExpiry: number | null; // timestamp ms
}

interface CartCtx {
  items: Record<string, number>;
  sessionId: string;
  reservationExpiry: number | null;
  secondsLeft: number | null;
  addItem: (product: Product, qty: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQty: (product: Product, qty: number) => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  totalKg: number;
  totalPrice: (products: Product[]) => number;
}

const CartContext = createContext<CartCtx | null>(null);

const STORAGE_KEY = "es_cart_v1";
const SESSION_KEY = "es_session_id";

function genSessionId(): string {
  return crypto.randomUUID();
}

function getOrCreateSession(): string {
  if (typeof window === "undefined") return genSessionId();
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = genSessionId();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({
    items: {},
    sessionId: "",
    reservationExpiry: null,
  });
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    const sid = getOrCreateSession();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as CartState;
        setState({ ...saved, sessionId: sid });
      } else {
        setState((s) => ({ ...s, sessionId: sid }));
      }
    } catch {
      setState((s) => ({ ...s, sessionId: sid }));
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!state.sessionId) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Countdown timer
  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (!state.reservationExpiry) { setSecondsLeft(null); return; }

    const tick = () => {
      const left = Math.floor((state.reservationExpiry! - Date.now()) / 1000);
      if (left <= 0) {
        setSecondsLeft(null);
        clearInterval(tickRef.current!);
      } else {
        setSecondsLeft(left);
      }
    };
    tick();
    tickRef.current = setInterval(tick, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [state.reservationExpiry]);

  const bumpExpiry = useCallback(() => {
    setState((s) => ({ ...s, reservationExpiry: Date.now() + 15 * 60 * 1000 }));
  }, []);

  const addItem = useCallback(async (product: Product, qty: number) => {
    let nextQty = 0;
    let sid = "";
    setState((s) => {
      sid = s.sessionId;
      nextQty = (s.items[product.id] ?? 0) + qty;
      return { ...s, items: { ...s.items, [product.id]: nextQty } };
    });
    bumpExpiry();
    if (sid) await reserveStock(sid, product.id, nextQty);
  }, [bumpExpiry]);

  const updateQty = useCallback(async (product: Product, qty: number) => {
    let sid = "";
    setState((s) => {
      sid = s.sessionId;
      const newItems = { ...s.items };
      if (qty <= 0) delete newItems[product.id];
      else newItems[product.id] = qty;
      return { ...s, items: newItems };
    });
    if (qty > 0) bumpExpiry();
    if (sid) await reserveStock(sid, product.id, Math.max(0, qty));
  }, [bumpExpiry]);

  const removeItem = useCallback(async (productId: string) => {
    let sid = "";
    setState((s) => {
      sid = s.sessionId;
      const newItems = { ...s.items };
      delete newItems[productId];
      return { ...s, items: newItems };
    });
    if (sid) await reserveStock(sid, productId, 0);
  }, []);

  const clearCart = useCallback(() => {
    setState((s) => ({ ...s, items: {}, reservationExpiry: null }));
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const totalItems = Object.keys(state.items).length;
  const totalKg = Object.values(state.items).reduce((a, b) => a + b, 0);
  const totalPrice = useCallback(
    (products: Product[]) =>
      Object.entries(state.items).reduce((sum, [id, kg]) => {
        const p = products.find((x) => x.id === id);
        return sum + (p ? p.price * kg : 0);
      }, 0),
    [state.items]
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        sessionId: state.sessionId,
        reservationExpiry: state.reservationExpiry,
        secondsLeft,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalKg,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartCtx {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
