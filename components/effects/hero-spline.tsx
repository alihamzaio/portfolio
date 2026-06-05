"use client"

import { useEffect, useState } from "react"
import Spline from "@splinetool/react-spline"
import { motion } from "framer-motion"
import { SPLINE_HERO_SCENE } from "@/lib/hero-config"

export function HeroSpline() {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!loaded) setFailed(true)
    }, 14000)
    return () => window.clearTimeout(t)
  }, [loaded])

  if (failed) {
    return (
      <div
        className="w-full h-[min(520px,70vh)] rounded-3xl border border-[#00d4ff]/15 bg-gradient-to-br from-[#1a1a3e]/80 to-[#0a0a1a]/90 relative overflow-hidden"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,212,255,0.2),transparent_60%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/5 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="relative w-full h-[min(520px,70vh)] rounded-3xl overflow-hidden border border-white/[0.06]"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {!loaded && (
        <div className="absolute inset-0 z-10 bg-[#0a0a1a]/60 animate-pulse" aria-hidden />
      )}
      <Spline scene={SPLINE_HERO_SCENE} onLoad={() => setLoaded(true)} className="!w-full !h-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-transparent via-transparent to-[#0a0a1a]/40" />
    </motion.div>
  )
}
