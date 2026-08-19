"use client"

import dynamic from "next/dynamic"
import { useState, useEffect, type ReactNode } from "react"
import { prefersReducedMotion } from "@/lib/motion-prefs"

const PremiumCursor = dynamic(
  () => import("@/components/cursor/premium-cursor").then((m) => m.PremiumCursor).catch(() => ({ default: () => null })),
  { ssr: false }
)

const EnhancementRuntime = dynamic(
  () => import("@/components/effects/enhancement-runtime").then((m) => m.EnhancementRuntime).catch(() => ({ default: () => null })),
  { ssr: false }
)

const ScrollProgress = dynamic(
  () => import("@/components/effects/scroll-progress").then((m) => m.ScrollProgress).catch(() => ({ default: () => null })),
  { ssr: false }
)

const AmbientScene = dynamic(
  () => import("@/components/effects/ambient-scene").then((m) => m.AmbientScene).catch(() => ({ default: () => null })),
  { ssr: false }
)

const ServerKeepAlive = dynamic(
  () => import("@/components/effects/server-keepalive").then((m) => m.ServerKeepAlive).catch(() => ({ default: () => null })),
  { ssr: false }
)

export function AppProviders({ children }: { children: ReactNode }) {
  const [enableExtras, setEnableExtras] = useState(false)
  const [enableCursor, setEnableCursor] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const onInteract = () => setEnableCursor(true)
    window.addEventListener("pointerdown", onInteract, { once: true, passive: true })
    window.addEventListener("mousemove", onInteract, { once: true, passive: true })

    let idleId = 0
    let timer = 0

    const enable = () => setEnableExtras(true)

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(enable, { timeout: 6000 })
    } else {
      timer = window.setTimeout(enable, 3000)
    }

    return () => {
      if (idleId) window.cancelIdleCallback(idleId)
      if (timer) window.clearTimeout(timer)
      window.removeEventListener("pointerdown", onInteract)
      window.removeEventListener("mousemove", onInteract)
    }
  }, [])

  return (
    <>
      {enableCursor ? <PremiumCursor /> : null}
      {enableExtras ? <EnhancementRuntime /> : null}
      {enableExtras ? <ScrollProgress /> : null}
      {enableExtras && !prefersReducedMotion() ? <AmbientScene /> : null}
      <ServerKeepAlive />
      <div className="relative z-10">{children}</div>
    </>
  )
}
