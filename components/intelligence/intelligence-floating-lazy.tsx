"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const IntelligenceFloatingTrigger = dynamic(
  () =>
    import("@/components/intelligence/intelligence-floating-trigger").then(
      (m) => m.IntelligenceFloatingTrigger
    ),
  { ssr: false }
)

/** Defer the floating prompt until the browser is idle so first paint stays light. */
export function IntelligenceFloatingLazy() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(() => setReady(true), { timeout: 3500 })
      return () => win.cancelIdleCallback?.(id)
    }
    const t = window.setTimeout(() => setReady(true), 2200)
    return () => window.clearTimeout(t)
  }, [])

  if (!ready) return null
  return <IntelligenceFloatingTrigger />
}
