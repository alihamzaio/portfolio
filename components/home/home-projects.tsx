"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { featuredProjects } from "@/lib/featured-projects"
import { SectionHeading } from "@/components/ui/section-heading"
import { SectionWrapper } from "@/components/ui/section-wrapper"
import { ProjectCaseStudy } from "@/components/home/project-case-study"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { copy } from "@/lib/copy"

export function HomeProjects() {
  const showcase = featuredProjects.slice(0, 3)

  return (
    <SectionWrapper id="projects" variant="elevated">
      <SectionHeading
        label={copy.sections.projects.label}
        title={copy.sections.projects.title}
        description={copy.sections.projects.description}
      />

      <div className="space-y-24 md:space-y-32">
        {showcase.map((project, i) => (
          <ProjectCaseStudy key={project.id} project={project} index={i} reversed={i % 2 === 1} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <MagneticButton href="/projects" variant="secondary">
          View full project archive <ArrowUpRight className="h-4 w-4" />
        </MagneticButton>
      </motion.div>
    </SectionWrapper>
  )
}
