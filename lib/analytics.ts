// Client-side helpers to dispatch ecommerce events to GA4 + Meta Pixel.
// Safe to call before the scripts load — all calls are guarded.

type AnyObj = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export interface TrackedProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
}

function ga(event: string, params: AnyObj) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params);
}

function fbq(event: string, params: AnyObj) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", event, params);
}

export function trackViewItem(p: TrackedProduct) {
  ga("view_item", {
    currency: "CLP",
    value: p.price,
    items: [{ item_id: p.id, item_name: p.name, item_category: p.category, price: p.price, quantity: 1 }],
  });
  fbq("ViewContent", {
    content_ids: [p.id],
    content_name: p.name,
    content_category: p.category,
    content_type: "product",
    value: p.price,
    currency: "CLP",
  });
}

export function trackAddToCart(p: TrackedProduct, qty: number) {
  const value = p.price * qty;
  ga("add_to_cart", {
    currency: "CLP",
    value,
    items: [{ item_id: p.id, item_name: p.name, item_category: p.category, price: p.price, quantity: qty }],
  });
  fbq("AddToCart", {
    content_ids: [p.id],
    content_name: p.name,
    content_type: "product",
    value,
    currency: "CLP",
  });
}

export function trackBeginCheckout(items: Array<TrackedProduct & { qty: number }>, total: number) {
  ga("begin_checkout", {
    currency: "CLP",
    value: total,
    items: items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty })),
  });
  fbq("InitiateCheckout", {
    content_ids: items.map((i) => i.id),
    value: total,
    currency: "CLP",
    num_items: items.reduce((a, b) => a + b.qty, 0),
  });
}

export function trackPurchase(
  orderId: string,
  items: Array<TrackedProduct & { qty: number }>,
  total: number
) {
  ga("purchase", {
    transaction_id: orderId,
    currency: "CLP",
    value: total,
    items: items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty })),
  });
  fbq("Purchase", {
    content_ids: items.map((i) => i.id),
    contents: items.map((i) => ({ id: i.id, quantity: i.qty })),
    value: total,
    currency: "CLP",
  });
}
