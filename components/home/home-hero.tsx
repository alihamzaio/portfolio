"use client"

import dynamic from "next/dynamic"
import { Download } from "lucide-react"
import { siteConfig } from "@/lib/site"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { HeroRoleLine } from "@/components/home/hero-role-line"
import { HeroVisualStage } from "@/components/home/hero-visual-stage"
import { copy } from "@/lib/copy"

const HeroSignalField = dynamic(
  () => import("@/components/effects/hero-signal-field").then((m) => m.HeroSignalField),
  { ssr: false }
)

export function HomeHero() {
  return (
    <section
      id="home"
      aria-label="Introduction"
      data-hero-kinetic
      className="relative flex min-h-[100dvh] flex-col overflow-hidden hero-surface"
    >
      <HeroSignalField />

      <p
        className="hero-watermark pointer-events-none absolute top-[calc(var(--site-header-height)+var(--space-3))] right-[var(--grid-gutter)] z-[1] select-none"
        aria-hidden
      >
        {new Date().getFullYear()}
      </p>

      <div className="site-grid relative z-10 w-full pt-[calc(var(--site-header-height)+var(--space-4))]" data-hero-content>
        <div
          className="grid gap-y-[var(--space-6)] lg:grid-cols-12 lg:gap-x-[var(--space-6)] lg:items-center"
          data-hero-grid
        >
          <div className="lg:col-span-7 min-w-0 flex flex-col justify-center">
            {siteConfig.available && (
              <p
                className="mb-[var(--space-4)] inline-flex w-fit items-center gap-[var(--space-2)] type-label text-[var(--accent-primary)]"
                data-hero-badge
              >
                <span className="hero-avail-dot" aria-hidden />
                {copy.hero.availability}
              </p>
            )}

            <p className="type-label mb-[var(--space-3)]" data-hero-greeting>
              {copy.hero.greeting}
            </p>

            <p className="section-label mb-[var(--space-3)]" data-hero-title>
              {siteConfig.title}
            </p>

            <h1 className="hero-name-stack mb-[var(--space-4)]">
              <span className="type-display-xl block hero-name-line" data-split="name-first">
                Ali
              </span>
              <span
                className="type-display-xl block hero-name-line hero-name-line--second hero-name-accent"
                data-split="name-second"
              >
                Hamza
              </span>
              <span className="sr-only">, Full Stack Developer in Lahore</span>
            </h1>

            <p className="type-heading mb-[var(--space-4)] max-w-xl text-[var(--text-secondary)]" data-hero-role>
              <HeroRoleLine />
            </p>

            <p className="type-lead max-w-xl mb-[var(--space-5)] text-[var(--text-secondary)]" data-hero-lead>
              {copy.hero.lead}
            </p>

            <div className="hero-actions lg:max-w-md" data-hero-cta>
              <MagneticButton
                href="/#contact"
                variant="primary"
                className="btn-responsive sm:w-auto"
                cursorMode="contact"
              >
                {copy.hero.ctaPrimary}
              </MagneticButton>
              <MagneticButton href="/#projects" variant="secondary" className="btn-responsive">
                {copy.hero.ctaViewWork}
              </MagneticButton>
              <MagneticButton href={siteConfig.resumeUrl} variant="ghost" className="btn-responsive">
                <Download className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {copy.hero.ctaResume}
              </MagneticButton>
            </div>
          </div>

          <div className="lg:col-span-5 min-w-0 self-center">
            <HeroVisualStage />
          </div>
        </div>

        <div className="hero-scroll-row" data-hero-scroll>
          <div className="hero-scroll-cue" aria-hidden>
            <span className="type-label">Scroll</span>
            <span className="hero-scroll-track">
              <span className="hero-scroll-dot" />
            </span>
          </div>
        </div>
      </div>

      {/* Fills remaining viewport below scroll — keeps cue tight to content on all screen heights */}
      <div className="hero-viewport-fill" aria-hidden />
    </section>
  )
}
