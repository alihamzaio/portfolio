"use client"

import { memo } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { RADAR_SKILLS } from "@/lib/hero-config"

const SIZE = 220
const CENTER = SIZE / 2
const RADIUS = 80

function polarToXY(angle: number, r: number) {
  const rad = (angle * Math.PI) / 180
  return {
    x: CENTER + r * Math.cos(rad - Math.PI / 2),
    y: CENTER + r * Math.sin(rad - Math.PI / 2),
  }
}

function SkillsRadarInner() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10%" })
  const n = RADAR_SKILLS.length
  const step = 360 / n

  const dataPoints = RADAR_SKILLS.map((s, i) => {
    const r = (s.value / 100) * RADIUS
    return polarToXY(i * step, r)
  })

  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ")

  return (
    <svg ref={ref} viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[min(100%,220px)] sm:max-w-[240px] mx-auto">
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon
          key={scale}
          points={RADAR_SKILLS.map((_, i) => {
            const p = polarToXY(i * step, RADIUS * scale)
            return `${p.x},${p.y}`
          }).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {RADAR_SKILLS.map((s, i) => {
        const outer = polarToXY(i * step, RADIUS)
        const label = polarToXY(i * step, RADIUS + 22)
        return (
          <g key={s.label}>
            <line x1={CENTER} y1={CENTER} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.06)" />
            <text
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-neutral-400 text-[10px] font-mono"
            >
              {s.label}
            </text>
          </g>
        )
      })}
      <motion.polygon
        points={polygon}
        fill="rgba(232, 68, 47,0.15)"
        stroke="var(--accent-primary)"
        strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
      />
    </svg>
  )
}

export const SkillsRadar = memo(SkillsRadarInner)
