"use client"

import { motion, useReducedMotion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react"
import { usePublicProfile } from "@/components/providers/site-content-provider"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { GlassCtaButton } from "@/components/ui/glass-cta-button"
import { SmartLink } from "@/components/ui/smart-link"
import { HeroGlobeLazy } from "@/components/effects/hero-globe-lazy"
import { HeroOrbitIcons } from "@/components/home/hero-orbit-icons"
import { StatsCounter } from "@/components/ui/stats-counter"
import { engineeringMetrics } from "@/lib/site"
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
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-black pt-28 sm:pt-32 pb-20"
    >
      <HeroGlobeLazy />

      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, #000 85%)" }}
        aria-hidden
      />

      <div className="section-shell relative z-10 w-full text-center md:text-left">
        <div className="max-w-4xl mx-auto md:mx-0">
          {profile.available && (
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500 mb-8 tracking-widest uppercase"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {copy.hero.availability}
            </motion.p>
          )}

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, x: -64 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0, ease }}
            className="text-sm sm:text-base font-mono tracking-[0.35em] text-neutral-500 mb-3 uppercase"
          >
            {copy.hero.greeting}
          </motion.p>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, x: 64 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease }}
            className="hero-mega-title font-bold tracking-tighter mb-6"
          >
            {copy.hero.name}
          </motion.h1>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4, ease }}
            className="text-xl sm:text-2xl text-neutral-400 mb-6 min-h-[2.5rem] font-medium"
          >
            {reduceMotion ? (
              <span>{HERO_ROLE_LINES[0]}</span>
            ) : (
              <TypeAnimation
                sequence={roleSequence}
                wrapper="span"
                speed={45}
                repeat={Infinity}
                deletionSpeed={55}
                className="text-neutral-300"
              />
            )}
          </motion.div>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease }}
            className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl mb-3"
          >
            {copy.hero.lead}
          </motion.p>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease }}
            className="text-sm text-neutral-500 leading-relaxed max-w-xl mb-10"
          >
            {copy.hero.support}
          </motion.p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8">
            <GlassCtaButton href="/#contact" delay={reduceMotion ? 0 : 0.6}>
              {copy.hero.ctaPrimary}
            </GlassCtaButton>
            <MagneticButton href="/#projects" variant="secondary">
              {copy.hero.ctaViewWork}
            </MagneticButton>
            <MagneticButton href={profile.resumeUrl} variant="secondary">
              <Download className="h-4 w-4" /> {copy.hero.ctaResume}
            </MagneticButton>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2"
          >
            {[
              { href: profile.social.github, icon: Github, label: "GitHub" },
              { href: profile.social.linkedin, icon: Linkedin, label: "LinkedIn" },
              { href: profile.social.email, icon: Mail, label: "Email" },
            ].map(({ href, icon: Icon, label }) => (
              <MagneticButton
                key={label}
                href={href}
                variant="ghost"
                className="!p-3 rounded-full border border-white/10 bg-white/[0.03] hover:border-white/25"
                target={label !== "Email" ? "_blank" : undefined}
                rel={label !== "Email" ? "noopener noreferrer" : undefined}
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </MagneticButton>
            ))}
            <span className="text-xs text-neutral-600 font-mono">{profile.email}</span>
          </motion.div>

          <HeroOrbitIcons />

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-2xl mt-12 mx-auto md:mx-0"
          >
            {engineeringMetrics.map((m) => (
              <StatsCounter key={m.label} value={m.value} label={m.label} />
            ))}
          </motion.div>

          <div className="mt-10 flex justify-center md:justify-start">
            <SmartLink
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors group"
            >
              Scroll to work
              <ArrowDown className="h-4 w-4 group-hover:translate-y-1 transition-transform duration-300" />
            </SmartLink>
          </div>
        </div>
      </div>
    </section>
  )
}
