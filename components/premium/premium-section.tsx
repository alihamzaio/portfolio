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
        "section-pad relative overflow-hidden",
        variant === "elevated" && "section-elevated",
        variant === "muted" && "section-muted",
        className
      )}
    >
      <div className="section-glow absolute inset-0 pointer-events-none" aria-hidden />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(85%,36rem)] h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/25 to-transparent"
        aria-hidden
      />
      <div className="section-shell relative z-[1]">{children}</div>
    </section>
  )
}
