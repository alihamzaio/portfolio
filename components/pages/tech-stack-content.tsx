"use client"

import { PremiumGrid, PremiumPage, PremiumReveal } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { SkillIcon } from "@/components/ui/skill-icon"
import { skillCategories } from "@/lib/skills-data"

export function TechStackContent() {
  return (
    <PremiumPage>
      <SectionHeading
        headingLevel={1}
        label="Tech Stack"
        title="Technical stack"
        description="Languages, frameworks, and infrastructure used to build and maintain production web applications."
        align="center"
        className="mx-auto"
      />

      <PremiumGrid cols="3">
        {skillCategories.map((cat, ci) => (
          <PremiumReveal key={cat.id} delay={ci * 0.06}>
            <PremiumCard className="h-full" spotlight>
              <p className="meta-label mb-2">{cat.title}</p>
              <p className="text-sm text-neutral-500 mb-6">{cat.description}</p>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span key={skill.name} className="premium-chip inline-flex items-center gap-2 px-3 py-2 text-sm">
                    <SkillIcon skill={skill} />
                    {skill.name}
                  </span>
                ))}
              </div>
            </PremiumCard>
          </PremiumReveal>
        ))}
      </PremiumGrid>
    </PremiumPage>
  )
}
