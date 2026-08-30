"use client"

import { memo, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PremiumGridProps {
  children: ReactNode
  className?: string
  cols?: "2" | "3" | "4" | "auto"
  stagger?: boolean
}

const colClass = {
  "2": "sm:grid-cols-2",
  "3": "sm:grid-cols-2 lg:grid-cols-3",
  "4": "sm:grid-cols-2 lg:grid-cols-4",
  auto: "sm:grid-cols-2 lg:grid-cols-3",
} as const

function PremiumGridInner({ children, className, cols = "auto", stagger = true }: PremiumGridProps) {
  return (
    <div
      className={cn("grid gap-6 sm:gap-8 lg:gap-10", colClass[cols], className)}
      {...(stagger ? { "data-animate-stagger": true } : {})}
    >
      {children}
    </div>
  )
}

export const PremiumGrid = memo(PremiumGridInner)
