"use client"

import dynamic from "next/dynamic"

export const HeroTsParticlesLazy = dynamic(
  () => import("@/components/effects/hero-tsparticles").then((m) => m.HeroTsParticles),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 z-[1] pointer-events-none animate-pulse opacity-30" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,212,255,0.08),transparent_55%)]" />
      </div>
    ),
  }
)
