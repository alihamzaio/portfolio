import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

let refreshTimer: ReturnType<typeof setTimeout> | undefined

/** Debounced ScrollTrigger.refresh — avoids pin-spacer stacking from rapid reflows. */
export function scheduleScrollRefresh(delayMs = 120) {
  if (typeof window === "undefined") return
  if (refreshTimer) clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => {
    refreshTimer = undefined
    ScrollTrigger.refresh(true)
  }, delayMs)
}

export function refreshScrollNow() {
  if (typeof window === "undefined") return
  ScrollTrigger.refresh(true)
}

export async function waitForLayoutReady() {
  if (typeof window === "undefined") return
  await document.fonts.ready.catch(() => undefined)
  await new Promise<void>((resolve) => {
    if (document.readyState === "complete") {
      resolve()
      return
    }
    window.addEventListener("load", () => resolve(), { once: true })
  })
}

export function waitForProjectsImages(section: HTMLElement) {
  const images = Array.from(section.querySelectorAll("img"))
  if (!images.length) return Promise.resolve()

  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve()
            return
          }
          img.addEventListener("load", () => resolve(), { once: true })
          img.addEventListener("error", () => resolve(), { once: true })
        })
    )
  )
}

export function logScrollTriggers(label: string) {
  if (process.env.NODE_ENV === "production") return
  const triggers = ScrollTrigger.getAll()
  console.group(`[ScrollTrigger] ${label} (${triggers.length})`)
  triggers.forEach((st, i) => {
    console.log(`#${i}`, {
      trigger: (st.trigger as Element | undefined)?.id || (st.trigger as Element | undefined)?.getAttribute?.("data-projects-pin") || st.trigger,
      start: st.start,
      end: st.end,
      pin: st.pin,
      vars: st.vars,
      scroll: st.scroll(),
    })
  })
  console.groupEnd()
}

export function resetScrollPosition() {
  if (typeof window === "undefined") return
  window.scrollTo(0, 0)
}
