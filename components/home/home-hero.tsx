"use client"

import { motion } from "framer-motion"
import { ArrowDown, Download, Github, Linkedin, Mail, MessageCircle, Sparkles } from "lucide-react"
import { usePublicProfile } from "@/components/providers/site-content-provider"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { SmartLink } from "@/components/ui/smart-link"
import { HeroCinematicLazy } from "@/components/effects/hero-cinematic-lazy"
import { engineeringMetrics } from "@/lib/site"
import { copy } from "@/lib/copy"
import { easeCinematic, heroStagger, fadeUp } from "@/lib/motion"

export function HomeHero() {
  const profile = usePublicProfile()
  const nameParts = profile.name.trim().split(/\s+/)
  const firstName = nameParts[0] ?? profile.name
  const lastName = nameParts.slice(1).join(" ")

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex items-center overflow-hidden pt-32 pb-28 mesh-hero"
    >
      <div className="absolute inset-0 grid-fine opacity-30 pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617] pointer-events-none z-[2]" />

      <div className="section-shell relative w-full z-10">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-16 lg:gap-20 items-center">
          <motion.div variants={heroStagger} initial="hidden" animate="visible" className="max-w-2xl">
            {profile.available && (
              <motion.div variants={fadeUp} className="badge-pill mb-8">
                <span className="h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,0.75)]" />
                {copy.hero.availability}
              </motion.div>
            )}

            <motion.p
              variants={fadeUp}
              className="text-xs font-mono font-medium text-[#06B6D4] mb-5 tracking-[0.2em] uppercase"
            >
              {copy.hero.eyebrow}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-[#94A3B8] mb-6 max-w-xl leading-snug"
            >
              {copy.hero.positioning}
            </motion.p>

            <motion.h1 variants={fadeUp} className="hero-display text-[#F8FAFC] mb-5">
              <span className="block">{firstName}</span>
              {lastName ? <span className="block text-gradient">{lastName}</span> : null}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl font-semibold text-[#94A3B8] mb-6 tracking-tight leading-snug"
            >
              {profile.title}
              <span className="block sm:inline text-[#64748B] font-normal sm:ml-2 mt-1 sm:mt-0">
                {profile.tagline || "MERN · AWS · Web3"}
              </span>
            </motion.p>

            <motion.p variants={fadeUp} className="hero-lead text-[#F8FAFC] font-medium mb-5 max-w-xl">
              {copy.hero.lead}
            </motion.p>

            <motion.p variants={fadeUp} className="text-base text-[#94A3B8] leading-relaxed max-w-xl mb-10">
              {copy.hero.support}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
              <MagneticButton href="/#projects">
                <Sparkles className="h-4 w-4" /> {copy.hero.ctaWork}
              </MagneticButton>
              <MagneticButton href="/#contact" variant="secondary">
                <MessageCircle className="h-4 w-4" /> {copy.hero.ctaContact}
              </MagneticButton>
              <MagneticButton href={profile.resumeUrl} variant="secondary">
                <Download className="h-4 w-4" /> {copy.hero.ctaResume}
              </MagneticButton>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-8">
              <div className="flex items-center gap-2.5">
                {[
                  { href: profile.social.github, icon: Github, label: "GitHub" },
                  { href: profile.social.linkedin, icon: Linkedin, label: "LinkedIn" },
                  { href: profile.social.email, icon: Mail, label: "Email" },
                ].map(({ href, icon: Icon, label }) => (
                  <MagneticButton
                    key={label}
                    href={href}
                    variant="ghost"
                    className="!p-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-[#3B82F6]/35"
                    target={label !== "Email" ? "_blank" : undefined}
                    rel={label !== "Email" ? "noopener noreferrer" : undefined}
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </MagneticButton>
                ))}
              </div>
              <a
                href={profile.social.email}
                className="text-xs text-[#64748B] font-mono hover:text-[#94A3B8] transition-colors"
              >
                {profile.email}
              </a>
            </motion.div>

            <motion.div
              variants={heroStagger}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-2xl"
            >
              {engineeringMetrics.map((m) => (
                <motion.div key={m.label} variants={fadeUp} className="h-full min-w-0">
                  <div className="glass-card rounded-xl px-3 py-4 sm:px-4 sm:py-5 h-full min-h-[92px] flex flex-col items-center justify-center text-center hover:border-[#3B82F6]/20 transition-colors duration-500">
                    <p className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tabular-nums leading-none">
                      {m.value}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-[#64748B] mt-2.5 leading-tight uppercase tracking-wide">
                      {m.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 pt-2">
              <SmartLink
                href="/#offer"
                className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#F8FAFC] transition-colors group"
              >
                Explore what I deliver
                <ArrowDown className="h-4 w-4 group-hover:translate-y-1 transition-transform duration-300" />
              </SmartLink>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 56, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.25, duration: 1.1, ease: easeCinematic }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-6 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_65%)] pointer-events-none blur-2xl" />
            <HeroCinematicLazy />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: easeCinematic }}
          className="lg:hidden mt-16"
        >
          <HeroCinematicLazy />
        </motion.div>
      </div>
    </section>
  )
}
