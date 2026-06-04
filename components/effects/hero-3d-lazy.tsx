"use client"

import dynamic from "next/dynamic"

export const Hero3DLazy = dynamic(
  () => import("@/components/effects/hero-3d-scene").then((m) => m.Hero3DScene),
  { ssr: false }
)
