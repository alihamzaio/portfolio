"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { skillCategories } from "@/lib/skills-data"
import { copy } from "@/lib/copy"
import { fadeUp, staggerContainer } from "@/lib/motion"

export function HomeSkills() {
  return (
    <section id="skills" className="section-pad border-t border-white/[0.06]">
      <div className="section-shell">
        <SectionHeading
          label={copy.sections.skills.label}
          title={copy.sections.skills.title}
          description={copy.sections.skills.description}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {skillCategories.map((cat) => (
            <motion.div key={cat.id} variants={fadeUp}>
              <PremiumCard className="h-full" spotlight>
                <p className="text-[11px] font-semibold tracking-wider uppercase text-[#3B82F6] mb-2">
                  {cat.title}
                </p>
                <p className="text-sm text-[#64748B] mb-6">{cat.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <motion.span
                      key={skill.name}
                      whileHover={{ y: -2 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[#0F172A] border border-white/[0.08] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#3B82F6]/30 transition-all duration-300"
                    >
                      {skill.icon && (
                        <Image src={skill.icon} alt="" width={14} height={14} unoptimized />
                      )}
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </PremiumCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
