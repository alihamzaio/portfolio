"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { initPremiumCursor } from "@/lib/enhancements/init-cursor"
import { initSmoothScrollLerp } from "@/lib/enhancements/init-smooth-scroll"
import { initScrollReveal } from "@/lib/enhancements/init-scroll-reveal"
import { initNavbarScroll } from "@/lib/enhancements/init-navbar"

export function EnhancementRuntime() {
  const pathname = usePathname()

  useEffect(() => {
    const cleanups = [
      initPremiumCursor(),
      initSmoothScrollLerp(),
      initScrollReveal(),
      initNavbarScroll(),
    ]

    const t = window.setTimeout(() => initScrollReveal(), 100)

    return () => {
      window.clearTimeout(t)
      cleanups.forEach((fn) => fn?.())
    }
  }, [pathname])

  return null
}
