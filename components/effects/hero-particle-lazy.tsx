"use client"

import dynamic from "next/dynamic"

export const HeroParticleLazy = dynamic(
  () => import("@/components/effects/hero-particle-field").then((m) => m.HeroParticleField),
  { loading: () => null }
)
