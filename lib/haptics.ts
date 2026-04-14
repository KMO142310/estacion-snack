/**
 * Haptics · Estación Snack
 *
 * Orquestación multi-beat usando Web Vibration API.
 * En iOS Safari `navigator.vibrate` no hace nada (WebKit no implementa),
 * pero todos los patterns son silenciosamente ignorados sin throw.
 *
 * Refs:
 * - MDN Vibration API (2024)
 * - Apple HIG Haptics (describe patterns que replicamos aprox vía vibrate)
 * - W3C Vibration API Level 1
 *
 * Patterns definidos con intención semántica, no ornamental:
 * - chip: selección (un tap corto)
 * - stamp: confirmación de acción (doble golpe, sello que presiona)
 * - whistle: señal de partida (patrón triple, solo en pedido enviado)
 */

type Pattern = number | number[];

function vibrate(pattern: Pattern): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Some browsers throw on invalid patterns; fail silent.
  }
}

/** Vibración corta para selección (chips, toggles, radios). */
export function hapticLight(): void {
  vibrate(10);
}

/** Alias semántico de hapticLight — selección de chip/radio. */
export function hapticChip(): void {
  vibrate(10);
}

/** Dos pulsos cortos para confirmación (éxito genérico, toasts). */
export function hapticSuccess(): void {
  vibrate([12, 60, 12]);
}

/**
 * Sello de imprenta presionando papel — doble golpe firme.
 * Uso: add-to-cart confirmado, item guardado.
 * Feel: "clunk-clunk" (el sello baja y se levanta).
 */
export function hapticStamp(): void {
  vibrate([40, 30, 40]);
}

/**
 * Silbato de partida — patrón triple de intensidad decreciente.
 * Uso: pedido enviado por WhatsApp (único momento culminante).
 * Feel: "wheeet · wheeet · wheeeet" (tren arrancando).
 */
export function hapticWhistle(): void {
  vibrate([20, 40, 20, 40, 60]);
}
