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
    <article className="pt-28 pb-20">
      <div className="section-shell">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#00FFB2] mb-10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> All projects
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-12 aspect-[21/9] min-h-[240px] border border-white/[0.06]"
        >
          <Image src={project.image} alt={project.title} fill className="object-cover" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <p className="text-xs font-mono tracking-widest uppercase text-[#00FFB2] mb-3">Case Study</p>
            <h1 className="font-display text-3xl md:text-5xl font-semibold text-white max-w-4xl">{project.title}</h1>
          </div>
        </motion.div>

        <motion.div className="grid lg:grid-cols-3 gap-8 mb-12">
          {metrics.map((m) => (
            <PremiumCard key={m.label} className="text-center">
              <p className="text-2xl font-display font-semibold text-[#00FFB2]">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{m.label}</p>
            </PremiumCard>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-xl font-semibold text-white mb-4">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{project.details}</p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-white mb-4">Architecture</h2>
              <ul className="space-y-2">
                {architecture.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-[#00FFB2] mt-1.5 h-1 w-1 rounded-full bg-[#00FFB2] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <PremiumCard>
              <p className="text-xs font-mono uppercase tracking-widest text-[#00FFB2] mb-4">Tech stack</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full border border-white/[0.08] text-muted-foreground"
                  >
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
                <MagneticButton href={project.github} variant="outline">
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
