"use client"

import dynamic from "next/dynamic"

export const HeroSceneLazy = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  { ssr: false, loading: () => null }
)
