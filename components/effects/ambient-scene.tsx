"use client"

import { motion } from "framer-motion"

export function AmbientScene() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 grid-fine opacity-[0.55]" />
      <motion.div
        className="absolute top-[-18%] left-1/2 -translate-x-1/2 w-[min(1000px,120vw)] h-[520px] rounded-full blur-[130px] mesh-shift"
        style={{ background: "rgba(79, 143, 247, 0.11)" }}
        animate={{ opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-8%] right-[-8%] w-[520px] h-[400px] rounded-full blur-[110px]"
        style={{ background: "rgba(34, 211, 238, 0.08)" }}
        animate={{ opacity: [0.2, 0.42, 0.2] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[40%] left-[-15%] w-[400px] h-[350px] rounded-full blur-[100px]"
        style={{ background: "rgba(59, 130, 246, 0.06)" }}
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 70% at 50% 100%, rgba(10,15,26,0.95), transparent 60%)",
        }}
      />
    </div>
  )
}
