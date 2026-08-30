"use client"

import { memo, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PremiumPanelProps {
  children: ReactNode
  className?: string
  centered?: boolean
}

function PremiumPanelInner({ children, className, centered }: PremiumPanelProps) {
  return (
    <div
      data-animate
      className={cn(
        "relative overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded-xl p-8 sm:p-12 md:p-16",
        centered && "text-center",
        className
      )}
    >
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}

export const PremiumPanel = memo(PremiumPanelInner)
