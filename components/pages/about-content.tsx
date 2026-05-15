"use client"

import { motion } from "framer-motion"
import { Cloud, Code2, Database, Layers } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { siteConfig } from "@/lib/site"

const pillars = [
  { icon: Layers, title: "Product Engineering", desc: "End-to-end delivery from UX to deployment with obsessive polish." },
  { icon: Cloud, title: "Cloud Architecture", desc: "AWS serverless, containers, and infrastructure built for scale." },
  { icon: Database, title: "Data Systems", desc: "MongoDB, PostgreSQL, indexing, and API design that performs." },
  { icon: Code2, title: "Modern Stack", desc: "React, Next.js, Node.js, TypeScript — production-grade by default." },
]

const skills = [
  { name: "React & Next.js", level: 95 },
  { name: "Node.js & APIs", level: 92 },
  { name: "AWS & Serverless", level: 88 },
  { name: "TypeScript", level: 90 },
  { name: "Docker & CI/CD", level: 85 },
]

export function AboutContent() {
  return (
    <div className="pt-28 section-pad">
      <div className="section-shell">
        <SectionHeading
          label="About"
          title={`${siteConfig.name} — engineer & builder`}
          description="I craft premium web products for teams who refuse to ship mediocre software. MERN stack depth, AWS cloud fluency, and a designer's eye for detail."
        />

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-muted-foreground text-lg leading-relaxed"
          >
            <p>
              I&apos;m a <span className="text-white font-medium">full stack MERN + AWS engineer</span> based in{" "}
              {siteConfig.location}, partnering with startups and agencies worldwide to ship production systems that
              feel like premium SaaS products.
            </p>
            <p>
              From e-commerce platforms and fintech dashboards to blockchain indexers and healthcare portals — I own
              the stack: React/Next.js frontends, Node.js APIs, database architecture, and cloud deployment.
            </p>
            <p>
              My philosophy is simple: <span className="text-[#00FFB2]">engineer like a product company</span>, not a
              freelancer throwing code over the wall.
            </p>
            <MagneticButton href="/contact" className="mt-4">
              Work with me
            </MagneticButton>
          </motion.div>

          <PremiumCard>
            <p className="text-xs font-mono tracking-widest uppercase text-[#00FFB2] mb-6">Core proficiency</p>
            <div className="space-y-5">
              {skills.map((s, i) => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/90">{s.name}</span>
                    <span className="text-[#00FFB2] font-mono">{s.level}%</span>
                  </div>
                  <motion.div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#00FFB2] to-[#00C896]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <PremiumCard className="h-full">
                <p.icon className="h-8 w-8 text-[#00FFB2] mb-4" />
                <h3 className="font-display font-semibold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </PremiumCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
