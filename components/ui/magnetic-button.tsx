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
  type?: "button" | "submit"
}

export function MagneticButton({
  children,
  className,
  onClick,
  href,
  variant = "primary",
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)

  const handleMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`
  }

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)"
  }

  const base = cn(
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300",
    variant === "primary" &&
      "bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]",
    variant === "outline" &&
      "border border-white/10 bg-white/5 text-white hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/10",
    variant === "ghost" && "text-muted-foreground hover:text-[#60A5FA]",
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
      type={type}
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
