import type { CartLine } from "./store";
import { fmtKg } from "./cart-utils";
import type { Pack } from "./pack-utils";
import { WA } from "./business-info";

export const WA_BASE = `https://wa.me/${WA}`;

interface Product {
  id: string;
  name: string;
  price: number;
}

/**
 * Builds the WhatsApp pre-filled message from cart contents.
 * Returns the full wa.me URL with encoded text.
 */
export function buildWaUrl(
  items: CartLine[],
  products: Product[],
  packs: Pack[],
  note?: string,
  orderRef?: string,
  delivery?: { comuna: string; shipping: number; total: number },
): string {
  const lines: string[] = ["Hola! Quiero hacer un pedido:"];
  lines.push("");

  let total = 0;

  for (const item of items) {
    if (item.kind === "product") {
      const product = products.find((p) => p.id === item.id);
      if (!product) continue;
      const subtotal = product.price * item.qty;
      total += subtotal;
      lines.push(`- ${product.name} · ${fmtKg(item.qty)} · $${Math.round(subtotal).toLocaleString("es-CL")}`);
    } else {
      const pack = packs.find((p) => p.id === item.id);
      if (!pack) continue;
      const subtotal = pack.price * item.qty;
      total += subtotal;
      lines.push(`- ${pack.name} (x${item.qty}) · $${Math.round(subtotal).toLocaleString("es-CL")}`);
      // BOM breakdown so the operator can verify stock component by component
      const bomLine = pack.items
        .map((ci) => `${fmtKg(ci.kg)} ${ci.name}`)
        .join(" + ");
      lines.push(`  > ${bomLine}`);
    }
  }

  lines.push("");

  if (delivery) {
    lines.push(`Subtotal: $${Math.round(total).toLocaleString("es-CL")}`);
    lines.push(`Entregar en: ${delivery.comuna}`);
    const shipLabel = delivery.shipping === 0 ? "gratis" : `$${delivery.shipping.toLocaleString("es-CL")}`;
    lines.push(`Envío: ${shipLabel}`);
    lines.push(`*Total: $${Math.round(delivery.total).toLocaleString("es-CL")}*`);
  } else {
    lines.push(`*Total: $${Math.round(total).toLocaleString("es-CL")}*`);
  }

  if (note?.trim()) {
    lines.push("");
    lines.push(`Nota: ${note.trim()}`);
  }

  lines.push("");
  lines.push("Te paso la dirección cuando me confirmes.");

  if (orderRef) {
    lines.push("");
    lines.push(`(ref: ${orderRef})`);
  }

  const text = lines.join("\n");
  return `${WA_BASE}?text=${encodeURIComponent(text)}`;
}
