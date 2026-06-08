"use client"

import { motion, useReducedMotion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import { ChevronDown, Download } from "lucide-react"
import { usePublicProfile } from "@/components/providers/site-content-provider"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { PremiumGlassCta } from "@/components/ui/amber-glass-cta"
import { HeroDevSceneLazy } from "@/components/effects/hero-dev-scene-lazy"
import { HeroParticleLazy } from "@/components/effects/hero-particle-lazy"
import { TechStackTicker } from "@/components/home/tech-stack-ticker"
import { SkillActivityGrid } from "@/components/home/skill-activity-grid"
import { copy } from "@/lib/copy"
import { HERO_ROLE_LINES } from "@/lib/hero-config"

const ease = [0.16, 1, 0.3, 1] as const

export function HomeHero() {
  const profile = usePublicProfile()
  const reduceMotion = useReducedMotion()
  const roleSequence = HERO_ROLE_LINES.flatMap((role) => [role, 2000])

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-[#0a0f1a] hero-pad"
    >
      <HeroParticleLazy />

      <div className="section-shell relative z-10 flex flex-1 flex-col">
        <div className="pt-8 sm:pt-12 lg:pt-16">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 xl:gap-24 items-center">
            <div className="max-w-3xl">
              {profile.available && (
                <motion.p
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="accent-label mb-8"
                >
                  {copy.hero.availability}
                </motion.p>
              )}

              <motion.h1
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0, ease }}
                className="hero-premium-title font-bold tracking-tight mb-6"
              >
                {profile.name}
              </motion.h1>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.2, ease }}
                className="text-xl sm:text-2xl min-h-[2.5rem] font-medium mb-8"
              >
                {reduceMotion ? (
                  <span className="text-neutral-300">{HERO_ROLE_LINES[0]}</span>
                ) : (
                  <TypeAnimation
                    sequence={roleSequence}
                    wrapper="span"
                    speed={45}
                    repeat={Infinity}
                    deletionSpeed={50}
                    className="text-neutral-300"
                  />
                )}
              </motion.div>

              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease }}
                className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl mb-12"
              >
                {copy.hero.lead}
              </motion.p>

              <div className="flex flex-wrap items-center gap-4">
                <PremiumGlassCta href="/#contact" delay={reduceMotion ? 0 : 0.4}>
                  {copy.hero.ctaPrimary}
                </PremiumGlassCta>
                <MagneticButton href="/#projects" variant="secondary">
                  {copy.hero.ctaViewWork}
                </MagneticButton>
                <MagneticButton href={profile.resumeUrl} variant="secondary">
                  <Download className="h-4 w-4" /> {copy.hero.ctaResume}
                </MagneticButton>
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-center">
              <HeroDevSceneLazy />
            </div>
          </div>
        </div>

        <div className="section-stack pt-10 sm:pt-14 lg:pt-16">
          <TechStackTicker />
          <SkillActivityGrid />
        </div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="relative z-10 flex justify-center pb-8 pt-6"
        aria-hidden
      >
        <ChevronDown className="h-6 w-6 text-cyan-400/60 animate-bounce" />
      </motion.div>
    </section>
  )
}
