"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowUpRight, ExternalLink, Github } from "lucide-react"
import type { Project } from "@/lib/types"
import { projectToGallery } from "@/lib/gallery-projects"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { liveSiteCta } from "@/lib/live-site"

interface ProjectDetailProps {
  project: Project & { slug: string }
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const study = projectToGallery(project)
  const demoCta = study.demo ? liveSiteCta(study.demo) : null

  return (
    <article className="relative page-top-pad section-pad">
      <div className="pointer-events-none absolute inset-0 section-glow" aria-hidden />
      <div className="site-grid relative z-[1]">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] mb-[var(--space-5)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All projects
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden mb-[var(--space-6)] aspect-[16/10] lg:aspect-[21/9] min-h-[220px] border border-[var(--border-subtle)] rounded-xl"
        >
          <Image
            src={project.image}
            alt={`${project.title} — project screenshot`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-void)] via-[var(--bg-void)]/45 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-[var(--space-4)] sm:p-[var(--space-6)]">
            <p className="type-label mb-[var(--space-2)]">Case study</p>
            <h1 className="type-display-md max-w-4xl text-[var(--text-primary)]">{project.title}</h1>
          </div>
        </motion.div>

        <div className="grid gap-[var(--space-4)] sm:grid-cols-3 mb-[var(--space-6)]">
          {study.metrics.map((m) => (
            <PremiumCard key={m.label} className="text-center !p-[var(--space-4)]">
              <p className="type-display-sm !text-[var(--accent-primary)]">{m.value}</p>
              <p className="type-label mt-[var(--space-1)] !text-[var(--text-muted)]">{m.label}</p>
            </PremiumCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-[var(--space-6)] lg:gap-[var(--space-7)]">
          <div className="lg:col-span-8 space-y-[var(--space-6)]">
            <section>
              <h2 className="section-title !text-[var(--text-display-sm)] mb-[var(--space-3)]">Overview</h2>
              <p className="type-body-sm leading-relaxed text-[var(--text-secondary)]">{study.overview}</p>
            </section>

            <section>
              <h2 className="section-title !text-[var(--text-display-sm)] mb-[var(--space-3)]">Problem</h2>
              <p className="type-body-sm leading-relaxed text-[var(--text-secondary)]">{study.problem}</p>
            </section>

            <section>
              <h2 className="section-title !text-[var(--text-display-sm)] mb-[var(--space-3)]">Solution</h2>
              <p className="type-body-sm leading-relaxed text-[var(--text-secondary)]">{study.solution}</p>
            </section>

            <section>
              <h2 className="section-title !text-[var(--text-display-sm)] mb-[var(--space-3)]">Architecture & delivery</h2>
              <ul className="space-y-[var(--space-3)]">
                {study.architecture.map((item) => (
                  <li key={item} className="flex gap-[var(--space-2)] type-body-sm text-[var(--text-secondary)]">
                    <span className="mt-[0.65rem] h-px w-3 shrink-0 bg-[var(--accent-primary)]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-[var(--space-4)]">
            <PremiumCard className="!p-[var(--space-4)]">
              <p className="type-label mb-[var(--space-3)]">Tech stack</p>
              <div className="flex flex-wrap gap-[var(--space-2)]">
                {study.techStack.map((tag) => (
                  <span
                    key={tag}
                    className="type-caption border border-[var(--border-subtle)] px-[var(--space-2)] py-[var(--space-1)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </PremiumCard>

            <div className="flex flex-col gap-[var(--space-2)]">
              {study.demo && demoCta && (
                <MagneticButton
                  href={study.demo}
                  variant="primary"
                  className="btn-responsive"
                  cursorMode="external"
                  cursorLabel={demoCta.cursorLabel}
                >
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                  {demoCta.label}
                </MagneticButton>
              )}
              {study.github && (
                <MagneticButton
                  href={study.github}
                  variant="secondary"
                  className="btn-responsive"
                  cursorMode="external"
                  cursorLabel="GitHub"
                >
                  <Github className="h-4 w-4 shrink-0" aria-hidden />
                  Source code
                </MagneticButton>
              )}
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 min-h-11 px-5 text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              >
                Discuss a similar project
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}
