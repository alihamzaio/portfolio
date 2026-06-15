"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

function parseMetricValue(raw: string): { end: number; suffix: string } {
  const cleaned = raw.replace(/,/g, "")
  const match = cleaned.match(/^([\d.]+)(.*)$/)
  if (!match) return { end: 0, suffix: raw }
  return { end: parseFloat(match[1]), suffix: match[2] || "" }
}

function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t)
}

export function StatsCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState("0")
  const ran = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const { end, suffix } = parseMetricValue(value)

    if (reduceMotion) {
      setDisplay(value)
      return
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || ran.current) return
        ran.current = true
        const start = performance.now()
        const duration = 2000

        const frame = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          const current = easeOutQuad(t) * end
          const formatted =
            suffix === "%"
              ? `${Math.round(current)}%`
              : suffix.includes("+")
                ? `${Math.round(current).toLocaleString()}${suffix}`
                : `${Math.round(current).toLocaleString()}${suffix}`
          setDisplay(formatted)
          if (t < 1) requestAnimationFrame(frame)
        }
        requestAnimationFrame(frame)
        obs.disconnect()
      },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value, reduceMotion])

  return (
    <div ref={ref} data-animate className="h-full min-w-0">
      <div className="glass-card rounded-xl px-3 py-4 sm:px-4 sm:py-5 h-full min-h-[92px] flex flex-col items-center justify-center text-center hover:border-[#00D9FF]/30 transition-colors duration-500">
        <p className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tabular-nums leading-none">{display}</p>
        <p className="text-[9px] sm:text-[10px] text-[#64748B] mt-2.5 leading-tight uppercase tracking-wide">
          {label}
        </p>
      </div>
    </div>
  )
}
