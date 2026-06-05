"use client"

import dynamic from "next/dynamic"

export const HeroGlobeLazy = dynamic(
  () => import("@/components/effects/hero-wireframe-globe").then((m) => m.HeroWireframeGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 z-0 bg-[#000] animate-pulse opacity-20" aria-hidden />
    ),
  }
)
