/**
 * Escape seguro para JSON-LD inline en <script type="application/ld+json">.
 *
 * Problema: JSON.stringify NO escapa "</script>" dentro de strings; si algún
 * campo (ej. product.name) contiene "</script>...", rompe el parser y puede
 * permitir XSS. Esta función escapa los caracteres < > & como secuencias
 * Unicode inofensivas.
 *
 * Ref: https://github.com/google/code-prettify/issues/60 + OWASP XSS prevention.
 */
export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
