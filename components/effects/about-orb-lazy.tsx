"use client"

import dynamic from "next/dynamic"

export const AboutOrbLazy = dynamic(
  () => import("@/components/effects/about-orb").then((m) => m.AboutOrb),
  { ssr: false }
)
