"use client"

import { motion } from "framer-motion"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { copy } from "@/lib/copy"
import { ease } from "@/lib/motion"

export function CtaBand() {
  return (
    <section className="section-pad pb-8">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="relative rounded-3xl overflow-hidden glass-card p-10 md:p-14 text-center border-[#3B82F6]/20"
        >
          <div className="absolute inset-0 shimmer-border opacity-30 pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(59,130,246,0.12), transparent 70%)",
            }}
          />
          <div className="relative max-w-2xl mx-auto">
            <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#06B6D4] mb-4">
              {copy.sections.cta.label}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-4 tracking-tight">
              {copy.sections.cta.title}
            </h2>
            <p className="text-[#94A3B8] text-base leading-relaxed mb-8">{copy.sections.cta.description}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <MagneticButton href="/#contact">{copy.sections.cta.button}</MagneticButton>
              <MagneticButton href="/api/resume/download" variant="secondary">
                Get my resume
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
