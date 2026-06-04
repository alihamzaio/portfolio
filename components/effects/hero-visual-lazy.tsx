"use client"

import dynamic from "next/dynamic"

export const HeroVisualLazy = dynamic(
  () => import("@/components/effects/hero-visual").then((m) => m.HeroVisual),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full aspect-[4/5] max-h-[560px] rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse"
        aria-hidden
      />
    ),
  }
)
