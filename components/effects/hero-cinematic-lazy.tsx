"use client"

import dynamic from "next/dynamic"

export const HeroCinematicLazy = dynamic(
  () => import("@/components/effects/hero-cinematic").then((m) => m.HeroCinematic),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full aspect-[4/5] max-h-[580px] rounded-3xl bg-white/[0.02] border border-white/[0.06] animate-pulse"
        aria-hidden
      />
    ),
  }
)
