import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { splitText } from "@/lib/split-text"
import { prefersReducedMotion } from "@/lib/motion-prefs"

let registered = false

function ensurePlugin() {
  if (registered || typeof window === "undefined") return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

function animateNameLine(tl: gsap.core.Timeline, line: HTMLElement, at: number, splits: Array<{ revert: () => void }>) {
  const { units, revert } = splitText(line, "chars")
  splits.push({ revert })
  gsap.set(line, { opacity: 1, visibility: "visible" })
  gsap.set(units, { opacity: 0, y: 36, rotateX: -18, transformOrigin: "50% 100%" })
  tl.to(
    units,
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.85,
      stagger: { each: 0.032, from: "start" },
      onComplete: () => {
        gsap.set(units, { clearProps: "opacity,transform" })
      },
    },
    at
  )
}

export function initHeroKinetic() {
  ensurePlugin()

  const hero = document.querySelector<HTMLElement>("[data-hero-kinetic]")
  if (!hero) return

  if (prefersReducedMotion()) {
    hero.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
      el.style.opacity = "1"
      el.style.transform = "none"
    })
    hero.querySelectorAll<HTMLElement>("[data-hero-stat]").forEach((el) => {
      el.dispatchEvent(new CustomEvent("hero-stat-play"))
    })
    return
  }

  const splits: Array<{ revert: () => void }> = []

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

    const field = hero.querySelector<HTMLElement>("[data-hero-field]")
    const badge = hero.querySelector<HTMLElement>("[data-hero-badge]")
    const greeting = hero.querySelector<HTMLElement>("[data-hero-greeting]")
    const title = hero.querySelector<HTMLElement>("[data-hero-title]")
    const nameFirst = hero.querySelector<HTMLElement>("[data-split='name-first']")
    const nameSecond = hero.querySelector<HTMLElement>("[data-split='name-second']")
    const roleEl = hero.querySelector<HTMLElement>("[data-hero-role]")
    const leadEl = hero.querySelector<HTMLElement>("[data-hero-lead]")
    const visualEl = hero.querySelector<HTMLElement>("[data-hero-visual]")
    const statsWrap = hero.querySelector<HTMLElement>("[data-hero-stats]")
    const ctaWrap = hero.querySelector<HTMLElement>("[data-hero-cta]")
    const scrollCue = hero.querySelector<HTMLElement>("[data-hero-scroll]")

    if (field) {
      gsap.set(field, { opacity: 0 })
      tl.to(field, { opacity: 1, duration: 1.4, ease: "power2.out" }, 0)
    }

    if (badge) {
      gsap.set(badge, { opacity: 0, y: 16 })
      tl.to(badge, { opacity: 1, y: 0, duration: 0.65 }, 0.15)
    }

    if (greeting) {
      gsap.set(greeting, { opacity: 0, y: 20 })
      tl.to(greeting, { opacity: 1, y: 0, duration: 0.6 }, 0.28)
    }

    if (title) {
      gsap.set(title, { opacity: 0, y: 20 })
      tl.to(title, { opacity: 1, y: 0, duration: 0.6 }, 0.38)
    }

    if (nameFirst) animateNameLine(tl, nameFirst, 0.42, splits)
    if (nameSecond) animateNameLine(tl, nameSecond, 0.5, splits)

    if (roleEl) {
      gsap.set(roleEl, { opacity: 0, y: 28, filter: "blur(6px)" })
      tl.to(roleEl, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85 }, 1.02)
    }

    if (leadEl) {
      gsap.set(leadEl, { opacity: 0, y: 24 })
      tl.to(leadEl, { opacity: 1, y: 0, duration: 0.75 }, 1.15)
    }

    if (visualEl) {
      gsap.set(visualEl, { opacity: 0, scale: 0.92, y: 40, rotateY: -8, transformPerspective: 900 })
      tl.to(visualEl, { opacity: 1, scale: 1, y: 0, rotateY: 0, duration: 1.1, ease: "power3.out" }, 0.55)
    }

    if (statsWrap) {
      gsap.set(statsWrap, { opacity: 0, y: 36 })
      tl.to(
        statsWrap,
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          onStart: () => {
            statsWrap.querySelectorAll<HTMLElement>("[data-hero-stat]").forEach((stat) => {
              const raw = stat.dataset.statTarget || ""
              const valueEl = stat.querySelector<HTMLElement>("[data-stat-value]")
              if (!valueEl || !raw) return

              const cleaned = raw.replace(/,/g, "")
              const match = cleaned.match(/^([\d.]+)(.*)$/)
              if (!match) return

              const end = parseFloat(match[1])
              const suffix = match[2] || ""

              gsap.to(
                { val: 0 },
                {
                  val: end,
                  duration: 1.8,
                  ease: "power2.out",
                  onUpdate() {
                    const current = (this.targets()[0] as { val: number }).val
                    const rounded = Math.round(current)
                    valueEl.textContent =
                      suffix === "%"
                        ? `${rounded}%`
                        : suffix.includes("+")
                          ? `${rounded.toLocaleString()}${suffix}`
                          : `${rounded.toLocaleString()}${suffix}`
                  },
                }
              )
            })
          },
        },
        1.35
      )
    }

    if (ctaWrap) {
      const buttons = ctaWrap.querySelectorAll("a, button")
      gsap.set(buttons, { opacity: 0, y: 20 })
      tl.to(buttons, { opacity: 1, y: 0, duration: 0.65, stagger: 0.07 }, 1.28)
    }

    if (scrollCue) {
      gsap.set(scrollCue, { opacity: 0, y: 12 })
      tl.to(scrollCue, { opacity: 1, y: 0, duration: 0.65 }, 1.95)
    }

    const mask = hero.querySelector<HTMLElement>("[data-hero-mask]")
    if (mask) {
      gsap.to(mask, {
        scaleY: 0,
        transformOrigin: "top center",
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: hero,
          start: "bottom bottom",
          end: "bottom top",
          scrub: true,
        },
      })
    }

    const content = hero.querySelector<HTMLElement>("[data-hero-content]")
    if (content) {
      gsap.to(content, {
        y: -36,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
    }

    tl.eventCallback("onComplete", () => {
      hero
        .querySelectorAll<HTMLElement>(
          "[data-hero-badge], [data-hero-greeting], [data-hero-title], [data-hero-role], [data-hero-lead], [data-hero-visual], [data-hero-stats], [data-hero-cta], [data-hero-scroll], [data-split]"
        )
        .forEach((el) => {
          gsap.set(el, { clearProps: "opacity,transform,filter,visibility" })
        })
      hero.querySelectorAll<HTMLElement>(".split-char").forEach((el) => {
        gsap.set(el, { clearProps: "opacity,transform" })
      })
    })
  }, hero)

  return () => {
    ctx.revert()
    splits.forEach((s) => s.revert())
  }
}
