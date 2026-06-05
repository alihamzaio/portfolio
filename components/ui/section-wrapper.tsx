"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionWrapperProps {
  id?: string
  children: ReactNode
  className?: string
  /** Subtle elevated mesh between sections */
  variant?: "default" | "elevated" | "muted"
}

export function SectionWrapper({ id, children, className, variant = "default" }: SectionWrapperProps) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      className={cn(
        "section-pad relative border-t border-white/[0.06]",
        variant === "elevated" && "section-elevated",
        variant === "muted" && "section-muted",
        className
      )}
    >
      <div className="section-divider absolute top-0 left-1/2 -translate-x-1/2 w-[min(90%,640px)] h-px" aria-hidden />
      <div className="section-shell relative z-[1]">{children}</div>
    </section>
  )
}
