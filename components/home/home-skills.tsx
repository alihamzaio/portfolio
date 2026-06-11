"use client"

import Image from "next/image"
import { PremiumGrid, PremiumSection } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { SkillsMarquee } from "@/components/ui/skills-marquee"
import { SkillProgressGrid } from "@/components/home/skill-progress-grid"
import { skillCategories } from "@/lib/skills-data"
import { copy } from "@/lib/copy"

export function HomeSkills() {
  return (
    <PremiumSection id="skills" variant="elevated">
      <SectionHeading
        sectionId="skills"
        label={copy.sections.skills.label}
        title={copy.sections.skills.title}
        description={copy.sections.skills.description}
      />

      <SkillsMarquee />
      <SkillProgressGrid />

      <PremiumGrid cols="3" className="mt-12">
        {skillCategories.map((cat) => (
          <div key={cat.id} data-animate className="premium-surface rounded-2xl p-4 sm:p-6">
            <p className="meta-label mb-2">{cat.title}</p>
            <p className="text-sm text-neutral-500 mb-6">{cat.description}</p>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span key={skill.name} className="premium-chip inline-flex items-center gap-1.5 px-3 py-1.5 text-xs">
                  {skill.icon && (
                    <Image src={skill.icon} alt={`${skill.name} icon`} width={14} height={14} unoptimized />
                  )}
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </PremiumGrid>
    </PremiumSection>
  )
}
