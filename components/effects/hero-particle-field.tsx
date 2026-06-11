"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { prefersReducedMotion } from "@/lib/motion-prefs"

const HeroParticleCanvas = dynamic(
  () => import("@/components/effects/hero-particle-canvas").then((m) => m.HeroParticleCanvas),
  { ssr: false }
)

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

  useEffect(() => {
    setMounted(true)
    setAllowCanvas(window.matchMedia("(min-width: 1024px)").matches)
    setReduceMotion(prefersReducedMotion())
  }, [])

  if (!mounted || reduceMotion || !allowCanvas) {
    return <HeroParticleFallback />
  }

  return <HeroParticleCanvas />
}
