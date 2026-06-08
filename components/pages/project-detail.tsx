"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ExternalLink, Github } from "lucide-react"
import type { Project } from "@/lib/types"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { PremiumCard } from "@/components/ui/premium-card"

const defaultMetrics = [
  { label: "Stack", value: "MERN" },
  { label: "Delivery", value: "Production" },
  { label: "Scale", value: "Global" },
]

const defaultArchitecture = [
  "React / Next.js frontend",
  "Node.js REST API layer",
  "MongoDB or PostgreSQL data store",
  "Docker + CI/CD deployment",
]

interface ProjectDetailProps {
  project: Project & { slug: string }
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const metrics = project.metrics ?? defaultMetrics
  const architecture = project.architecture ?? defaultArchitecture

  return (
    <article className="relative pt-28 pb-20 section-pad">
      <div className="section-glow absolute inset-0 pointer-events-none" aria-hidden />
      <div className="section-shell relative z-[1]">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-cyan-400 mb-10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> All projects
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-12 aspect-[21/9] min-h-[240px] border border-white/[0.06]"
        >
          <Image
            src={project.image}
            alt={`${project.title} — project screenshot by Ali Hamza`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <p className="accent-label mb-3">Case Study</p>
            <h1 className="font-display text-3xl md:text-5xl font-semibold text-white max-w-4xl">{project.title}</h1>
          </div>
        </motion.div>

        <motion.div className="grid lg:grid-cols-3 gap-8 mb-12">
          {metrics.map((m) => (
            <PremiumCard key={m.label} className="text-center">
              <p className="text-2xl font-semibold text-cyan-400">{m.value}</p>
              <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">{m.label}</p>
            </PremiumCard>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-xl font-semibold text-white mb-4">Overview</h2>
              <p className="text-neutral-400 leading-relaxed">{project.details}</p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-white mb-4">Architecture</h2>
              <ul className="space-y-2">
                {architecture.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-neutral-400">
                    <span className="text-cyan-400 mt-1.5 h-1 w-1 rounded-full bg-cyan-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <PremiumCard>
              <p className="accent-label mb-4">Tech stack</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="premium-chip text-xs px-2.5 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </PremiumCard>
            <div className="flex flex-col gap-3">
              <MagneticButton href={project.link}>
                <ExternalLink className="h-4 w-4" /> Live demo
              </MagneticButton>
              {project.github !== "#" && (
                <MagneticButton href={project.github} variant="secondary">
                  <Github className="h-4 w-4" /> Source code
                </MagneticButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
