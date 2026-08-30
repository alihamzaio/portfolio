"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { featuredProjects } from "@/lib/featured-projects"

export function ProjectsBento() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-5%" })
  const projects = featuredProjects.slice(0, 4)

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
      {projects.map((project, i) => {
        const isFeatured = i === 0
        const href = project.caseStudyHref ?? "/projects"
        return (
          <motion.article
            key={project.id}
            data-cursor="project"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className={`group relative overflow-hidden rounded-2xl surface-lux ${
              isFeatured ? "md:col-span-2" : ""
            }`}
          >
            <Link
              href={href}
              data-cursor="project"
              className="absolute inset-0 z-[2]"
              aria-label={`Read ${project.title} case study`}
            />
            <div className={`relative overflow-hidden ${isFeatured ? "h-60 sm:h-72 md:h-[22rem]" : "h-48 sm:h-56"}`}>
              <Image
                src={project.image}
                alt={project.title}
                title={project.title}
                fill
                sizes={
                  isFeatured
                    ? "(max-width: 768px) 100vw, 100vw"
                    : "(max-width: 768px) 100vw, 50vw"
                }
                className="object-cover transition-transform duration-[850ms] ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-void)] via-[var(--bg-void)]/45 to-transparent" />
            </div>
            <div className="relative p-7 sm:p-9">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3 line-clamp-2 break-words transition-colors duration-300 group-hover:text-[var(--accent-primary)]">
                {project.title}
              </h2>
              <p className="text-sm text-neutral-500 line-clamp-2 mb-5 leading-[1.75]">{project.overview}</p>
              <ul className="text-sm text-neutral-500 space-y-2.5 mb-5">
                {project.architecture.slice(0, 3).map((point) => (
                  <li key={point} className="flex gap-3 leading-relaxed">
                    <span className="mt-2.5 h-px w-3 shrink-0 bg-[var(--accent-primary)]/55" />
                    <span className="line-clamp-2">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mb-5">
                {project.metrics.slice(0, 2).map((m) => (
                  <span
                    key={m.label}
                    className="rounded-md border border-[var(--border-subtle)]/80 px-2.5 py-1 text-xs text-neutral-500"
                  >
                    {m.value} {m.label}
                  </span>
                ))}
              </div>
              <span className="relative z-[1] pointer-events-none inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-primary)]/85">
                Read case study <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </motion.article>
        )
      })}
    </div>
  )
}
