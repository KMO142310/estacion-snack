import { describe, it, expect } from "vitest";
import { safeJsonLd } from "@/lib/json-ld";

describe("safeJsonLd — XSS prevention en <script type=application/ld+json>", () => {
  it("escapa < > & a sequences Unicode (no rompe el parser HTML)", () => {
    const out = safeJsonLd({ name: "A & B" });
    expect(out).toContain("\\u0026");
    expect(out).not.toContain(" & ");
  });

  it("</script> dentro de un campo NO rompe el container", () => {
    // Vector clásico: `name` con `</script><script>alert(1)</script>` → XSS si no se escapa.
    const out = safeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(out).toContain("\\u003c/script\\u003e");
    expect(out).toContain("\\u003cscript\\u003e");
  });

  it("escapa < y > por separado", () => {
    const out = safeJsonLd({ a: "<", b: ">" });
    expect(out).toContain("\\u003c");
    expect(out).toContain("\\u003e");
    expect(out).not.toMatch(/[<>]/);
  });

  it("escapa U+2028 y U+2029 (line separators que rompen JS strict)", () => {
    // Estos caracteres están permitidos en JSON pero no en JS strings → causan SyntaxError.
    const out = safeJsonLd({ a: "linea1 linea2", b: "linea3 linea4" });
    expect(out).toContain("\\u2028");
    expect(out).toContain("\\u2029");
    expect(out).not.toContain(" ");
    expect(out).not.toContain(" ");
  });

  it("output es JSON válido tras des-escapar (round-trip)", () => {
    const obj = { name: "Mix Europeo", price: 9000, tags: ["frutos", "secos"] };
    const escaped = safeJsonLd(obj);
    // Des-escapar las secuencias Unicode antes de parsear (parse las acepta nativamente).
    const parsed = JSON.parse(escaped);
    expect(parsed).toEqual(obj);
  });

  it("maneja objetos vacíos y null", () => {
    expect(safeJsonLd({})).toBe("{}");
    expect(safeJsonLd(null)).toBe("null");
  });
});
