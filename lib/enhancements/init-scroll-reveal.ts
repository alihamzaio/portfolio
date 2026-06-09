import { prefersReducedMotion } from "@/lib/motion-prefs"

const ACTIVE_CLASS = "scroll-reveal-active"
const boundAnimate = new WeakSet<Element>()

function isInViewport(rect: DOMRect) {
  return rect.top < window.innerHeight && rect.bottom > 0
}

function showImmediately(el: HTMLElement) {
  el.classList.add("is-visible")
}

function primeInViewElements() {
  document.querySelectorAll<HTMLElement>("[data-animate]").forEach((el) => {
    if (isInViewport(el.getBoundingClientRect())) {
      el.classList.add("is-visible")
    }
  })
}

export function initScrollReveal() {
  const reduced = prefersReducedMotion()

  if (reduced) {
    document.querySelectorAll<HTMLElement>("[data-animate]").forEach(showImmediately)
    document.documentElement.classList.add("motion-reduce-active")
    return () => {
      document.documentElement.classList.remove("motion-reduce-active")
    }
  }

  const seen = new WeakSet<Element>()

  const reveal = (el: HTMLElement, delay: number) => {
    if (seen.has(el)) return
    seen.add(el)
    window.setTimeout(() => {
      if (delay > 0) {
        el.style.setProperty("--reveal-delay", `${delay}ms`)
      }
      el.classList.add("is-visible")
    }, delay)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target as HTMLElement
        const staggerParent = el.closest("[data-animate-stagger]")
        if (staggerParent) {
          const items = Array.from(staggerParent.querySelectorAll<HTMLElement>("[data-animate]"))
          items.forEach((item, i) => reveal(item, i * 120))
        } else {
          reveal(el, 0)
        }
        observer.unobserve(el)
      })
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  )

  const bind = () => {
    document.querySelectorAll<HTMLElement>("[data-animate]").forEach((el) => {
      if (boundAnimate.has(el) || el.classList.contains("is-visible")) return
      boundAnimate.add(el)
      observer.observe(el)
    })
  }

  primeInViewElements()
  document.documentElement.classList.add(ACTIVE_CLASS)
  bind()

  let bindFrame = 0
  const mo = new MutationObserver(() => {
    cancelAnimationFrame(bindFrame)
    bindFrame = requestAnimationFrame(() => {
      bindFrame = requestAnimationFrame(bind)
    })
  })
  mo.observe(document.body, { childList: true, subtree: true })

  return () => {
    cancelAnimationFrame(bindFrame)
    observer.disconnect()
    mo.disconnect()
    document.documentElement.classList.remove(ACTIVE_CLASS)
  }
}
