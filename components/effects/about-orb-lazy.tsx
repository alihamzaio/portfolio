"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { prefersReducedMotion } from "@/lib/motion-prefs"

const AboutOrb = dynamic(
  () => import("@/components/effects/about-orb").then((m) => m.AboutOrb),
  { ssr: false, loading: () => null }
)

/** Loads AboutOrb only when the section enters the viewport — avoids ~300KB Three.js on initial load. */
export function AboutOrbLazy() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const host = hostRef.current
    if (!host) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        setReady(true)
      },
      { rootMargin: "240px 0px" }
    )

    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={hostRef} className="pointer-events-none absolute inset-0" aria-hidden>
      {ready ? <AboutOrb /> : null}
    </div>
  )
}
