"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { initPremiumCursor } from "@/lib/enhancements/init-cursor"
import { initSmoothScrollLerp } from "@/lib/enhancements/init-smooth-scroll"
import { initScrollReveal } from "@/lib/enhancements/init-scroll-reveal"
import { initNavbarScroll } from "@/lib/enhancements/init-navbar"

function scheduleScrollReveal(onReady: () => void | (() => void)) {
  let cleanup: void | (() => void)
  let cancelled = false
  let frame = 0
  let idleId = 0
  let timer = 0

  const run = () => {
    if (cancelled) return
    cleanup = onReady()
  }

  const start = () => {
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (cancelled) return
        if (typeof window.requestIdleCallback === "function") {
          idleId = window.requestIdleCallback(run, { timeout: 800 })
        } else {
          timer = window.setTimeout(run, 200)
        }
      })
    })
  }

  if (document.readyState === "complete") {
    start()
  } else {
    window.addEventListener("load", start, { once: true })
  }

  return () => {
    cancelled = true
    window.removeEventListener("load", start)
    cancelAnimationFrame(frame)
    if (idleId) window.cancelIdleCallback(idleId)
    if (timer) window.clearTimeout(timer)
    cleanup?.()
  }
}

export function EnhancementRuntime() {
  const pathname = usePathname()

  useEffect(() => {
    const cleanups = [initPremiumCursor(), initSmoothScrollLerp(), initNavbarScroll()]
    const scrollCleanup = scheduleScrollReveal(() => initScrollReveal())

    return () => {
      cleanups.forEach((fn) => fn?.())
      scrollCleanup()
    }
  }, [pathname])

  return null
}
