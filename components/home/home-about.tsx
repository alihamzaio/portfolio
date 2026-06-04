"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { siteConfig } from "@/lib/site"

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const step = Math.ceil(value / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <span ref={ref} className="font-display text-3xl sm:text-4xl font-semibold text-gradient">
      {count}
      {suffix}
    </span>
  )
}

export function HomeAbout() {
  return (
    <section id="about" className="section-pad relative">
      <div className="section-shell">
        <SectionHeading
          label="About"
          title="Engineer. Builder. Product thinker."
          description="I craft premium digital experiences where engineering excellence meets cinematic design — MERN, AI, and cloud at scale."
        />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <TiltCard className="gradient-border rounded-2xl">
            <PremiumCard hover={false} className="border-0 bg-transparent shadow-none">
              <p className="text-muted-foreground leading-relaxed mb-6">
                I&apos;m <span className="text-white font-medium">{siteConfig.name}</span>, a full stack MERN
                developer and AI engineer based in {siteConfig.location}. I partner with startups and enterprises to
                ship products that feel world-class — not like templates.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From e-commerce platforms and fintech dashboards to blockchain systems and AI integrations — I own the
                full stack with obsessive attention to performance, UX, and maintainable architecture.
              </p>
            </PremiumCard>
          </TiltCard>

          <div className="grid grid-cols-2 gap-4">
            {siteConfig.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <PremiumCard className="text-center py-8">
                  <Counter value={stat.value} suffix={stat.suffix} />
                  <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{stat.label}</p>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
