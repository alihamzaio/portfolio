"use client"

import { useEffect, useState, type ComponentType } from "react"

function DevSceneFallback() {
  return (
    <div
      className="w-[min(340px,42vw)] h-[380px] rounded-2xl border border-white/[0.06] bg-white/[0.02] animate-pulse"
      aria-hidden
    />
  )
}

/** Loads hero dev scene on desktop after mount — avoids SSR bailout hydration errors. */
export function HeroDevSceneLazy() {
  const [mounted, setMounted] = useState(false)
  const [DevScene, setDevScene] = useState<ComponentType | null>(null)

  useEffect(() => {
    setMounted(true)
    if (!window.matchMedia("(min-width: 1024px)").matches) return
    let cancelled = false
    import("@/components/effects/hero-dev-scene").then((mod) => {
      if (!cancelled) setDevScene(() => mod.HeroDevScene)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!mounted) return null
  if (!DevScene) return <DevSceneFallback />
  return <DevScene />
}
