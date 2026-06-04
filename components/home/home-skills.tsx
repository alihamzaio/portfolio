"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { skillCategories } from "@/lib/skills-data"

export function HomeSkills() {
  return (
    <section id="skills" className="section-pad relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.06),transparent_70%)] pointer-events-none" />
      <div className="section-shell relative">
        <SectionHeading
          label="Skills"
          title="The engineering stack"
          description="MERN, Next.js, TypeScript, AI tools, Docker, and AWS — battle-tested for production."
          align="center"
          className="mx-auto"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories.map((cat, ci) => (
            <TiltCard key={cat.id}>
              <PremiumCard className="h-full" glow={ci === 0}>
                <p className="text-xs font-mono uppercase tracking-widest text-[#A78BFA] mb-2">{cat.title}</p>
                <p className="text-sm text-muted-foreground mb-5">{cat.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, si) => (
                    <motion.span
                      key={skill.name}
                      whileHover={{ scale: 1.08, y: -2 }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg glass-panel border border-white/[0.06] hover:border-[#3B82F6]/40 transition-all"
                    >
                      {skill.icon && (
                        <Image src={skill.icon} alt="" width={14} height={14} unoptimized />
                      )}
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </PremiumCard>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}
