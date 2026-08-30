"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"

function parseMetricValue(raw: string): { end: number; suffix: string } {
  const cleaned = raw.replace(/,/g, "")
  const match = cleaned.match(/^([\d.]+)(.*)$/)
  if (!match) return { end: 0, suffix: raw }
  return { end: parseFloat(match[1]), suffix: match[2] || "" }
}

function formatMetric(end: number, suffix: string) {
  if (suffix === "%") return `${Math.round(end)}%`
  if (suffix.includes("+")) return `${Math.round(end).toLocaleString()}${suffix}`
  return `${Math.round(end).toLocaleString()}${suffix}`
}

export function HeroStatCounter({ value, label }: { value: string; label: string }) {
  const reduceMotion = useReducedMotion()
  const { suffix } = parseMetricValue(value)
  const [display, setDisplay] = useState(() => (reduceMotion ? value : formatMetric(0, suffix)))

  useEffect(() => {
    if (reduceMotion) setDisplay(value)
  }, [reduceMotion, value])

  return (
    <li
      data-hero-stat
      data-stat-target={value}
      className="hero-visual-metric border border-[var(--border-subtle)]/90 bg-[var(--bg-void)]/55 px-3 py-2.5 transition-colors hover:border-[var(--accent-primary)]/30"
    >
      <p className="font-mono text-[0.95rem] font-semibold text-[var(--accent-primary)] tabular-nums leading-none" data-stat-value>
        {display}
      </p>
      <p className="mt-1.5 type-label !text-[0.5625rem] !leading-snug !text-[var(--text-muted)]">{label}</p>
    </li>
  )
}
