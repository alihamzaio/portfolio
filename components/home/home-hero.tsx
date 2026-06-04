"use client"

import { motion } from "framer-motion"
import { ArrowDown, Download, Github, Linkedin, Mail, MessageCircle } from "lucide-react"
import { usePublicProfile } from "@/components/providers/site-content-provider"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { SmartLink } from "@/components/ui/smart-link"
import { HeroVisualLazy } from "@/components/effects/hero-visual-lazy"
import { Hero3DLazy } from "@/components/effects/hero-3d-lazy"
import { engineeringMetrics } from "@/lib/site"
import { copy } from "@/lib/copy"
import { ease, staggerContainer, fadeUp } from "@/lib/motion"

export function HomeHero() {
  const profile = usePublicProfile()

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex items-center overflow-hidden pt-28 pb-24 mesh-hero"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/30 via-transparent to-[#030712] pointer-events-none z-[1]" />

      <div className="section-shell relative w-full z-10">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-12 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            {profile.available && (
              <motion.div variants={fadeUp} className="badge-pill mb-7">
                <span className="h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.7)]" />
                {copy.hero.availability}
              </motion.div>
            )}

            <motion.p variants={fadeUp} className="text-sm font-mono text-[#06B6D4] mb-4 tracking-wide">
              {copy.hero.eyebrow}
            </motion.p>

            <motion.h1 variants={fadeUp} className="hero-display text-[#F8FAFC] mb-4">
              {profile.name}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl sm:text-2xl font-semibold text-[#94A3B8] mb-5 tracking-tight"
            >
              {profile.title}
              <span className="text-[#64748B] font-normal"> · {profile.tagline || "MERN · AWS · Web3"}</span>
            </motion.p>

            <motion.p variants={fadeUp} className="hero-lead text-[#F8FAFC] font-medium mb-4">
              {copy.hero.lead}
            </motion.p>

            <motion.p variants={fadeUp} className="text-base text-[#94A3B8] leading-relaxed max-w-xl mb-9">
              {copy.hero.support}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8">
              <MagneticButton href="/#projects">{copy.hero.ctaWork}</MagneticButton>
              <MagneticButton href="/#contact" variant="secondary">
                <MessageCircle className="h-4 w-4" /> {copy.hero.ctaContact}
              </MagneticButton>
              <MagneticButton href={profile.resumeUrl} variant="secondary">
                <Download className="h-4 w-4" /> {copy.hero.ctaResume}
              </MagneticButton>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-2.5 mb-11">
              <MagneticButton
                href={profile.social.github}
                variant="ghost"
                className="!p-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-[#3B82F6]/30"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton
                href={profile.social.linkedin}
                variant="ghost"
                className="!p-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-[#3B82F6]/30"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton
                href={profile.social.email}
                variant="ghost"
                className="!p-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-[#3B82F6]/30"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </MagneticButton>
              <span className="text-xs text-[#64748B] ml-2 hidden sm:inline">
                {profile.email}
              </span>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {engineeringMetrics.map((m) => (
                <motion.div key={m.label} variants={fadeUp}>
                  <div className="glass-card rounded-xl px-4 py-4 text-center border-white/[0.08]">
                    <p className="text-xl font-bold text-[#F8FAFC] tabular-nums">{m.value}</p>
                    <p className="text-[10px] text-[#64748B] mt-1.5 leading-snug">{m.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp}>
              <SmartLink
                href="/#offer"
                className="inline-flex items-center gap-2 mt-12 text-sm text-[#64748B] hover:text-[#F8FAFC] transition-colors group"
              >
                What I offer clients
                <ArrowDown className="h-4 w-4 group-hover:translate-y-1 transition-transform duration-300" />
              </SmartLink>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 1, ease }}
            className="relative min-h-[440px] lg:min-h-[560px] rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.08)] cursor-grab active:cursor-grabbing"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/[0.04] via-transparent to-[#06B6D4]/[0.05] pointer-events-none z-[1]" />
            <Hero3DLazy />
            <div className="relative z-10 h-full pointer-events-none">
              <HeroVisualLazy />
            </div>
            <p className="absolute bottom-3 left-4 z-20 text-[10px] font-mono text-[#64748B] tracking-wider pointer-events-none">
              3D workspace · drag to explore
            </p>
          </motion.div>
        </div>

        <div className="lg:hidden mt-14 relative min-h-[400px] rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <Hero3DLazy />
          <div className="relative z-10">
            <HeroVisualLazy />
          </div>
        </div>
      </div>
    </section>
  )
}
