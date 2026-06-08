"use client"

import { memo, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface PremiumProgressProps {
  label: string
  value: number
  delay?: number
  className?: string
}

function PremiumProgressInner({ label, value, delay = 0, className }: PremiumProgressProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-8%" })

  return (
    <div ref={ref} className={cn("premium-surface rounded-2xl p-5", className)}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-neutral-200">{label}</span>
        <span className="text-xs font-mono text-cyan-400/80">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1, delay: 0.15 + delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}

export const PremiumProgress = memo(PremiumProgressInner)

interface PremiumProgressListProps {
  items: { name: string; level: number }[]
  className?: string
  columns?: 1 | 2
}

function PremiumProgressListInner({ items, className, columns = 2 }: PremiumProgressListProps) {
  return (
    <div className={cn(columns === 2 ? "grid sm:grid-cols-2 gap-5" : "space-y-5", className)}>
      {items.map((item, i) => (
        <PremiumProgress key={item.name} label={item.name} value={item.level} delay={i * 0.08} />
      ))}
    </div>
  )
}

export const PremiumProgressList = memo(PremiumProgressListInner)
