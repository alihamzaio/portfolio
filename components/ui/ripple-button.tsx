"use client"

import { useRef, type ReactNode, type MouseEvent } from "react"
import { cn } from "@/lib/utils"

interface RippleButtonProps {
  children: ReactNode
  className?: string
  type?: "button" | "submit"
  disabled?: boolean
  onClick?: () => void
}

export function RippleButton({ children, className, type = "button", disabled, onClick }: RippleButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const btn = ref.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const ripple = document.createElement("span")
    const size = Math.max(rect.width, rect.height)
    ripple.className = "ripple-circle"
    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`
    btn.appendChild(ripple)
    ripple.addEventListener("animationend", () => ripple.remove())
    onClick?.()
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={cn("btn-primary relative overflow-hidden", className)}
      data-cursor
    >
      <span className="relative z-[1] inline-flex items-center justify-center gap-2">{children}</span>
    </button>
  )
}
