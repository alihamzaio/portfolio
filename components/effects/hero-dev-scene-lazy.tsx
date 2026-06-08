"use client"

import dynamic from "next/dynamic"

export const HeroDevSceneLazy = dynamic(
  () => import("@/components/effects/hero-dev-scene").then((m) => m.HeroDevScene),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-[min(340px,42vw)] h-[380px] rounded-2xl border border-white/[0.06] bg-white/[0.02] animate-pulse"
        aria-hidden
      />
    ),
  }
)
