"use client"

import { motion } from "framer-motion"
import { siteConfig } from "@/lib/site"

export function LoadingOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050505]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-8"
      >
        <div className="relative">
          <motion.div
            className="h-14 w-14 rounded-2xl border border-[#00FFB2]/30 flex items-center justify-center font-display font-bold text-[#00FFB2] text-lg glow-emerald-sm"
            animate={{ boxShadow: ["0 0 20px rgba(0,255,178,0.2)", "0 0 40px rgba(0,255,178,0.5)", "0 0 20px rgba(0,255,178,0.2)"] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {siteConfig.initials}
          </motion.div>
          <motion.div
            className="absolute -inset-3 rounded-3xl border border-[#00FFB2]/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#00FFB2] to-transparent overflow-hidden rounded-full">
          <motion.div
            className="h-full w-1/2 bg-[#00FFB2]"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <p className="text-xs font-mono text-muted-foreground tracking-[0.3em] uppercase">Initializing</p>
      </motion.div>
    </motion.div>
  )
}
