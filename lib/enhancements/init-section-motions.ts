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

export function initSectionMotions() {
  ensurePlugin()
  if (prefersReducedMotion()) return

  const splits: Array<{ revert: () => void }> = []

  const ctx = gsap.context(() => {
    document.querySelectorAll<HTMLElement>("[data-reveal-title]").forEach((el) => {
      const { units, revert } = splitText(el, "words")
      splits.push({ revert })
      gsap.set(units, { opacity: 0, y: 48, rotateZ: 1.5 })
      gsap.to(units, {
        opacity: 1,
        y: 0,
        rotateZ: 0,
        duration: 0.9,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      })
    })

    document.querySelectorAll<HTMLElement>("[data-reveal-clip]").forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.1,
          ease: "power4.inOut",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      )
    })

    document.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => {
      const target = Number.parseFloat(el.dataset.counter || "0")
      const suffix = el.dataset.counterSuffix || ""
      const obj = { val: 0 }
      gsap.to(obj, {
        val: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(obj.val)}${suffix}`
        },
      })
    })

    document.querySelectorAll<HTMLElement>("[data-marquee]").forEach((wrap) => {
      const track = wrap.querySelector<HTMLElement>("[data-marquee-track]")
      if (!track) return
      const content = track.innerHTML
      track.innerHTML = content + content
      const distance = track.scrollWidth / 2
      gsap.to(track, {
        x: -distance,
        duration: distance / 60,
        ease: "none",
        repeat: -1,
      })
    })
  })

  return () => {
    ctx.revert()
    splits.forEach((s) => s.revert())
  }
}
