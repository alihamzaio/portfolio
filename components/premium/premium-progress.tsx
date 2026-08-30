"use client"

import { memo } from "react"
import { cn } from "@/lib/utils"

interface PremiumProgressProps {
  label: string
  value: number
  delay?: number
  className?: string
}

function PremiumProgressInner({ label, value, className }: PremiumProgressProps) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 border-b border-[var(--border-subtle)] py-3.5 last:border-0", className)}>
      <span className="text-sm text-[var(--text-primary)]">{label}</span>
      <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">{value}%</span>
    </div>
  )
}

export const PremiumProgress = memo(PremiumProgressInner)

interface PremiumProgressListProps {
  items: { name: string; level: number }[]
  className?: string
  columns?: 1 | 2
}

function PremiumProgressListInner({ items, className }: PremiumProgressListProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {items.map((item) => (
        <PremiumProgress key={item.name} label={item.name} value={item.level} />
      ))}
    </div>
  )
}

export const PremiumProgressList = memo(PremiumProgressListInner)
