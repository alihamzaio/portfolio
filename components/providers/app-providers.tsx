"use client"

import { useState, useEffect, type ComponentType, type ReactNode } from "react"
import { prefersReducedMotion } from "@/lib/motion-prefs"

type EffectModule = {
  EnhancementRuntime: ComponentType
  ScrollProgress: ComponentType
  AmbientScene: ComponentType
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [effects, setEffects] = useState<EffectModule | null>(null)
  const [PremiumCursor, setPremiumCursor] = useState<ComponentType | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const loadCursor = () => {
      import("@/components/cursor/premium-cursor").then((mod) => {
        setPremiumCursor(() => mod.PremiumCursor)
      })
    }

    const onInteract = () => loadCursor()
    window.addEventListener("pointerdown", onInteract, { once: true, passive: true })
    window.addEventListener("mousemove", onInteract, { once: true, passive: true })

    const loadEffects = () => {
      Promise.all([
        import("@/components/effects/enhancement-runtime"),
        import("@/components/effects/scroll-progress"),
        import("@/components/effects/ambient-scene"),
      ]).then(([runtime, progress, ambient]) => {
        setEffects({
          EnhancementRuntime: runtime.EnhancementRuntime,
          ScrollProgress: progress.ScrollProgress,
          AmbientScene: ambient.AmbientScene,
        })
      })
    }

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(loadEffects, { timeout: 6000 })
      return () => {
        window.cancelIdleCallback(id)
        window.removeEventListener("pointerdown", onInteract)
        window.removeEventListener("mousemove", onInteract)
      }
    }

    const t = window.setTimeout(loadEffects, 3000)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener("pointerdown", onInteract)
      window.removeEventListener("mousemove", onInteract)
    }
  }, [])

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
