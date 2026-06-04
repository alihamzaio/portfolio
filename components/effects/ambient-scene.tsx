"use client"

import { motion } from "framer-motion"

export function AmbientScene() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-[#020617]" />
      <div className="absolute inset-0 grid-fine opacity-40" />
      <motion.div
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[min(1100px,130vw)] h-[560px] rounded-full blur-[140px] mesh-shift"
        style={{ background: "rgba(59, 130, 246, 0.12)" }}
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-5%] w-[560px] h-[420px] rounded-full blur-[120px]"
        style={{ background: "rgba(6, 182, 212, 0.09)" }}
        animate={{ opacity: [0.18, 0.4, 0.18] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[38%] left-[-12%] w-[420px] h-[380px] rounded-full blur-[110px]"
        style={{ background: "rgba(139, 92, 246, 0.07)" }}
        animate={{ opacity: [0.12, 0.28, 0.12] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 65% at 50% 100%, rgba(2,6,23,0.92), transparent 58%)",
        }}
      />
    </div>
  )
}
