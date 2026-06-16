"use client"

import { useState, useEffect, type ComponentType, type ReactNode } from "react"
import { prefersReducedMotion } from "@/lib/motion-prefs"

type EffectModule = {
  PremiumCursor: ComponentType
  EnhancementRuntime: ComponentType
  ScrollProgress: ComponentType
  AmbientScene: ComponentType
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [effects, setEffects] = useState<EffectModule | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const enable = () => {
      Promise.all([
        import("@/components/cursor/premium-cursor"),
        import("@/components/effects/enhancement-runtime"),
        import("@/components/effects/scroll-progress"),
        import("@/components/effects/ambient-scene"),
      ]).then(([cursor, runtime, progress, ambient]) => {
        setEffects({
          PremiumCursor: cursor.PremiumCursor,
          EnhancementRuntime: runtime.EnhancementRuntime,
          ScrollProgress: progress.ScrollProgress,
          AmbientScene: ambient.AmbientScene,
        })
      })
    }

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const t = window.setTimeout(enable, 2000)
    return () => window.clearTimeout(t)
  }, [])

  const PremiumCursor = effects?.PremiumCursor
  const EnhancementRuntime = effects?.EnhancementRuntime
  const ScrollProgress = effects?.ScrollProgress
  const AmbientScene = effects?.AmbientScene

  return (
    <>
      {PremiumCursor && <PremiumCursor />}
      {EnhancementRuntime && <EnhancementRuntime />}
      {ScrollProgress && <ScrollProgress />}
      {!prefersReducedMotion() && AmbientScene && <AmbientScene />}
      <div className="relative z-10">{children}</div>
    </>
  )
}
