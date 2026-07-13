"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
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

const HeroParticleCanvas = dynamic(
  () => import("@/components/effects/hero-particle-canvas").then((m) => m.HeroParticleCanvas),
  { ssr: false, loading: () => <HeroParticleFallback /> }
)

/** Loads Three.js only on desktop — mobile gets CSS gradient only. */
export function HeroParticleField() {
  const [mounted, setMounted] = useState(false)
  const [allowCanvas, setAllowCanvas] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    setAllowCanvas(window.matchMedia("(min-width: 1024px)").matches)
    setReduceMotion(prefersReducedMotion())
  }, [])

  if (!mounted) return <HeroParticleFallback />
  if (reduceMotion || !allowCanvas) return <HeroParticleFallback />

  return <HeroParticleCanvas />
}
