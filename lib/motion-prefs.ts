/** Client-safe check for reduced motion (SSR returns false). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function prefersFinePointer(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(pointer: fine)").matches
}

/** Loader / hero stagger delay — skipped when user prefers reduced motion. */
export function getIntroDelayMs(): number {
  return prefersReducedMotion() ? 0 : 1400
}
