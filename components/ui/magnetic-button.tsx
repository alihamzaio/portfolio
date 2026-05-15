"use client"

import { useRef, type ReactNode, type MouseEvent } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
  variant?: "primary" | "ghost" | "outline"
}

export function MagneticButton({ children, className, onClick, href, variant = "primary" }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)

  const handleMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`
  }

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)"
  }

  const base = cn(
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300",
    variant === "primary" &&
      "bg-[#00FFB2] text-[#050505] hover:shadow-[0_0_32px_rgba(0,255,178,0.45)] hover:bg-[#7CFFCB]",
    variant === "outline" &&
      "border border-white/[0.1] bg-transparent text-foreground hover:border-[#00FFB2]/40 hover:bg-[#00FFB2]/5",
    variant === "ghost" && "text-muted-foreground hover:text-[#00FFB2]",
    className
  )

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileTap={{ scale: 0.98 }}
        className={base}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.98 }}
      className={base}
    >
      {children}
    </motion.button>
  )
}
