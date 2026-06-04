"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PremiumCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  className?: string
  glow?: boolean
  hover?: boolean
}

export function PremiumCard({ children, className, glow, hover = true, ...props }: PremiumCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -6 } : undefined}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
      className={cn(
        "glass-card rounded-2xl p-6 transition-all duration-300",
        "hover:border-[#3B82F6]/25 hover:shadow-[0_0_40px_-12px_rgba(59,130,246,0.3)]",
        glow && "glow-blue",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
