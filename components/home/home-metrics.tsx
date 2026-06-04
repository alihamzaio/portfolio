"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { engineeringMetrics } from "@/lib/site"

export function HomeMetrics() {
  return (
    <section id="metrics" className="section-pad relative">
      <div className="section-shell">
        <SectionHeading
          label="Impact"
          title="Engineering metrics"
          description="Measurable outcomes from production systems — APIs shipped, blocks indexed, defects reduced, and automation at scale."
          align="center"
          className="mx-auto"
        />

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {engineeringMetrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <PremiumCard className="text-center py-8 sm:py-10 h-full flex flex-col items-center justify-center group">
                <motion.span
                  className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-gradient tabular-nums"
                  whileInView={{ scale: [0.9, 1.02, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  {metric.value}
                </motion.span>
                <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-snug px-2 group-hover:text-[#94A3B8] transition-colors">
                  {metric.label}
                </p>
              </PremiumCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
