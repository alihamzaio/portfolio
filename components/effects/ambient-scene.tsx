"use client"

import { motion } from "framer-motion"

export function AmbientScene() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a0f1e] to-[#030712]" />
      <motion.div className="absolute inset-0 grid-bg opacity-50" />
      <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)]" />
      <motion.div
        className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/10 blur-[120px]"
        animate={{ opacity: [0.3, 0.5, 0.3], x: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-40 w-[450px] h-[450px] rounded-full bg-[#A855F7]/10 blur-[100px]"
        animate={{ opacity: [0.2, 0.4, 0.2], x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}
