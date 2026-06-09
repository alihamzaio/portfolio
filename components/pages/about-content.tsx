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

      <div className="grid lg:grid-cols-2 gap-16 mb-20">
        <PremiumReveal direction="left" className="space-y-6 text-neutral-400 text-lg leading-relaxed">
          <p>
            I&apos;m a <span className="text-white font-medium">Full Stack Developer</span> based in{" "}
            {siteConfig.location}. I work with engineering teams and founders on production software.
          </p>
          <p>
            My work spans MERN stack applications, Next.js platforms, AWS serverless systems, REST APIs,
            and blockchain integrations. I handle architecture, implementation, and deployment.
          </p>
          <p>
            Available for full-time roles and contract work on web applications, APIs, and cloud infrastructure.
          </p>
          <MagneticButton href="/contact" className="mt-4">
            Contact
          </MagneticButton>
        </PremiumReveal>

        <PremiumReveal direction="right" delay={0.1}>
          <PremiumCard>
            <p className="meta-label mb-6">Skills</p>
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
