"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { useSiteContent } from "@/components/providers/site-content-provider"
import { fadeUp, staggerContainer } from "@/lib/motion"
import { copy } from "@/lib/copy"

export function HomeExperience() {
  const { experiences } = useSiteContent()

  return (
    <section id="experience" className="section-pad border-t border-white/[0.06]">
      <div className="section-shell max-w-3xl">
        <SectionHeading
          label={copy.sections.experience.label}
          title={copy.sections.experience.title}
          description={copy.sections.experience.description}
          align="center"
          className="mx-auto"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative space-y-8"
        >
          <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-[#3B82F6]/40 via-white/[0.08] to-transparent" aria-hidden />

          {experiences.map((exp) => (
            <motion.article key={exp.id} variants={fadeUp} className="relative pl-12">
              <div className="absolute left-0 top-6 h-2.5 w-2.5 rounded-full bg-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.5)] ring-4 ring-[#020617]" />
              <PremiumCard spotlight>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-bold text-[#F8FAFC]">{exp.role}</h3>
                    <p className="text-sm text-[#06B6D4] font-medium mt-0.5">{exp.company}</p>
                  </div>
                  <p className="text-xs text-[#64748B] font-mono sm:text-right">
                    {exp.period}
                    <span className="hidden sm:inline"> · </span>
                    <br className="sm:hidden" />
                    {exp.location}
                  </p>
                </div>
                <p className="text-sm text-[#94A3B8] mb-4 leading-relaxed">{exp.description}</p>
                <ul className="space-y-2.5 mb-5">
                  {exp.achievements.map((a) => (
                    <li key={a} className="text-sm text-[#94A3B8] flex gap-2.5">
                      <span className="text-[#3B82F6] shrink-0 mt-0.5">▸</span>
                      {a}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-white/[0.04] text-[#64748B] border border-white/[0.06]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </PremiumCard>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
