"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

function DevSceneFallback() {
  return (
    <div
      className="w-[min(340px,42vw)] h-[380px] rounded-2xl border border-white/[0.06] bg-white/[0.02] animate-pulse"
      aria-hidden
    />
  )
}

const HeroDevScene = dynamic(
  () => import("@/components/effects/hero-dev-scene").then((m) => m.HeroDevScene).catch(() => ({ default: () => null })),
  { ssr: false, loading: () => <DevSceneFallback /> }
)

/** Loads hero 3D scene on desktop only after idle — keeps LCP on the H1 text. */
export function HeroDevSceneLazy() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return

    let idleId = 0
    let timer = 0
    const enable = () => setShow(true)

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(enable, { timeout: 4000 })
    } else {
      timer = window.setTimeout(enable, 2500)
    }

    return () => {
      if (idleId) window.cancelIdleCallback(idleId)
      if (timer) window.clearTimeout(timer)
    }
  }, [])

  if (!show) return <DevSceneFallback />
  return <HeroDevScene />
}
