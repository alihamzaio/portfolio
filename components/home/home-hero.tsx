"use client"

import { ChevronDown, Download } from "lucide-react"
import { siteConfig } from "@/lib/site"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { PremiumGlassCta } from "@/components/ui/amber-glass-cta"
import { HeroParticleField } from "@/components/effects/hero-particle-field"
import { HeroDevSceneLazy } from "@/components/effects/hero-dev-scene-lazy"
import { TechStackTicker } from "@/components/home/tech-stack-ticker"
import { SkillActivityGrid } from "@/components/home/skill-activity-grid"
import { HeroRoleLine } from "@/components/home/hero-role-line"
import { copy } from "@/lib/copy"

export function HomeHero() {
  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative min-h-[100dvh] flex flex-col bg-[#0a0f1a] hero-pad"
    >
      <HeroParticleField />

      <div className="section-shell relative z-10 flex flex-1 flex-col min-w-0 w-full max-w-full">
        <div className="pt-4 sm:pt-8 md:pt-12 lg:pt-16 min-w-0 w-full">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_auto] gap-8 sm:gap-12 lg:gap-20 xl:gap-24 items-center min-w-0 w-full">
            <div className="min-w-0 w-full max-w-3xl">
              {siteConfig.available && (
                <p className="text-sm text-neutral-400 mb-6 sm:mb-8 text-balance break-words w-full">
                  {copy.hero.availability}
                </p>
              )}

              <h1 className="hero-premium-title font-bold tracking-tight mb-6 w-full min-w-0 max-w-full break-words text-balance">
                {copy.hero.h1}
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl min-h-[3rem] sm:min-h-[2.5rem] font-medium mb-6 sm:mb-8 w-full min-w-0 break-words">
                <HeroRoleLine />
              </p>

              <p className="text-base sm:text-lg text-neutral-400 leading-relaxed w-full max-w-2xl mb-4 sm:mb-5 break-words [overflow-wrap:anywhere]">
                {copy.hero.lead}
              </p>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed w-full max-w-2xl mb-4 sm:mb-5 break-words [overflow-wrap:anywhere]">
                {copy.hero.support}
              </p>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed w-full max-w-2xl mb-8 sm:mb-12 break-words [overflow-wrap:anywhere]">
                {copy.hero.detail}
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full min-w-0 max-w-full sm:max-w-none">
                <PremiumGlassCta href="/#contact" className="btn-responsive">
                  {copy.hero.ctaPrimary}
                </PremiumGlassCta>
                <MagneticButton href="/#projects" variant="secondary" className="btn-responsive">
                  {copy.hero.ctaViewWork}
                </MagneticButton>
                <MagneticButton href={siteConfig.resumeUrl} variant="secondary" className="btn-responsive">
                  <Download className="h-4 w-4 shrink-0" aria-hidden />
                  {copy.hero.ctaResume}
                </MagneticButton>
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-center">
              <HeroDevSceneLazy />
            </div>
          </div>
        </div>

        <div className="section-stack pt-6 sm:pt-10 md:pt-14 lg:pt-16 min-w-0 w-full max-w-full overflow-hidden">
          <TechStackTicker />
          <SkillActivityGrid />
        </div>
      </div>

      <div className="relative z-10 flex justify-center pb-8 pt-6" aria-hidden>
        <ChevronDown className="h-6 w-6 text-cyan-400/60 motion-safe:hero-chevron-bounce" />
      </div>
    </section>
  )
}
