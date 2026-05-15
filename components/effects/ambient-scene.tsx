"use client"

import { motion } from "framer-motion"

export function AmbientScene() {
  return (
    <motion.div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div className="absolute inset-0 bg-[#050505]" />
      <motion.div className="absolute inset-0 grid-bg opacity-40" />
      <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(0,255,178,0.12),transparent_70%)]" />
      <motion.div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#00FFB2]/10 blur-[120px]"
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full bg-[#00C896]/8 blur-[100px]"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </motion.div>
  )
}
