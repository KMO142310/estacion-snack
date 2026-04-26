/**
 * Parser de URLs de acción del texto del agente.
 *
 * Detecta URLs que el bot inserta en su respuesta (wa.me, imagen OG)
 * y las extrae para que la UI las renderice como botones clickeables
 * en vez de texto crudo.
 *
 * Cliente y server pueden importar (función pura, sin imports server-only).
 */

export type ActionButton = {
  kind: "whatsapp" | "image" | "link";
  url: string;
  label: string;
};

export interface ParsedMessage {
  cleanText: string;
  actions: ActionButton[];
}

const WA_REGEX = /https:\/\/wa\.me\/\d+(?:\?[^\s)]+)?/g;
const OG_REGEX = /https?:\/\/[^\s)]+\/api\/og\/order-confirmation\?[^\s)]+/g;

export function extractActions(text: string): ParsedMessage {
  const actions: ActionButton[] = [];
  const seen = new Set<string>();

  for (const m of text.matchAll(WA_REGEX)) {
    if (seen.has(m[0])) continue;
    seen.add(m[0]);
    actions.push({ kind: "whatsapp", url: m[0], label: "📲 Abrir en WhatsApp" });
  }

  for (const m of text.matchAll(OG_REGEX)) {
    if (seen.has(m[0])) continue;
    seen.add(m[0]);
    actions.push({ kind: "image", url: m[0], label: "🖼️ Ver imagen del pedido" });
  }

  let cleanText = text;
  for (const url of seen) {
    cleanText = cleanText.replaceAll(url, "");
  }
  cleanText = cleanText.replace(/\n{3,}/g, "\n\n").trim();

  return { cleanText, actions };
}
