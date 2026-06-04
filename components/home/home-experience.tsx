"use client"

import { motion } from "framer-motion"
import { Briefcase } from "lucide-react"
import { experiences } from "@/lib/experience"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"

export function HomeExperience() {
  return (
    <section id="experience" className="section-pad">
      <div className="section-shell max-w-3xl mx-auto">
        <SectionHeading
          label="Experience"
          title="Track record"
          description="Shipping production systems across fintech, e-commerce, healthcare, and Web3."
          align="center"
          className="mx-auto"
        />

        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-[#3B82F6] via-[#8B5CF6]/50 to-transparent" />

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-14"
              >
                <div className="absolute left-0 top-6 h-10 w-10 rounded-xl border border-[#3B82F6]/30 bg-[#3B82F6]/10 flex items-center justify-center glow-blue">
                  <Briefcase className="h-4 w-4 text-[#60A5FA]" />
                </div>
                <PremiumCard>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-display font-semibold text-white">{exp.role}</h3>
                      <p className="text-[#60A5FA] text-sm font-medium">{exp.company}</p>
                    </div>
                    <p className="text-xs text-muted-foreground sm:text-right">
                      {exp.period} · {exp.location}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-1 rounded-full border border-[#8B5CF6]/25 text-[#C4B5FD]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
