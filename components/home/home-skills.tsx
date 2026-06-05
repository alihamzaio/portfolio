"use client"

import Image from "next/image"
import { SectionHeading } from "@/components/ui/section-heading"
import { SectionWrapper } from "@/components/ui/section-wrapper"
import { SkillsMarquee } from "@/components/ui/skills-marquee"
import { SkillProgressGrid } from "@/components/home/skill-progress-grid"
import { skillCategories } from "@/lib/skills-data"
import { copy } from "@/lib/copy"

export function HomeSkills() {
  return (
    <SectionWrapper id="skills" variant="muted">
      <SectionHeading
        sectionId="skills"
        label={copy.sections.skills.label}
        title={copy.sections.skills.title}
        description={copy.sections.skills.description}
      />

      <SkillsMarquee />
      <SkillProgressGrid />

      <div data-animate-stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
        {skillCategories.map((cat) => (
          <div
            key={cat.id}
            data-animate
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 hover:border-white/15 transition-colors duration-300"
          >
            <p className="text-[11px] font-semibold tracking-wider uppercase text-neutral-500 mb-2">
              {cat.title}
            </p>
            <p className="text-sm text-neutral-500 mb-6">{cat.description}</p>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-black border border-white/[0.08] text-neutral-400 hover:text-white hover:border-white/20 transition-all duration-300"
                >
                  {skill.icon && (
                    <Image src={skill.icon} alt="" width={14} height={14} unoptimized />
                  )}
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
