"use client"

import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "@/lib/motion-prefs"

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const bar = barRef.current
    if (!bar) return

    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0
      bar.style.transform = `scaleX(${progress})`
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (prefersReducedMotion()) return null

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left pointer-events-none will-change-transform"
      style={{
        transform: "scaleX(0)",
        background: "#00D9FF",
        boxShadow: "0 0 12px rgba(0, 217, 255, 0.5)",
      }}
      aria-hidden
    />
  )
}
