import gsap from "gsap"
import { prefersFinePointer, prefersReducedMotion } from "@/lib/motion-prefs"

export function initMagneticButtons() {
  if (prefersReducedMotion() || !prefersFinePointer()) return

  const buttons = document.querySelectorAll<HTMLElement>("[data-magnetic], [data-cursor-magnetic]")
  const cleanups: Array<() => void> = []

  buttons.forEach((btn) => {
    const strength = Number.parseFloat(btn.dataset.magneticStrength || "0.32") || 0.32

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      gsap.to(btn, {
        x: x * strength,
        y: y * strength,
        scale: 1.035,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      })
    }

    const onLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.65,
        ease: "elastic.out(1, 0.55)",
        overwrite: "auto",
      })
    }

    btn.addEventListener("mousemove", onMove)
    btn.addEventListener("mouseleave", onLeave)
    cleanups.push(() => {
      btn.removeEventListener("mousemove", onMove)
      btn.removeEventListener("mouseleave", onLeave)
      gsap.set(btn, { clearProps: "x,y,scale" })
    })
  })

  return () => cleanups.forEach((fn) => fn())
}
