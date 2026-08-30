import gsap from "gsap"
import { prefersReducedMotion } from "@/lib/motion-prefs"

/** Cinematic hero load sequence — runs once on homepage mount */
export function initHeroEntrance() {
  if (prefersReducedMotion()) return () => {}

  const left = document.querySelector<HTMLElement>("[data-hero-left]")
  const right = document.querySelector<HTMLElement>("[data-hero-right]")
  const sigil = document.querySelector<HTMLElement>("[data-hero-sigil]")
  const stage = document.querySelector<HTMLElement>("[data-hero-stage]")
  const mark = document.querySelector<HTMLElement>("[data-hero-mark]")
  const beam = document.querySelector<HTMLElement>("[data-hero-beam]")
  const shards = document.querySelectorAll<HTMLElement>("[data-hero-shard]")
  const metrics = document.querySelectorAll<HTMLElement>("[data-hero-metric]")

  if (!left && !right) return () => {}

  const ctx = gsap.context(() => {
    if (left) gsap.set(left, { opacity: 0, x: -56, filter: "blur(14px)" })
    if (right) gsap.set(right, { opacity: 0, x: 64, filter: "blur(16px)" })
    if (sigil) gsap.set(sigil, { opacity: 0, scale: 0.86 })
    if (stage) gsap.set(stage, { opacity: 0, y: 72, rotateX: 14, filter: "blur(8px)" })
    if (mark) gsap.set(mark, { opacity: 0, scale: 0.6, filter: "blur(6px)" })
    if (beam) gsap.set(beam, { scaleY: 0, opacity: 0, transformOrigin: "top center" })
    if (shards.length) gsap.set(shards, { opacity: 0, scale: 0.4 })
    if (metrics.length) gsap.set(metrics, { opacity: 0, y: 32 })

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

    if (left) {
      tl.fromTo(
        left,
        { opacity: 0, x: -56, filter: "blur(14px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.2 },
        0.1
      )
    }

    if (right) {
      tl.fromTo(
        right,
        { opacity: 0, x: 64, filter: "blur(16px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.3 },
        0.22
      )
    }

    if (sigil) {
      tl.fromTo(sigil, { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power4.out" }, 0.35)
    }

    if (beam) {
      tl.fromTo(
        beam,
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 1.4, ease: "power2.inOut" },
        0.42
      )
    }

    if (stage) {
      tl.fromTo(
        stage,
        { opacity: 0, y: 72, rotateX: 14, filter: "blur(8px)" },
        { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", duration: 1.35, ease: "power4.out" },
        0.48
      )
    }

    if (shards.length) {
      tl.fromTo(
        shards,
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.9, stagger: 0.08, ease: "back.out(1.4)" },
        0.62
      )
    }

    if (mark) {
      tl.fromTo(
        mark,
        { opacity: 0, scale: 0.6, filter: "blur(6px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1, ease: "power4.out" },
        0.72
      )
    }

    if (metrics.length) {
      tl.fromTo(
        metrics,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 },
        0.85
      )
    }
  })

  return () => ctx.revert()
}
