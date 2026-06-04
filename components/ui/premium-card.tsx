"use client"

import { useRef, type ReactNode, type MouseEvent } from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { ease } from "@/lib/motion"

interface PremiumCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  className?: string
  hover?: boolean
  spotlight?: boolean
}

export function PremiumCard({
  children,
  className,
  hover = true,
  spotlight = false,
  ...props
}: PremiumCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!spotlight || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    ref.current.style.setProperty("--sx", `${e.clientX - rect.left}px`)
    ref.current.style.setProperty("--sy", `${e.clientY - rect.top}px`)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.45, ease }}
      className={cn(
        spotlight ? "glass-card-interactive" : "glass-card",
        "rounded-2xl p-6 transition-all duration-500 relative overflow-hidden",
        hover && !spotlight && "hover:border-white/[0.12]",
        spotlight &&
          "before:absolute before:inset-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none before:bg-[radial-gradient(480px_circle_at_var(--sx,50%)_var(--sy,50%),rgba(59,130,246,0.14),transparent_42%)]",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
