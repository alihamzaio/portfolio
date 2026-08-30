"use client"

import { ArrowRight } from "lucide-react"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { copy } from "@/lib/copy"

export function CtaBand() {
  return (
    <section aria-label="Call to action" className="relative py-[var(--space-7)] border-y border-[var(--border-subtle)] bg-[var(--bg-primary)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 section-glow" aria-hidden />
      <div className="site-grid relative z-[1] flex flex-col lg:flex-row lg:items-end lg:justify-between gap-[var(--space-5)]">
        <div data-animate>
          <p className="section-label">{copy.sections.cta.label}</p>
          <h2 className="type-display-md mt-[var(--space-2)] max-w-2xl" data-reveal-title>
            {copy.sections.cta.title}
          </h2>
          <p className="type-body-sm mt-[var(--space-3)] max-w-lg text-[var(--text-secondary)]">{copy.sections.cta.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-[var(--space-2)] shrink-0" data-animate>
          <MagneticButton href="/#contact" variant="primary" className="btn-responsive">
            {copy.sections.cta.button} <ArrowRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton href="/api/resume/download" variant="secondary" className="btn-responsive">
            Download resume
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
