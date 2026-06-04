"use client"

import { motion } from "framer-motion"
import { LogoMark } from "@/components/brand/logo"

export function LoadingOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#030712]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-8"
      >
        <LogoMark size={56} animated />
        <div className="w-36 h-1 rounded-full overflow-hidden bg-[#0f172a]">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #3B82F6, #22D3EE)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p className="text-[11px] font-mono text-[#64748B] tracking-widest uppercase">Loading</p>
      </motion.div>
    </motion.div>
  )
}
