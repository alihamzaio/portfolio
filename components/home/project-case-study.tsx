"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, ExternalLink, Github, Layers } from "lucide-react"
import type { FeaturedProject } from "@/lib/featured-projects"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { cn } from "@/lib/utils"
import { easeCinematic } from "@/lib/motion"

interface ProjectCaseStudyProps {
  project: FeaturedProject
  index: number
  reversed?: boolean
}

export function ProjectCaseStudy({ project, index, reversed }: ProjectCaseStudyProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.85, delay: index * 0.08, ease: easeCinematic }}
      className={cn(
        "grid lg:grid-cols-2 gap-10 lg:gap-14 items-center",
        reversed && "lg:[&>*:first-child]:order-2"
      )}
    >
      <div className="relative group">
        <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.12),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0F172A] aspect-[16/10] project-card-glow">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#020617]/80 border border-white/[0.08] text-[#06B6D4] backdrop-blur-md">
              Case study
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#8B5CF6] mb-3">
          0{index + 1} — Product launch
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight mb-4 leading-tight">
          {project.title}
        </h3>
        <p className="text-[#94A3B8] leading-relaxed mb-6">{project.overview}</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {project.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-3 text-center"
            >
              <p className="text-lg font-bold text-[#F8FAFC] tabular-nums">{m.value}</p>
              <p className="text-[9px] text-[#64748B] mt-1 uppercase tracking-wide leading-tight">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B] mb-3 flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-[#3B82F6]" /> Architecture
          </p>
          <ul className="space-y-2">
            {project.architecture.slice(0, 3).map((line) => (
              <li key={line} className="text-sm text-[#94A3B8] flex gap-2">
                <span className="text-[#3B82F6] shrink-0">▸</span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-8">
          {project.techStack.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-white/[0.04] text-[#64748B] border border-white/[0.06]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-auto">
          {project.demo && (
            <MagneticButton href={project.demo} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" /> Live product
            </MagneticButton>
          )}
          {project.github && project.github !== "#" && (
            <MagneticButton href={project.github} variant="secondary" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" /> Source
            </MagneticButton>
          )}
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#3B82F6] transition-colors px-2"
            data-cursor
          >
            Full archive <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
