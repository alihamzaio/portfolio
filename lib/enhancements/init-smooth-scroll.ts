import { prefersReducedMotion } from "@/lib/motion-prefs"

export function initSmoothScrollLerp() {
  if (prefersReducedMotion()) return () => {}

  let targetY = window.scrollY
  let currentY = window.scrollY
  let raf = 0
  let animating = false

  const tick = () => {
    if (Math.abs(targetY - currentY) < 0.5) {
      currentY = targetY
      window.scrollTo(0, currentY)
      animating = false
      return
    }
    currentY += (targetY - currentY) * 0.08
    window.scrollTo(0, currentY)
    raf = requestAnimationFrame(tick)
  }

  const scrollToY = (y: number) => {
    targetY = y
    if (!animating) {
      animating = true
      raf = requestAnimationFrame(tick)
    }
  }

  const onClick = (e: MouseEvent) => {
    const anchor = (e.target as HTMLElement).closest('a[href*="#"]') as HTMLAnchorElement | null
    if (!anchor) return
    const href = anchor.getAttribute("href") || ""
    const hash = href.includes("#") ? href.split("#")[1] : ""
    if (!hash) return
    const el = document.getElementById(hash)
    if (!el) return
    if (href.startsWith("/#") && window.location.pathname !== "/") return
    e.preventDefault()
    const top = el.getBoundingClientRect().top + window.scrollY - 88
    scrollToY(top)
    window.history.pushState(null, "", href.startsWith("#") ? href : `/#${hash}`)
  }

  document.addEventListener("click", onClick)

  return () => {
    cancelAnimationFrame(raf)
    document.removeEventListener("click", onClick)
  }
}
