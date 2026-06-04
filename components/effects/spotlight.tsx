"use client"

import { useEffect, useRef } from "react"

export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const move = (e: MouseEvent) => {
      el.style.setProperty("--x", `${e.clientX}px`)
      el.style.setProperty("--y", `${e.clientY}px`)
    }
    window.addEventListener("mousemove", move, { passive: true })
    return () => window.removeEventListener("mousemove", move)
  }, [])

  return <div ref={ref} className="pointer-events-none fixed inset-0 z-[1] spotlight opacity-80" aria-hidden />
}
