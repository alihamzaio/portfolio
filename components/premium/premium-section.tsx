"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PremiumSectionProps {
  id?: string
  children: ReactNode
  className?: string
  variant?: "default" | "elevated" | "muted"
}

export function PremiumSection({ id, children, className, variant = "default" }: PremiumSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      className={cn(
        "section-pad relative border-t border-white/[0.05] overflow-hidden",
        variant === "elevated" && "section-elevated",
        variant === "muted" && "section-muted",
        className
      )}
    >
      <div className="section-glow absolute inset-0 pointer-events-none" aria-hidden />
      <div
        className="section-divider absolute top-0 left-1/2 -translate-x-1/2 w-[min(90%,640px)] h-px"
        aria-hidden
      />
      <div className="section-shell relative z-[1]">{children}</div>
    </section>
  )
}
