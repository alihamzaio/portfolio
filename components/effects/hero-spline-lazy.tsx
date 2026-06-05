"use client"

import dynamic from "next/dynamic"

export const HeroSplineLazy = dynamic(
  () => import("@/components/effects/hero-spline").then((m) => m.HeroSpline),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full h-[min(520px,70vh)] rounded-3xl bg-white/[0.02] border border-white/[0.06] animate-pulse"
        aria-hidden
      />
    ),
  }
)
