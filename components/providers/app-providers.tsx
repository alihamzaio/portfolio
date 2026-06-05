"use client"

import { useState, useEffect, type ReactNode } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { LoadingOverlay } from "@/components/effects/loading-overlay"
import { AmbientScene } from "@/components/effects/ambient-scene"
import { Spotlight } from "@/components/effects/spotlight"
import { ScrollProgress } from "@/components/effects/scroll-progress"
import { EnhancementRuntime } from "@/components/effects/enhancement-runtime"
import { getIntroDelayMs } from "@/lib/motion-prefs"

export function AppProviders({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()
  const [ready, setReady] = useState(reduceMotion ?? false)

  useEffect(() => {
    if (reduceMotion) {
      setReady(true)
      return
    }
    const t = setTimeout(() => setReady(true), getIntroDelayMs())
    return () => clearTimeout(t)
  }, [reduceMotion])

  return (
    <>
      <EnhancementRuntime />
      <ScrollProgress />
      <AnimatePresence mode="wait">{!ready && !reduceMotion && <LoadingOverlay key="loader" />}</AnimatePresence>
      {!reduceMotion && <AmbientScene />}
      {!reduceMotion && <Spotlight />}
      <motion.div
        className="relative z-10"
        initial={{ opacity: reduceMotion ? 1 : 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  )
}
