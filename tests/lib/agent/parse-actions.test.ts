/**
 * extractActions — convertir URLs en botones clickeables sin perder texto útil.
 *
 * Cazará el bug "el operador clickeó pero el botón apunta a /aboutblank"
 * o "el texto crudo de la URL se quedó en el mensaje y se ve feo".
 */
import { describe, it, expect } from "vitest";
import { extractActions } from "@/lib/agent/parse-actions";

describe("extractActions", () => {
  it("texto sin URLs → cleanText idéntico, sin actions", () => {
    const { cleanText, actions } = extractActions("Hola, ¿cómo estás?");
    expect(cleanText).toBe("Hola, ¿cómo estás?");
    expect(actions).toEqual([]);
  });

  it("URL wa.me → action whatsapp + texto sin la URL", () => {
    const text = "Listo. Tocá acá: https://wa.me/56953743338?text=Hola para enviar.";
    const { cleanText, actions } = extractActions(text);
    expect(actions.length).toBe(1);
    expect(actions[0].kind).toBe("whatsapp");
    expect(actions[0].url).toBe("https://wa.me/56953743338?text=Hola");
    expect(cleanText).not.toContain("wa.me");
    expect(cleanText).toContain("Listo");
  });

  it("URL imagen OG → action image", () => {
    const text =
      "Acá la imagen: https://www.estacionsnack.cl/api/og/order-confirmation?order=abc&t=xyz";
    const { actions } = extractActions(text);
    expect(actions.length).toBe(1);
    expect(actions[0].kind).toBe("image");
    expect(actions[0].url).toMatch(/order-confirmation/);
  });

  it("texto del notify_owner_whatsapp con AMBAS URLs (wa + imagen)", () => {
    const text = `✓ Cambiar pedido a confirmado.

📲 Notificación lista para vos:
https://wa.me/56953743338?text=Pedido+nuevo

🖼️ Imagen para reenviar al cliente:
https://www.estacionsnack.cl/api/og/order-confirmation?order=abc-123&t=tok-xyz`;

    const { cleanText, actions } = extractActions(text);
    expect(actions.length).toBe(2);
    expect(actions.find((a) => a.kind === "whatsapp")).toBeTruthy();
    expect(actions.find((a) => a.kind === "image")).toBeTruthy();
    // El texto resultante NO debe tener las URLs crudas.
    expect(cleanText).not.toMatch(/wa\.me\/56953743338/);
    expect(cleanText).not.toMatch(/order-confirmation\?order/);
    // Pero sí mantiene los headers y el resumen.
    expect(cleanText).toContain("Cambiar pedido a confirmado");
  });

  it("URLs duplicadas → action única", () => {
    const text = "https://wa.me/56953743338?text=Hola y otra vez https://wa.me/56953743338?text=Hola";
    const { actions } = extractActions(text);
    expect(actions.length).toBe(1);
  });

  it("texto con URL malformada (sin query) → no crashea, action vacía", () => {
    const text = "Tu link: wa.me/56953743338 (faltaba el https)";
    const { actions } = extractActions(text);
    expect(actions).toEqual([]);
  });

  it("normaliza líneas vacías triples a dobles", () => {
    const text = "Línea 1\n\n\n\nLínea 2";
    const { cleanText } = extractActions(text);
    expect(cleanText).toBe("Línea 1\n\nLínea 2");
  });
});
