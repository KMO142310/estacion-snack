import { describe, it, expect } from "vitest";
import { safeEqual } from "@/lib/crypto";

describe("safeEqual", () => {
  it("retorna true para strings idénticos", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("", "")).toBe(true);
    expect(safeEqual("a".repeat(256), "a".repeat(256))).toBe(true);
  });

  it("retorna false para strings distintos de la misma longitud", () => {
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("token-a", "token-b")).toBe(false);
  });

  it("retorna false para strings de longitud distinta sin crashear", () => {
    // Importante: la versión naive de comparación lanzaría RangeError en
    // timingSafeEqual. safeEqual hace self-compare para no leakear longitud.
    expect(safeEqual("short", "muchmuchlonger")).toBe(false);
    expect(safeEqual("muchmuchlonger", "short")).toBe(false);
    expect(safeEqual("", "x")).toBe(false);
  });

  it("maneja caracteres unicode correctamente (UTF-8 bytes, no code units)", () => {
    expect(safeEqual("niño", "niño")).toBe(true);
    expect(safeEqual("niño", "nino")).toBe(false);
    expect(safeEqual("✓", "✓")).toBe(true);
  });

  it("es case-sensitive (no usar para username matching sin canonicalizar)", () => {
    expect(safeEqual("Token", "token")).toBe(false);
  });
});
