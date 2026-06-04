"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { getFeaturedProjects } from "@/lib/projects"
import { SectionHeading } from "@/components/ui/section-heading"
import { TiltCard } from "@/components/ui/tilt-card"
import { PremiumCard } from "@/components/ui/premium-card"

const projects = getFeaturedProjects(6)

export function HomeProjects() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section id="projects" className="section-pad">
      <div className="section-shell">
        <SectionHeading
          label="Work"
          title="Premium case studies"
          description="Production applications engineered for global clients — each built to perform and impress."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {projects.map((project, i) => (
            <TiltCard key={project.id}>
              <Link
                href={`/projects/${project.slug}`}
                onMouseEnter={() => setHovered(project.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <PremiumCard className="p-0 overflow-hidden group h-full flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className={`object-cover transition-all duration-700 ${
                        hovered === project.id ? "scale-110 brightness-110" : "scale-100"
                      }`}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
                    <motion.div
                      className="absolute top-3 right-3 p-2 rounded-full glass-panel"
                      initial={false}
                      animate={{ opacity: hovered === project.id ? 1 : 0, scale: hovered === project.id ? 1 : 0.8 }}
                    >
                      <ArrowUpRight className="h-4 w-4 text-[#60A5FA]" />
                    </motion.div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-display font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#60A5FA] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.08] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </PremiumCard>
              </Link>
            </TiltCard>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#60A5FA] hover:text-[#A78BFA] transition-colors"
          >
            View all projects <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
