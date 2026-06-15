"use client"

import { useState, useEffect, type ComponentType } from "react"
import { prefersReducedMotion } from "@/lib/motion-prefs"

function HeroParticleFallback() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(59,130,246,0.08), transparent 70%)",
      }}
    />
  )
}

/** Loads Three.js only on desktop — mobile gets CSS gradient only (no 822KB chunk). */
export function HeroParticleField() {
  const [mounted, setMounted] = useState(false)
  const [allowCanvas, setAllowCanvas] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [ParticleCanvas, setParticleCanvas] = useState<ComponentType | null>(null)

  useEffect(() => {
    setMounted(true)
    setAllowCanvas(window.matchMedia("(min-width: 1024px)").matches)
    setReduceMotion(prefersReducedMotion())
  }, [])

  useEffect(() => {
    if (!mounted || reduceMotion || !allowCanvas) return
    let cancelled = false
    import("@/components/effects/hero-particle-canvas").then((mod) => {
      if (!cancelled) setParticleCanvas(() => mod.HeroParticleCanvas)
    })
    return () => {
      cancelled = true
    }
  }, [mounted, reduceMotion, allowCanvas])

  if (!mounted) return null
  if (reduceMotion || !allowCanvas) return <HeroParticleFallback />
  if (!ParticleCanvas) return <HeroParticleFallback />

  return <ParticleCanvas />
}
