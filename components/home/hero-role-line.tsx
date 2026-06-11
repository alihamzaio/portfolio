"use client"

import { useEffect, useState } from "react"
import { HERO_ROLE_LINES } from "@/lib/hero-config"
import { prefersReducedMotion } from "@/lib/motion-prefs"

/** Lightweight role rotator — no react-type-animation bundle */
export function HeroRoleLine() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const interval = window.setInterval(() => {
      setVisible(false)
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % HERO_ROLE_LINES.length)
        setVisible(true)
      }, 280)
    }, 3200)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <span
      className={`text-neutral-300 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      aria-live="polite"
    >
      {HERO_ROLE_LINES[index]}
    </span>
  )
}
