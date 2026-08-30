"use client"

import { memo } from "react"
import { ABOUT_STATS } from "@/lib/hero-config"

function AboutStatsRowInner() {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-10">
      {ABOUT_STATS.map((s) => (
        <div key={s.label} className="min-w-0">
          <p className="font-display text-3xl sm:text-[2.15rem] font-semibold tracking-tight text-[var(--text-primary)] tabular-nums">
            {s.value}
            {s.suffix}
          </p>
          <p className="mt-2.5 text-[12px] text-neutral-500 leading-snug tracking-[0.02em]">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

export const AboutStatsRow = memo(AboutStatsRowInner)
