"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { siteConfig } from "@/lib/site"
import { HeroOrb } from "@/components/effects/hero-orb"
import { MagneticButton } from "@/components/ui/magnetic-button"

export function HomeHero() {
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % siteConfig.roles.length), 3200)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative min-h-[100dvh] flex items-center pt-28 pb-20 overflow-hidden">
      <div className="section-shell w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {siteConfig.available && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00FFB2]/25 bg-[#00FFB2]/5 mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFB2] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FFB2]" />
                </span>
                <span className="text-xs font-mono text-[#7CFFCB] tracking-wide">Available for elite projects</span>
                <Sparkles className="h-3.5 w-3.5 text-[#00FFB2]" />
              </motion.div>
            )}

            <p className="text-sm font-mono text-muted-foreground tracking-widest uppercase mb-4">
              {siteConfig.tagline}
            </p>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] mb-6">
              <span className="text-white">I architect </span>
              <span className="text-gradient">premium</span>
              <br />
              <span className="text-white">digital systems.</span>
            </h1>

            <div className="h-8 mb-8 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={roleIndex}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="text-lg text-[#7CFFCB] font-medium"
                >
                  {siteConfig.roles[roleIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mb-10">
              {siteConfig.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <MagneticButton href="/projects">
                View Case Studies
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton href="/contact" variant="outline">
                Start a Project
              </MagneticButton>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6"
            >
              {siteConfig.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-semibold text-[#00FFB2]">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <HeroOrb />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] text-muted-foreground uppercase">Scroll</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-[#00FFB2] to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  )
}
