"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 500, damping: 42 })
  const springY = useSpring(y, { stiffness: 500, damping: 42 })

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
      setHovering(!!t.closest("a, button, [data-cursor], input, textarea"))
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
            width: hovering ? 44 : 10,
            height: hovering ? 44 : 10,
            opacity: hovering ? 0.2 : 0.4,
          }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="rounded-full border border-[#3B82F6]/50 bg-[#3B82F6]/30"
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      >
        <div
          className="w-36 h-36 rounded-full blur-3xl transition-opacity duration-300"
          style={{
            background: hovering
              ? "radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)"
              : "radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)",
          }}
        />
      </motion.div>
    </>
  )
}
