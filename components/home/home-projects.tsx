"use client"

import { ArrowUpRight } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { SectionWrapper } from "@/components/ui/section-wrapper"
import { ProjectsBento } from "@/components/home/projects-bento"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { copy } from "@/lib/copy"

export function HomeProjects() {
  return (
    <SectionWrapper id="projects" variant="elevated">
      <SectionHeading
        sectionId="projects"
        label={copy.sections.projects.label}
        title={copy.sections.projects.title}
        description={copy.sections.projects.description}
      />

      <ProjectsBento />

      <div data-animate className="mt-14 flex justify-center">
        <MagneticButton href="/projects" variant="secondary">
          Full project archive <ArrowUpRight className="h-4 w-4" />
        </MagneticButton>
      </div>
    </SectionWrapper>
  )
}
