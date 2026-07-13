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
  () => import("@/components/effects/hero-dev-scene").then((m) => m.HeroDevScene),
  { ssr: false, loading: () => <DevSceneFallback /> }
)

/** Loads hero dev scene on desktop after mount — avoids SSR bailout hydration errors. */
export function HeroDevSceneLazy() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return
    setShow(true)
  }, [])

  if (!show) return null
  return <HeroDevScene />
}
