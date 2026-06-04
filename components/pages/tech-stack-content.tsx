"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { skillCategories } from "@/lib/skills-data"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"

export function TechStackContent() {
  return (
    <div className="pt-28 section-pad">
      <div className="section-shell">
        <SectionHeading
          label="Tech Stack"
          title="The engineering arsenal"
          description="A curated, battle-tested stack for shipping premium products — from interface to infrastructure."
          align="center"
          className="mx-auto"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat, ci) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.06 }}
            >
              <PremiumCard className="h-full">
                <p className="text-xs font-mono tracking-widest uppercase text-[#00FFB2] mb-2">{cat.title}</p>
                <p className="text-sm text-muted-foreground mb-6">{cat.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, si) => (
                    <motion.span
                      key={skill.name}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-white/[0.06] bg-[#0F0F10] hover:border-[#00FFB2]/30 hover:shadow-[0_0_20px_-4px_rgba(0,255,178,0.3)] transition-all cursor-default"
                    >
                      {skill.icon && (
                        <Image src={skill.icon} alt="" width={16} height={16} unoptimized />
                      )}
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </PremiumCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
