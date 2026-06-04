"use client"

import { motion } from "framer-motion"
import { LogoMark } from "@/components/brand/logo"

export function LoadingOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#020617]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-8"
      >
        <LogoMark size={56} animated />
        <div className="w-40 h-[3px] rounded-full overflow-hidden bg-[#0F172A] border border-white/[0.06]">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #3B82F6, #06B6D4, #8B5CF6)" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p className="text-[10px] font-mono text-[#64748B] tracking-[0.32em] uppercase">
          Initializing experience
        </p>
      </motion.div>
    </motion.div>
  )
}
