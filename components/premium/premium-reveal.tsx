"use client"

import { memo, type ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

type Direction = "up" | "left" | "right" | "none"

interface PremiumRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: Direction
  once?: boolean
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  left: { x: -24, y: 0 },
  right: { x: 24, y: 0 },
  none: { x: 0, y: 0 },
}

function PremiumRevealInner({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
}: PremiumRevealProps) {
  const reduceMotion = useReducedMotion()
  const offset = offsets[direction]

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-8%" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export const PremiumReveal = memo(PremiumRevealInner)
