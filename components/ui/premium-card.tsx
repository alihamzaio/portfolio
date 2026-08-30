"use client"

import { useRef, type ReactNode, type MouseEvent, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { prefersFinePointer } from "@/lib/motion-prefs"

interface PremiumCardProps extends HTMLAttributes<HTMLDivElement> {
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
    if (!spotlight || !ref.current || !prefersFinePointer()) return
    const rect = ref.current.getBoundingClientRect()
    ref.current.style.setProperty("--sx", `${e.clientX - rect.left}px`)
    ref.current.style.setProperty("--sy", `${e.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        spotlight ? "glass-card-interactive" : "glass-card",
        "rounded-2xl p-6 transition-[border-color,box-shadow] duration-500 relative overflow-hidden",
        hover && !spotlight && "premium-card-hover",
        spotlight &&
          "before:absolute before:inset-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none before:bg-[radial-gradient(480px_circle_at_var(--sx,50%)_var(--sy,50%),rgba(232, 68, 47,0.08),transparent_42%)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
