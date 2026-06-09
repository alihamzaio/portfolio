"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PremiumGrid, PremiumPage, PremiumReveal } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { projects } from "@/lib/projects"

export function ProjectsGrid() {
  return (
    <PremiumPage>
      <SectionHeading
        headingLevel={1}
        label="Projects"
        title="Projects"
        description="Web applications, APIs, and blockchain systems built for clients in e-commerce, healthcare, fintech, and Web3."
      />

      <PremiumGrid cols="3">
        {projects.slice(0, 12).map((project, i) => (
          <PremiumReveal key={project.id} delay={(i % 6) * 0.05}>
            <Link href={`/projects/${project.slug}`} data-cursor="project">
              <PremiumCard className="p-0 overflow-hidden group h-full flex flex-col" spotlight>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] to-transparent opacity-80" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-neutral-400 line-clamp-2 mb-4">{project.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-cyan-400">
                    View project <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </PremiumCard>
            </Link>
          </PremiumReveal>
        ))}
      </PremiumGrid>
    </PremiumPage>
  )
}
