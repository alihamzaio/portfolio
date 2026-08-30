"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PremiumGrid, PremiumPage, PremiumReveal } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import type { Project } from "@/lib/types"

type ProjectWithSlug = Project & { slug: string }

export function ProjectsGrid({ projects }: { projects: ProjectWithSlug[] }) {

  return (
    <PremiumPage>
      <SectionHeading
        headingLevel={1}
        label="Projects"
        title="Projects"
        description="Web applications, APIs, and blockchain systems built for clients in e-commerce, fintech, and Web3."
      />

      <PremiumGrid cols="3" className="gap-6 lg:gap-8">
        {projects.map((project, i) => (
          <PremiumReveal key={project.id} delay={(i % 6) * 0.05}>
            <Link
              href={`/projects/${project.slug}`}
              data-cursor="project"
              className="block h-full"
            >
              <article className="group h-full flex flex-col overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-void)] to-transparent opacity-70" />
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <h2 className="font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                    {project.title}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4 leading-relaxed flex-1">
                    {project.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--accent-primary)]">
                    Read case study <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </article>
            </Link>
          </PremiumReveal>
        ))}
      </PremiumGrid>
    </PremiumPage>
  )
}
