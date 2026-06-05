"use client"

import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { prefersFinePointer } from "@/lib/motion-prefs"

interface TiltShineCardProps {
  children: ReactNode
  className?: string
}

export function TiltShineCard({ children, className }: TiltShineCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    setDisabled(!prefersFinePointer() || !!reduceMotion)
  }, [reduceMotion])

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateY = ((x - cx) / cx) * 8
    const rotateX = ((cy - y) / cy) * 8
    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    if (shineRef.current) {
      shineRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,217,255,0.18), transparent 55%)`
      shineRef.current.style.opacity = "1"
    }
  }

  const onLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)"
    if (shineRef.current) shineRef.current.style.opacity = "0"
  }

  return (
    <div
      ref={ref}
      data-tilt-card
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("relative transition-transform duration-300 ease-out", className)}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={shineRef}
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300"
        aria-hidden
      />
      {children}
    </div>
  )
}
