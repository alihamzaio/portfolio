"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 500, damping: 40 })
  const springY = useSpring(y, { stiffness: 500, damping: 40 })

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches
    if (!fine) return

    setVisible(true)
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setHovering(!!t.closest("a, button, [data-cursor]"))
    }

    window.addEventListener("mousemove", move, { passive: true })
    document.addEventListener("mouseover", onOver, { passive: true })
    return () => {
      window.removeEventListener("mousemove", move)
      document.removeEventListener("mouseover", onOver)
    }
  }, [x, y])

  if (!visible) return null

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-screen"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          animate={{
            width: hovering ? 40 : 8,
            height: hovering ? 40 : 8,
            opacity: hovering ? 0.15 : 0.35,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="rounded-full bg-[#3B82F6] blur-[1px]"
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      >
        <div className="w-32 h-32 rounded-full bg-[#3B82F6]/[0.04] blur-2xl" />
      </motion.div>
    </>
  )
}
