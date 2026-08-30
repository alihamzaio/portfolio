import type Lenis from "lenis"
import { prefersReducedMotion } from "@/lib/motion-prefs"

/** Fixed header offset for in-page anchor scroll (px) */
export const NAV_SCROLL_OFFSET = -80

let lenisInstance: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance
}

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function scrollToSectionId(id: string, offset = NAV_SCROLL_OFFSET) {
  const el = document.getElementById(id)
  if (!el) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[nav] No DOM element found for section id="${id}"`)
    }
    return false
  }

  if (lenisInstance && !prefersReducedMotion()) {
    lenisInstance.scrollTo(el, { offset, duration: 1.2 })
    return true
  }

  const top = el.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" })
  return true
}
