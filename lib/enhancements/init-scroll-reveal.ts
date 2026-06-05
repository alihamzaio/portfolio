import { prefersReducedMotion } from "@/lib/motion-prefs"

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)"

function showImmediately(el: HTMLElement) {
  el.style.opacity = "1"
  el.style.transform = "translateY(0) translateX(0)"
  el.classList.add("is-visible")
}

function revealHeading(inner: HTMLElement) {
  inner.style.transform = "translateY(0)"
}

export function initScrollReveal() {
  const reduced = prefersReducedMotion()

  if (reduced) {
    document.querySelectorAll<HTMLElement>("[data-animate]").forEach(showImmediately)
    document.querySelectorAll<HTMLElement>("[data-heading-inner]").forEach(revealHeading)
    document.body.classList.add("motion-reduce-active")
    return () => {
      document.body.classList.remove("motion-reduce-active")
    }
  }

  const seen = new WeakSet<Element>()

  const reveal = (el: HTMLElement, delay: number) => {
    if (seen.has(el)) return
    seen.add(el)
    el.style.willChange = "transform, opacity"
    el.style.transition = `opacity 700ms ${EASE}, transform 700ms ${EASE}`
    el.style.transitionDelay = `${delay}ms`
    requestAnimationFrame(() => {
      el.style.opacity = "1"
      el.classList.add("is-visible")
      if (!el.classList.contains("timeline-card-enter")) {
        el.style.transform = "translateY(0)"
      }
      window.setTimeout(() => {
        el.style.willChange = "auto"
      }, 700 + delay)
    })
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
      if (el.dataset.revealBound) return
      el.dataset.revealBound = "1"
      el.style.opacity = "0"
      el.style.transform = "translateY(40px)"
      observer.observe(el)
    })

    document.querySelectorAll<HTMLElement>("[data-heading-reveal]").forEach((wrap) => {
      if (wrap.dataset.revealBound) return
      wrap.dataset.revealBound = "1"
      const inner = wrap.querySelector<HTMLElement>("[data-heading-inner]")
      if (!inner) return
      inner.style.transform = "translateY(100%)"
      inner.style.transition = "transform 800ms cubic-bezier(0.76, 0, 0.24, 1)"
      const hObs = new IntersectionObserver(
        ([e]) => {
          if (!e?.isIntersecting) return
          inner.style.transform = "translateY(0)"
          inner.style.willChange = "auto"
          hObs.disconnect()
        },
        { threshold: 0.3 }
      )
      hObs.observe(wrap)
    })
  }

  bind()
  const mo = new MutationObserver(bind)
  mo.observe(document.body, { childList: true, subtree: true })

  return () => {
    observer.disconnect()
    mo.disconnect()
  }
}
