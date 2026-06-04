"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 400, damping: 35 })
  const springY = useSpring(y, { stiffness: 400, damping: 35 })

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
    }

    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [x, y])

  if (!visible) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[9998] hidden lg:block"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      >
        <div className="h-64 w-64 rounded-full bg-[#3B82F6]/10 blur-3xl" />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed z-[9999] hidden lg:block"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#60A5FA] to-[#A78BFA]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </>
  )
}
