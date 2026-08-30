"use client"

import { copy } from "@/lib/copy"

/** Editorial bridge after the hero — keeps support/detail copy without crowding the first viewport. */
export function HomeHeroStatement() {
  return (
    <section
      aria-label="Introduction detail"
      className="hero-statement relative border-y border-[var(--border-subtle)] bg-[var(--bg-primary)]"
    >
      <div className="pointer-events-none absolute inset-0 section-glow" aria-hidden />
      <div className="site-grid relative z-[1] py-[var(--space-7)]">
        <div className="grid gap-[var(--space-5)] lg:grid-cols-12 lg:gap-[var(--space-6)]" data-animate>
          <p className="lg:col-span-7 type-lead max-w-2xl text-[var(--text-primary)]">
            {copy.hero.support}
          </p>
          <p className="lg:col-span-5 type-body max-w-md lg:ml-auto text-[var(--text-secondary)] lg:pt-[var(--space-1)]">
            {copy.hero.detail}
          </p>
        </div>
      </div>
    </section>
  )
}
