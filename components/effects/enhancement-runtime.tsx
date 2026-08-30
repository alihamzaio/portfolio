"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { initScrollReveal } from "@/lib/enhancements/init-scroll-reveal"
import { initHeroKinetic } from "@/lib/enhancements/init-hero-kinetic"
import { initMagneticButtons } from "@/lib/enhancements/init-magnetic"
import { initLenis } from "@/lib/enhancements/init-lenis"
import { initSectionMotions } from "@/lib/enhancements/init-section-motions"
import { validateNavSectionIds } from "@/lib/navigation"
import {
  logScrollTriggers,
  refreshScrollNow,
  resetScrollPosition,
  scheduleScrollRefresh,
  waitForLayoutReady,
} from "@/lib/enhancements/scroll-bootstrap"

export function EnhancementRuntime() {
  const pathname = usePathname()

  useEffect(() => {
    let disposed = false
    const cleanups: Array<() => void> = []

    const onResize = () => scheduleScrollRefresh(200)
    window.addEventListener("resize", onResize)

    async function bootstrap() {
      resetScrollPosition()

      const lenisCleanup = initLenis()
      if (lenisCleanup) cleanups.push(lenisCleanup)

      await waitForLayoutReady()
      if (disposed) return

      resetScrollPosition()

      const scrollCleanup = initScrollReveal()
      if (scrollCleanup) cleanups.push(scrollCleanup)

      const sectionCleanup = initSectionMotions()
      if (sectionCleanup) cleanups.push(sectionCleanup)

      const magneticCleanup = initMagneticButtons()
      if (magneticCleanup) cleanups.push(magneticCleanup)

      if (pathname === "/") {
        validateNavSectionIds()

        const heroCleanup = initHeroKinetic()
        if (heroCleanup) cleanups.push(heroCleanup)

        requestAnimationFrame(() => {
          if (disposed) return
          refreshScrollNow()
          logScrollTriggers("bootstrap-complete")
        })
      } else {
        refreshScrollNow()
      }
    }

    bootstrap()

    return () => {
      disposed = true
      window.removeEventListener("resize", onResize)
      cleanups.forEach((fn) => fn())
    }
  }, [pathname])

  return null
}
