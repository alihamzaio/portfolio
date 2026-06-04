"use client"

import { useState, useEffect, type ReactNode } from "react"
import { motion } from "framer-motion"
import { LoadingOverlay } from "@/components/effects/loading-overlay"
import { CustomCursor } from "@/components/effects/custom-cursor"
import { AmbientScene } from "@/components/effects/ambient-scene"

export function AppProviders({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1400)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {!ready && <LoadingOverlay />}
      <AmbientScene />
      <CustomCursor />
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  )
}
