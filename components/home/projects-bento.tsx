"use client"

import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { featuredProjects } from "@/lib/featured-projects"

export function ProjectsBento() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-5%" })
  const projects = featuredProjects.slice(0, 4)

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project, i) => {
        const isFeatured = i === 0
        return (
          <motion.article
            key={project.id}
            data-cursor="project"
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0f1a] min-h-[240px] sm:min-h-[280px] transition-colors duration-300 hover:border-cyan-500/25 ${
              isFeatured ? "md:col-span-2 lg:col-span-2 min-h-[280px] sm:min-h-[360px]" : ""
            }`}
          >
            {(project.demo || project.github) && (
              <a
                href={project.demo || project.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="external"
                data-cursor-label={project.demo ? "Open Demo" : "Open Source"}
                data-cursor-arrow="true"
                className="absolute inset-0 z-[2]"
                aria-label={project.demo ? `Open ${project.title} live site` : `Open ${project.title} source`}
              />
            )}
            <div className={`relative overflow-hidden ${isFeatured ? "h-48 sm:h-56 md:h-64" : "h-40 sm:h-44"}`}>
              <Image
                src={project.image}
                alt={project.title}
                title={project.title}
                fill
                sizes={
                  isFeatured
                    ? "(max-width: 768px) 100vw, 66vw"
                    : "(max-width: 768px) 100vw, 33vw"
                }
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/50 to-transparent" />
            </div>
            <div className="relative p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 line-clamp-2 break-words">
                {project.title}
              </h3>
              <p className="text-sm text-neutral-400 line-clamp-2 mb-3">{project.overview}</p>
              <ul className="text-xs text-neutral-500 space-y-1 mb-4 list-disc pl-4">
                {project.architecture.slice(0, 3).map((point) => (
                  <li key={point} className="line-clamp-2">
                    {point}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.metrics.slice(0, 2).map((m) => (
                  <span key={m.label} className="premium-chip text-xs px-2 py-1 break-words">
                    {m.value} {m.label}
                  </span>
                ))}
              </div>
              {(project.demo || project.github) && (
                <span className="relative z-[1] pointer-events-none inline-flex items-center gap-1 text-xs font-medium text-cyan-400">
                  {project.demo ? "Open live site" : "View source"} <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          </motion.article>
        )
      })}
    </div>
  )
}
