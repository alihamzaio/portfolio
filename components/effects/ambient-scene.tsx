"use client"

import { motion } from "framer-motion"

export function AmbientScene() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-[#0a0f1a]" />
      <div className="absolute inset-0 dot-grid-body opacity-30" />
      <motion.div
        className="absolute top-[-18%] left-1/2 -translate-x-1/2 w-[min(1100px,130vw)] h-[520px] rounded-full blur-[140px] mesh-shift"
        style={{ background: "rgba(59, 130, 246, 0.12)" }}
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-8%] right-[-4%] w-[520px] h-[400px] rounded-full blur-[120px]"
        style={{ background: "rgba(6, 182, 212, 0.08)" }}
        animate={{ opacity: [0.15, 0.32, 0.15] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[42%] left-[-10%] w-[380px] h-[340px] rounded-full blur-[110px]"
        style={{ background: "rgba(125, 211, 252, 0.06)" }}
        animate={{ opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 65% at 50% 100%, rgba(10,15,26,0.94), transparent 58%)",
        }}
      />
    </div>
  )
}
