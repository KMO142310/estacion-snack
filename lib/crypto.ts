import { timingSafeEqual } from "node:crypto";

/**
 * Constant-time string comparison. Use for ANY secret comparison (API tokens,
 * HMAC signatures, bearer tokens). Regular === leaks length/content via timing
 * and enables remote brute-force. Never replace this with ===.
 */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    // Constant-time self-compare to avoid leaking length difference via timing.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}
