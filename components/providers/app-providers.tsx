"use client"

import dynamic from "next/dynamic"
import { useEffect, useState, type ReactNode } from "react"
import { prefersReducedMotion } from "@/lib/motion-prefs"

const EnhancementRuntime = dynamic(
  () => import("@/components/effects/enhancement-runtime").then((m) => m.EnhancementRuntime).catch(() => ({ default: () => null })),
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
  const [motionOk, setMotionOk] = useState(false)

  useEffect(() => {
    setMotionOk(!prefersReducedMotion())
  }, [])

  return (
    <>
      <EnhancementRuntime />
      {motionOk ? <AmbientScene /> : null}
      <ServerKeepAlive />
      <div className="relative z-10">{children}</div>
    </>
  )
}
