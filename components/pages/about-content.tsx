"use client"

import { Cloud, Code2, Database, Layers } from "lucide-react"
import {
  PremiumGrid,
  PremiumIcon,
  PremiumPage,
  PremiumReveal,
} from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { siteConfig } from "@/lib/site"
import { copy } from "@/lib/copy"

const pillars = [
  {
    icon: Layers,
    title: "Full Stack Development",
    desc: "React and Next.js frontends with Node.js APIs, from requirements through production release.",
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    desc: "AWS serverless architecture, Terraform provisioning, and CI/CD pipelines.",
  },
  {
    icon: Database,
    title: "Data & APIs",
    desc: "MongoDB, PostgreSQL, Redis, and REST API development with clear contracts.",
  },
  {
    icon: Code2,
    title: "Blockchain Development",
    desc: "Smart contracts, wallet integration, and RPC indexing for Web3 applications.",
  },
]

const skills = [
  { name: "React & Next.js", level: 95 },
  { name: "Node.js & REST APIs", level: 92 },
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
        title={`${siteConfig.name}, Full Stack Developer`}
        description="3+ years building web applications, cloud infrastructure, APIs, and blockchain integrations for startups and product teams."
      />

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16 sm:mb-24">
        <PremiumReveal direction="left" className="space-y-6 text-[var(--text-secondary)] text-base sm:text-lg leading-[1.75] break-words">
          {copy.sections.about.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <MagneticButton href="/contact" className="mt-2 btn-responsive sm:w-auto">
            Contact
          </MagneticButton>
        </PremiumReveal>

        <PremiumReveal direction="right" delay={0.1}>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 sm:p-8">
            <p className="meta-label mb-6">Skills</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.name}
                  className="inline-flex items-center gap-2 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1.5 text-sm text-[var(--text-secondary)]"
                >
                  {skill.name}
                  <span className="text-xs text-[var(--text-muted)] tabular-nums">{skill.level}%</span>
                </span>
              ))}
            </div>
          </div>
        </PremiumReveal>
      </div>

      <PremiumGrid cols="4">
        {pillars.map((p, i) => (
          <PremiumReveal key={p.title} delay={i * 0.08}>
            <div className="h-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6">
              <PremiumIcon icon={p.icon} className="mb-4" size={22} />
              <h2 className="font-semibold text-[var(--text-primary)] mb-2">{p.title}</h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{p.desc}</p>
            </div>
          </PremiumReveal>
        ))}
      </PremiumGrid>
    </PremiumPage>
  )
}
