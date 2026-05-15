"use client"

import type { ReactNode } from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = true, ...props }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
      className={cn(
        "relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_8px_32px_rgba(0,0,0,0.4)]",
        hover && "hover:border-white/[0.12] hover:bg-white/[0.05] transition-colors duration-300",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
