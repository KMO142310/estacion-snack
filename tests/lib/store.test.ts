/**
 * Tests del cart store de Zustand.
 *
 * El store usa `persist` middleware → necesita localStorage. En vez de
 * jsdom (overkill para esto), stubbeamos localStorage globalmente con
 * vi.stubGlobal en setup. Mismo contrato que el browser.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

// Stub de localStorage como Map en memoria. Se monta antes de importar el store.
const memStore = new Map<string, string>();
const mockLocalStorage = {
  getItem: (k: string) => memStore.get(k) ?? null,
  setItem: (k: string, v: string) => { memStore.set(k, v); },
  removeItem: (k: string) => { memStore.delete(k); },
  clear: () => { memStore.clear(); },
  key: (i: number) => Array.from(memStore.keys())[i] ?? null,
  get length() { return memStore.size; },
};
vi.stubGlobal("localStorage", mockLocalStorage);

// Import DESPUÉS del stub.
const { useCartStore } = await import("@/lib/store");

beforeEach(() => {
  memStore.clear();
  useCartStore.setState({ items: [], toasts: [], orderOpen: false });
});

describe("useCartStore — addItem", () => {
  it("agrega item nuevo al carrito", () => {
    useCartStore.getState().addItem({
      kind: "product",
      id: "p1",
      qty: 1,
      name: "Mix",
      pricePerUnit: 9000,
    });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]).toMatchObject({ id: "p1", qty: 1 });
  });

  it("dedup por (id, kind): segundo addItem suma qty al existente", () => {
    const { addItem } = useCartStore.getState();
    addItem({ kind: "product", id: "p1", qty: 1, name: "Mix", pricePerUnit: 9000 });
    addItem({ kind: "product", id: "p1", qty: 2, name: "Mix", pricePerUnit: 9000 });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].qty).toBe(3);
  });

  it("misma id pero distinto kind son items separados", () => {
    const { addItem } = useCartStore.getState();
    addItem({ kind: "product", id: "p1", qty: 1, name: "Mix", pricePerUnit: 9000 });
    addItem({ kind: "pack", id: "p1", qty: 1, name: "Pack Mix", pricePerUnit: 18000 });
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it("redondea qty a 3 decimales (evita drift de floating point)", () => {
    const { addItem } = useCartStore.getState();
    addItem({ kind: "product", id: "p1", qty: 0.1, name: "X", pricePerUnit: 1000 });
    addItem({ kind: "product", id: "p1", qty: 0.2, name: "X", pricePerUnit: 1000 });
    // 0.1 + 0.2 = 0.30000000000000004 sin toFixed.
    expect(useCartStore.getState().items[0].qty).toBe(0.3);
  });
});

describe("useCartStore — updateQty / removeItem / clear", () => {
  it("updateQty cambia la cantidad de un item específico", () => {
    const { addItem, updateQty } = useCartStore.getState();
    addItem({ kind: "product", id: "p1", qty: 1, name: "X", pricePerUnit: 100 });
    updateQty("p1", "product", 5);
    expect(useCartStore.getState().items[0].qty).toBe(5);
  });

  it("removeItem saca el item del carrito", () => {
    const { addItem, removeItem } = useCartStore.getState();
    addItem({ kind: "product", id: "p1", qty: 1, name: "X", pricePerUnit: 100 });
    addItem({ kind: "product", id: "p2", qty: 1, name: "Y", pricePerUnit: 200 });
    removeItem("p1", "product");
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].id).toBe("p2");
  });

  it("removeItem no afecta items con misma id pero distinto kind", () => {
    const { addItem, removeItem } = useCartStore.getState();
    addItem({ kind: "product", id: "p1", qty: 1, name: "X", pricePerUnit: 100 });
    addItem({ kind: "pack", id: "p1", qty: 1, name: "P", pricePerUnit: 200 });
    removeItem("p1", "product");
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].kind).toBe("pack");
  });

  it("clear vacía el carrito completo", () => {
    const { addItem, clear } = useCartStore.getState();
    addItem({ kind: "product", id: "p1", qty: 1, name: "X", pricePerUnit: 100 });
    addItem({ kind: "product", id: "p2", qty: 1, name: "Y", pricePerUnit: 100 });
    clear();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});

describe("useCartStore — toasts", () => {
  it("addToast agrega mensaje y mantiene últimos 3", () => {
    const { addToast } = useCartStore.getState();
    addToast("uno");
    addToast("dos");
    addToast("tres");
    addToast("cuatro");
    const toasts = useCartStore.getState().toasts;
    expect(toasts).toHaveLength(3);
    expect(toasts[toasts.length - 1].message).toBe("cuatro");
  });

  it("removeToast saca el toast por id", () => {
    const { addToast, removeToast } = useCartStore.getState();
    addToast("uno");
    const id = useCartStore.getState().toasts[0].id;
    removeToast(id);
    expect(useCartStore.getState().toasts).toHaveLength(0);
  });

  it("type 'info' se preserva en el toast", () => {
    const { addToast } = useCartStore.getState();
    addToast("info msg", "info");
    expect(useCartStore.getState().toasts[0].type).toBe("info");
  });
});
