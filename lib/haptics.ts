/** Vibrate lightly. Silently ignored on iOS Safari. */
export function hapticLight() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

/** Vibrate success pattern (two short pulses). */
export function hapticSuccess() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([12, 60, 12]);
  }
}
