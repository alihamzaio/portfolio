"use client"

import { motion } from "framer-motion"
import { Briefcase, TrendingUp } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { SectionWrapper } from "@/components/ui/section-wrapper"
import { PremiumCard } from "@/components/ui/premium-card"
import { useSiteContent } from "@/components/providers/site-content-provider"
import { fadeUp, staggerContainer } from "@/lib/motion"
import { copy } from "@/lib/copy"

export function HomeExperience() {
  const { experiences } = useSiteContent()

  return (
    <SectionWrapper id="experience" variant="muted" className="[&_.section-shell]:max-w-4xl">
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
        viewport={{ once: true, margin: "-8%" }}
        className="relative"
      >
        <div
          className="absolute left-[19px] top-8 bottom-8 w-px bg-gradient-to-b from-[#3B82F6] via-[#06B6D4]/50 to-transparent"
          aria-hidden
        />

        <div className="space-y-10">
          {experiences.map((exp, i) => (
            <motion.article
              key={exp.id}
              variants={fadeUp}
              className="relative pl-14"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 400, damping: 28 }}
                className="absolute left-0 top-7 flex h-10 w-10 items-center justify-center rounded-xl border border-[#3B82F6]/30 bg-[#0F172A] shadow-[0_0_24px_rgba(59,130,246,0.2)]"
              >
                <Briefcase className="h-4 w-4 text-[#3B82F6]" />
              </motion.div>

              <PremiumCard spotlight className="!p-6 sm:!p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8B5CF6] mb-2">
                      Role {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="text-xl font-bold text-[#F8FAFC] tracking-tight">{exp.role}</h3>
                    <p className="text-sm text-[#06B6D4] font-medium mt-1">{exp.company}</p>
                  </div>
                  <p className="text-xs text-[#64748B] font-mono sm:text-right shrink-0">
                    {exp.period}
                    <span className="block sm:inline sm:ml-2">{exp.location}</span>
                  </p>
                </div>

                <p className="text-sm text-[#94A3B8] mb-5 leading-relaxed">{exp.description}</p>

                <ul className="space-y-3 mb-6">
                  {exp.achievements.map((a) => (
                    <li key={a} className="text-sm text-[#94A3B8] flex gap-3 leading-relaxed">
                      <TrendingUp className="h-4 w-4 text-[#3B82F6] shrink-0 mt-0.5" />
                      {a}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
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
        </div>
      </motion.div>
    </SectionWrapper>
  )
}
