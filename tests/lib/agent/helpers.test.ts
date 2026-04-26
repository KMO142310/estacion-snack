/**
 * Helpers puros del agente.
 *
 * No mockean nada — testean funciones puras de PII masking, normalización
 * de teléfonos y short IDs. Cazan regresiones del tipo "alguien cambió
 * el masking y ahora se filtra el teléfono completo".
 */
import { describe, it, expect } from "vitest";
import { normalizePhone, maskPhone, shortId } from "@/lib/agent/executors";

describe("normalizePhone", () => {
  it("agrega 56 a número de 9 dígitos que empieza con 9", () => {
    expect(normalizePhone("987654321")).toBe("56987654321");
  });

  it("respeta número que ya tiene 56", () => {
    expect(normalizePhone("56987654321")).toBe("56987654321");
  });

  it("strip espacios, +, guiones", () => {
    expect(normalizePhone("+56 9 8765 4321")).toBe("56987654321");
    expect(normalizePhone("+56-9-8765-4321")).toBe("56987654321");
  });

  it("número raro pasa sin cambios (defense in depth)", () => {
    expect(normalizePhone("12345")).toBe("12345");
  });
});

describe("maskPhone — anti-leak PII", () => {
  it("formato canónico: +56 9 ••••3338", () => {
    expect(maskPhone("56953743338")).toBe("+56 9 ••••3338");
  });

  it("phone null/undefined/vacío → '—'", () => {
    expect(maskPhone(null)).toBe("—");
    expect(maskPhone(undefined)).toBe("—");
    expect(maskPhone("")).toBe("—");
  });

  it("phone muy corto se devuelve sin masking (no rompe)", () => {
    expect(maskPhone("123")).toBe("123");
  });

  it("NUNCA muestra los dígitos del medio (regresión guard)", () => {
    const masked = maskPhone("56953743338");
    // El número del medio "537433" NO debería aparecer.
    expect(masked).not.toContain("537433");
    expect(masked).not.toContain("5374");
    // Solo los últimos 4 dígitos visibles.
    expect(masked).toMatch(/••••\d{4}$/);
  });
});

describe("shortId — para mensajes legibles", () => {
  it("toma los primeros 8 chars de un UUID", () => {
    expect(shortId("550e8400-e29b-41d4-a716-446655440000")).toBe("550e8400");
  });

  it("ID corto se devuelve completo (no padding)", () => {
    expect(shortId("abc")).toBe("abc");
  });
});
