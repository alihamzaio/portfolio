"use client"

import { useEffect, useRef, useState, type ComponentType } from "react"
import { prefersReducedMotion } from "@/lib/motion-prefs"

/** Loads AboutOrb only when the section enters the viewport — avoids ~300KB Three.js on initial load. */
export function AboutOrbLazy() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [Orb, setOrb] = useState<ComponentType | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const host = hostRef.current
    if (!host) return

    let cancelled = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || cancelled) return
        observer.disconnect()
        import("@/components/effects/about-orb").then((mod) => {
          if (!cancelled) setOrb(() => mod.AboutOrb)
        })
      },
      { rootMargin: "240px 0px" }
    )

    observer.observe(host)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={hostRef} className="pointer-events-none absolute inset-0" aria-hidden>
      {Orb && <Orb />}
    </div>
  )
}
