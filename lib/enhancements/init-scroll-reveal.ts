import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { prefersReducedMotion } from "@/lib/motion-prefs"

const ACTIVE_CLASS = "scroll-reveal-active"

let registered = false

function ensurePlugin() {
  if (registered || typeof window === "undefined") return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

function showAll() {
  document.querySelectorAll<HTMLElement>("[data-animate]").forEach((el) => {
    el.classList.add("is-visible")
    gsap.set(el, { clearProps: "opacity,transform,filter" })
  })
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    gsap.set(el, { clearProps: "transform" })
  })
}

/**
 * Premium scroll choreography — elements start hidden once GSAP is active.
 */
export function initScrollReveal() {
  ensurePlugin()
  const reduced = prefersReducedMotion()

  document.documentElement.classList.add(ACTIVE_CLASS)

  if (reduced) {
    showAll()
    document.documentElement.classList.add("motion-reduce-active")
    return () => {
      document.documentElement.classList.remove(ACTIVE_CLASS, "motion-reduce-active")
    }
  }

  document.documentElement.classList.remove("motion-reduce-active")

  const ctx = gsap.context(() => {
    const ease = "power3.out"
    const handled = new Set<Element>()

    const hide = (el: HTMLElement) => {
      gsap.set(el, { opacity: 0, y: 80, filter: "blur(12px)" })
    }

    const reveal = (targets: HTMLElement[], opts: { stagger?: number; delay?: number } = {}) => {
      if (!targets.length) return
      const { stagger = 0.15, delay = 0 } = opts
      targets.forEach(hide)

      ScrollTrigger.batch(targets, {
        start: "top 86%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            ease,
            stagger,
            delay,
            overwrite: "auto",
            onComplete: () => batch.forEach((el) => (el as HTMLElement).classList.add("is-visible")),
          })
        },
      })
    }

    document.querySelectorAll<HTMLElement>("[data-animate-stagger]").forEach((group) => {
      const targets = Array.from(group.querySelectorAll<HTMLElement>("[data-animate]"))
      targets.forEach((el) => handled.add(el))
      reveal(targets, { stagger: 0.16, delay: 0.06 })
    })

    document.querySelectorAll<HTMLElement>("[data-animate]").forEach((el) => {
      if (handled.has(el)) return
      if (el.classList.contains("is-visible")) return

      const isTimeline = el.classList.contains("timeline-card-enter")
      const fromX = isTimeline
        ? Number.parseFloat(getComputedStyle(el).getPropertyValue("--timeline-from")) || -64
        : 0

      hide(el)
      if (fromX) gsap.set(el, { x: fromX })

      gsap.to(el, {
        opacity: 1,
        y: 0,
        x: 0,
        filter: "blur(0px)",
        duration: 1.25,
        ease,
        scrollTrigger: {
          trigger: el,
          start: "top 84%",
          once: true,
        },
        onComplete: () => el.classList.add("is-visible"),
      })
    })

    document.querySelectorAll<HTMLElement>("header[data-animate]").forEach((header) => {
      const label = header.querySelector<HTMLElement>(".section-label")
      const title = header.querySelector<HTMLElement>(".section-title")
      const desc = header.querySelector<HTMLElement>("p")

      ;[label, title, desc].forEach((el) => {
        if (!el) return
        gsap.fromTo(
          el,
          { opacity: 0, y: 48, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,
            ease,
            scrollTrigger: { trigger: header, start: "top 82%", once: true },
          }
        )
      })
    })

    document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
      const amount = Number.parseFloat(el.dataset.parallax || "0.12") || 0.12
      gsap.to(el, {
        y: () => amount * -120,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })
    })

    document.querySelectorAll<HTMLElement>("section.section-pad").forEach((section) => {
      const glow = section.querySelector<HTMLElement>(".section-glow")
      if (!glow) return
      gsap.fromTo(
        glow,
        { opacity: 0.2, scale: 0.99 },
        {
          opacity: 0.85,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 92%",
            end: "top 45%",
            scrub: true,
          },
        }
      )
    })
  })

  return () => {
    ctx.revert()
    document.documentElement.classList.remove(ACTIVE_CLASS)
  }
}
