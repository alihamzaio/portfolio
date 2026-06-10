"use client"

import { memo, useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { ABOUT_STATS } from "@/lib/hero-config"

function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t)
}

function CountUp({ end, suffix }: { end: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const duration = 2000
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setVal(Math.round(easeOutQuad(t) * end))
      if (t < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [inView, end])

  return (
    <span ref={ref} className="text-2xl font-bold text-white tabular-nums">
      {val}{suffix}
    </span>
  )
}

function AboutStatsRowInner() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
      {ABOUT_STATS.map((s) => (
        <div
          key={s.label}
          className="premium-surface rounded-xl p-3 sm:p-4 text-center min-w-0"
        >
          <CountUp end={s.value} suffix={s.suffix} />
          <p className="text-[10px] text-neutral-500 mt-2 uppercase tracking-wide text-balance leading-snug">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  )
}

export const AboutStatsRow = memo(AboutStatsRowInner)
