"use client"

import { motion } from "framer-motion"

export function LoadingOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
    >
      <motion.span
        className="font-syne text-6xl sm:text-7xl font-bold text-[#00D9FF] tracking-tight"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.2, 1.15], opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        AH
      </motion.span>
    </motion.div>
  )
}
