"use client"

import { useState, useEffect, type ReactNode } from "react"
import dynamic from "next/dynamic"
import { prefersReducedMotion } from "@/lib/motion-prefs"

const PremiumCursor = dynamic(
  () => import("@/components/cursor/premium-cursor").then((m) => m.PremiumCursor),
  { ssr: false }
)
const EnhancementRuntime = dynamic(
  () => import("@/components/effects/enhancement-runtime").then((m) => m.EnhancementRuntime),
  { ssr: false }
)
const ScrollProgress = dynamic(
  () => import("@/components/effects/scroll-progress").then((m) => m.ScrollProgress),
  { ssr: false }
)
const AmbientScene = dynamic(
  () => import("@/components/effects/ambient-scene").then((m) => m.AmbientScene),
  { ssr: false }
)

export function AppProviders({ children }: { children: ReactNode }) {
  const [effectsReady, setEffectsReady] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const enable = () => setEffectsReady(true)
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const t = window.setTimeout(enable, 2000)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <>
      {effectsReady && (
        <>
          <PremiumCursor />
          <EnhancementRuntime />
          <ScrollProgress />
          {!prefersReducedMotion() && <AmbientScene />}
        </>
      )}
      <div className="relative z-10">{children}</div>
    </>
  )
}
