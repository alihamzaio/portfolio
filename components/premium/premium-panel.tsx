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
        "relative rounded-3xl overflow-hidden border border-cyan-500/20 bg-[#0a0f1a]/70 backdrop-blur-2xl p-8 sm:p-12 md:p-16",
        centered && "text-center",
        className
      )}
    >
      <div className="absolute inset-0 mesh-hero opacity-50 pointer-events-none" aria-hidden />
      <div className="absolute inset-0 shimmer-border opacity-20 pointer-events-none" aria-hidden />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 50% 120%, rgba(59,130,246,0.16), transparent 65%), radial-gradient(ellipse 40% 50% at 0% 0%, rgba(6,182,212,0.08), transparent 50%)",
        }}
        aria-hidden
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}

export const PremiumPanel = memo(PremiumPanelInner)
