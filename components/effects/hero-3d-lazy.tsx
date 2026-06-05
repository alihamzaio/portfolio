"use client"

import dynamic from "next/dynamic"

export const Hero3DLazy = dynamic(
  () => import("@/components/effects/hero-tech-scene").then((m) => m.HeroTechScene),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full aspect-[4/5] max-h-[580px] rounded-3xl bg-white/[0.02] border border-white/[0.06] animate-pulse relative overflow-hidden"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,217,255,0.06),transparent_65%)]" />
      </div>
    ),
  }
)
