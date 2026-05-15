"use client"

import { motion } from "framer-motion"
import { MagneticButton } from "@/components/ui/magnetic-button"

export function CtaBand() {
  return (
    <section className="section-pad">
      <motion.div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden glass-card p-10 md:p-16 text-center border-[#00FFB2]/15 glow-emerald"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,178,0.08),transparent_70%)]" />
          <div className="relative">
            <p className="text-xs font-mono tracking-[0.25em] uppercase text-[#00FFB2] mb-4">Let&apos;s build</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4 max-w-2xl mx-auto">
              Ready to ship something world-class?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              I partner with ambitious teams to design, build, and deploy premium web products on MERN + AWS.
            </p>
            <MagneticButton href="/contact">Start a conversation</MagneticButton>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
