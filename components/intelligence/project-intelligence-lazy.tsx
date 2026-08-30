"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const ProjectIntelligence = dynamic(
  () => import("@/components/intelligence/project-intelligence").then((m) => m.ProjectIntelligence),
  { ssr: false, loading: () => <div className="section-pad" aria-hidden /> }
)

export function ProjectIntelligenceLazy() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) {
    return <div className="section-pad" aria-hidden />
  }

  return <ProjectIntelligence />
}
