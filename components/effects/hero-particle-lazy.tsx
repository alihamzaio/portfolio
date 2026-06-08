"use client"

import dynamic from "next/dynamic"

export const HeroParticleLazy = dynamic(
  () => import("@/components/effects/hero-particle-field").then((m) => m.HeroParticleField),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[#0a0f1a] animate-pulse opacity-40" aria-hidden />
    ),
  }
)
