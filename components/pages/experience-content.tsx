"use client"

import { motion } from "framer-motion"
import { Briefcase } from "lucide-react"
import { experiences } from "@/lib/experience"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"

export function ExperienceContent() {
  return (
    <div className="pt-28 section-pad">
      <div className="section-shell max-w-3xl">
        <SectionHeading
          label="Experience"
          title="Building at elite velocity"
          description="A track record of shipping production systems for global clients across fintech, e-commerce, healthcare, and Web3."
        />

        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-[#00FFB2]/50 via-[#00FFB2]/10 to-transparent" />

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-14"
              >
                <motion.div className="absolute left-0 top-6 h-10 w-10 rounded-xl border border-[#00FFB2]/30 bg-[#00FFB2]/10 flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-[#00FFB2]" />
                </motion.div>

                <PremiumCard>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-display font-semibold text-white text-lg">{exp.role}</h3>
                      <p className="text-[#00FFB2] font-medium">{exp.company}</p>
                    </div>
                    <div className="text-sm text-muted-foreground sm:text-right">
                      <p>{exp.period}</p>
                      <p>{exp.location}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{exp.description}</p>
                  <ul className="space-y-2 mb-5">
                    {exp.achievements.map((a) => (
                      <li key={a} className="flex gap-2 text-sm text-white/80">
                        <span className="text-[#00FFB2] shrink-0">→</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-1 rounded-full border border-[#00FFB2]/20 text-[#7CFFCB]"
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
    </div>
  )
}
