"use client"

import { Cloud, Code2, Database, Layers } from "lucide-react"
import {
  PremiumGrid,
  PremiumIcon,
  PremiumPage,
  PremiumProgressList,
  PremiumReveal,
} from "@/components/premium"
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
    <PremiumPage>
      <SectionHeading
        headingLevel={1}
        label="About"
        title={`${siteConfig.name} — engineer & builder`}
        description="I craft premium web products for teams who refuse to ship mediocre software. MERN stack depth, AWS cloud fluency, and a designer's eye for detail."
      />

      <div className="grid lg:grid-cols-2 gap-16 mb-20">
        <PremiumReveal direction="left" className="space-y-6 text-neutral-400 text-lg leading-relaxed">
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
            My philosophy is simple: <span className="text-cyan-400">engineer like a product company</span>, not a
            freelancer throwing code over the wall.
          </p>
          <MagneticButton href="/contact" className="mt-4">
            Work with me
          </MagneticButton>
        </PremiumReveal>

        <PremiumReveal direction="right" delay={0.1}>
          <PremiumCard>
            <p className="accent-label mb-6">Core proficiency</p>
            <PremiumProgressList items={skills} columns={1} />
          </PremiumCard>
        </PremiumReveal>
      </div>

      <PremiumGrid cols="4">
        {pillars.map((p, i) => (
          <PremiumReveal key={p.title} delay={i * 0.08}>
            <PremiumCard className="h-full" spotlight>
              <PremiumIcon icon={p.icon} className="mb-4" size={28} />
              <h3 className="font-semibold text-white mb-2">{p.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{p.desc}</p>
            </PremiumCard>
          </PremiumReveal>
        ))}
      </PremiumGrid>
    </PremiumPage>
  )
}
