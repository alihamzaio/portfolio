"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Github, Linkedin } from "lucide-react"
import { siteConfig } from "@/lib/site"
import { TypingText } from "@/components/ui/typing-text"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { HeroParticles } from "@/components/effects/hero-particles"
import { HeroOrb } from "@/components/effects/hero-orb"

const techIcons = ["React", "Next.js", "Node", "AWS", "AI", "Docker"]

export function HomeHero() {
  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center overflow-hidden pt-24 pb-16 sm:pt-28">
      <HeroParticles />
      <div className="section-shell relative w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {siteConfig.available && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 mb-6 sm:mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-[#60A5FA] opacity-60" />
                  <span className="relative rounded-full h-2 w-2 bg-[#60A5FA]" />
                </span>
                <span className="text-xs font-mono text-[#94A3B8]">Open for premium projects</span>
              </motion.div>
            )}

            <p className="text-xs sm:text-sm font-mono text-muted-foreground tracking-widest uppercase mb-3 sm:mb-4">
              {siteConfig.tagline}
            </p>

            <h1 className="font-display text-[2rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-semibold tracking-tight leading-[1.08] mb-4 sm:mb-6">
              <span className="text-white">I build </span>
              <br className="sm:hidden" />
              <span className="text-gradient">
                <TypingText words={["intelligent apps", "SaaS products", "AI systems", "cloud platforms"]} />
              </span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl mb-8 sm:mb-10">
              {siteConfig.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
              <MagneticButton href="/#contact">Start a Project</MagneticButton>
              <MagneticButton href="/#projects" variant="outline">
                View Work <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </div>

            <motion.div
              className="flex flex-wrap gap-2 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {techIcons.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="px-3 py-1.5 text-xs font-mono rounded-lg glass-panel border border-white/[0.06] text-muted-foreground hover:text-[#60A5FA] hover:border-[#3B82F6]/30 transition-colors"
                >
                  {t}
                </motion.span>
              ))}
            </motion.div>

            <div className="flex items-center gap-4">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl glass-panel hover:border-[#3B82F6]/30 text-muted-foreground hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl glass-panel hover:border-[#3B82F6]/30 text-muted-foreground hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden sm:block"
          >
            <HeroOrb />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
