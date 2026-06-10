"use client"

import { ArrowUpRight } from "lucide-react"
import { PremiumSection } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { ProjectsBento } from "@/components/home/projects-bento"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { copy } from "@/lib/copy"

export function HomeProjects() {
  return (
    <PremiumSection id="projects" variant="elevated">
      <SectionHeading
        sectionId="projects"
        label={copy.sections.projects.label}
        title={copy.sections.projects.title}
        description={copy.sections.projects.description}
      />

      <ProjectsBento />

      <div data-animate className="mt-10 sm:mt-14 flex justify-center px-0">
        <MagneticButton href="/projects" variant="secondary" className="btn-responsive max-w-md sm:max-w-none">
          View all projects <ArrowUpRight className="h-4 w-4 shrink-0" />
        </MagneticButton>
      </div>
    </PremiumSection>
  )
}
