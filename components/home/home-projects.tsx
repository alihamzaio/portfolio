"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ExternalLink, Github } from "lucide-react"
import { projects as staticProjects } from "@/lib/projects"
import { featuredProjects } from "@/lib/featured-projects"
import type { Project } from "@/lib/types"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { cn } from "@/lib/utils"
import { ease } from "@/lib/motion"
import { copy } from "@/lib/copy"

type DisplayProject = Project & { slug?: string }

export function HomeProjects() {
  const [items, setItems] = useState<DisplayProject[]>([])
  const [filter, setFilter] = useState("All")
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setItems(data)
        else setItems(staticProjects as DisplayProject[])
      })
      .catch(() => setItems(staticProjects as DisplayProject[]))
  }, [])

  const featured = useMemo(() => {
    const flagged = items.filter((p) => p.featured)
    if (flagged.length >= 2) return flagged.slice(0, 4)
    return null
  }, [items])

  const displayList = useMemo(() => {
    if (filter === "Featured" && featured?.length) return featured
    if (filter === "Featured") {
      return featuredProjects.map((fp, i) => ({
        id: 9000 + i,
        title: fp.title,
        description: fp.overview,
        tags: fp.techStack,
        image: fp.image,
        link: fp.demo || "#",
        github: fp.github || "#",
        details: fp.overview,
      })) as DisplayProject[]
    }
    const pool =
      filter === "All"
        ? items.slice(0, 9)
        : items.filter((p) => p.tags?.some((t) => t.toLowerCase().includes(filter.toLowerCase())))
    return pool.slice(0, 6)
  }, [items, filter, featured])

  const filters = useMemo(() => {
    const tags = new Set<string>()
    items.forEach((p) => p.tags?.forEach((t) => tags.add(t)))
    return ["All", "Featured", ...Array.from(tags).slice(0, 6)]
  }, [items])

  return (
    <section id="projects" className="section-pad border-t border-white/[0.06]">
      <div className="section-shell">
        <SectionHeading
          label={copy.sections.projects.label}
          title={copy.sections.projects.title}
          description={copy.sections.projects.description}
        />

        <div className="flex flex-wrap gap-2 mb-12">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300",
                filter === f
                  ? "bg-[#3B82F6] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  : "bg-white/[0.03] text-[#94A3B8] border border-white/[0.08] hover:text-[#F8FAFC] hover:border-white/[0.14]"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div layout className="grid sm:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {displayList.map((project) => (
              <motion.div
                key={`${filter}-${project.id}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease }}
                onMouseEnter={() => setHovered(project.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <PremiumCard
                  hover={false}
                  spotlight
                  className="p-0 overflow-hidden h-full flex flex-col group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0F172A]">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className={cn(
                          "object-cover transition-transform duration-700 ease-out",
                          hovered === project.id && "scale-105"
                        )}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[#64748B] text-sm">
                        No preview
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none",
                        hovered === project.id && "opacity-100"
                      )}
                      style={{
                        background:
                          "radial-gradient(600px circle at 50% 100%, rgba(59,130,246,0.15), transparent 55%)",
                      }}
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-lg font-bold text-[#F8FAFC] group-hover:text-white transition-colors">
                        {project.title}
                      </h3>
                      {project.slug && (
                        <Link
                          href={`/projects/${project.slug}`}
                          className="p-2 rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all"
                          data-cursor
                        >
                          <ArrowUpRight className="h-4 w-4 text-[#3B82F6]" />
                        </Link>
                      )}
                    </div>
                    <p className="text-sm text-[#94A3B8] line-clamp-2 flex-1 mb-5 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {(project.tags || []).slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-white/[0.04] text-[#64748B] border border-white/[0.06]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-auto pt-4 border-t border-white/[0.06]">
                      {project.link && project.link !== "#" && (
                        <MagneticButton
                          href={project.link}
                          variant="ghost"
                          className="!px-3 !py-1.5 !text-xs"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Live demo
                        </MagneticButton>
                      )}
                      {project.github && project.github !== "#" && (
                        <MagneticButton
                          href={project.github}
                          variant="ghost"
                          className="!px-3 !py-1.5 !text-xs"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-3.5 w-3.5" /> Source
                        </MagneticButton>
                      )}
                    </div>
                  </div>
                </PremiumCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-14 text-center">
          <MagneticButton href="/projects" variant="secondary">
            View all projects <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
