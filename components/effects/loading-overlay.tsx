"use client"

import { motion } from "framer-motion"
import { siteConfig } from "@/lib/site"

export function LoadingOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#030712]"
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-8"
      >
        <div className="relative">
          <motion.div
            className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center font-display font-bold text-white text-lg glow-blue"
            animate={{ boxShadow: ["0 0 20px rgba(59,130,246,0.3)", "0 0 50px rgba(139,92,246,0.5)", "0 0 20px rgba(59,130,246,0.3)"] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {siteConfig.initials}
          </motion.div>
        </div>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent overflow-hidden rounded-full">
          <motion.div
            className="h-full w-1/2 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <p className="text-xs font-mono text-muted-foreground tracking-[0.3em] uppercase">Loading</p>
      </motion.div>
    </motion.div>
  )
}
