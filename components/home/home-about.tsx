"use client"

import { Cloud, Code2, Database, Layers, Zap } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { SectionWrapper } from "@/components/ui/section-wrapper"
import { PremiumCard } from "@/components/ui/premium-card"
import { StatsCounter } from "@/components/ui/stats-counter"
import { usePublicProfile } from "@/components/providers/site-content-provider"
import { engineeringMetrics } from "@/lib/site"
import { copy } from "@/lib/copy"

const pillars = [
  { icon: Layers, title: "End-to-end delivery", desc: "I'd rather own the API and the deploy than play telephone between three teams." },
  { icon: Code2, title: "Backend & APIs", desc: "REST, queues, webhooks — the unglamorous glue that keeps mobile and web in sync." },
  { icon: Cloud, title: "AWS & DevOps", desc: "Serverless, Docker, CI/CD. I actually read CloudWatch logs instead of guessing." },
  { icon: Database, title: "Data layer", desc: "Postgres, Mongo, Redis. I'll argue about indexes before we ship another slow query." },
  { icon: Zap, title: "Web3 when you need it", desc: "Indexers and wallet flows from Verana & UniLabs — not blockchain for the slide deck." },
]

export function HomeAbout() {
  const profile = usePublicProfile()

  return (
    <SectionWrapper id="about" variant="elevated">
        <SectionHeading
          sectionId="about"
          label={copy.sections.about.label}
          title={copy.sections.about.title}
          description={copy.sections.about.description}
        />

        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start mb-20">
          <div data-animate>
            <PremiumCard hover={false} spotlight>
              <p className="text-[#94A3B8] leading-relaxed mb-5 text-base">
                I&apos;m <span className="text-[#F8FAFC] font-semibold">{profile.name}</span>, a{" "}
                {profile.title.toLowerCase()} in {profile.location}. {profile.description}
              </p>
              <p className="text-xs font-mono text-neutral-500 border-l-2 border-white/20 pl-4">
                {profile.education}
              </p>
            </PremiumCard>
          </div>

          <div data-animate-stagger className="grid grid-cols-2 gap-3">
            {engineeringMetrics.map((m) => (
              <StatsCounter key={m.label} value={m.value} label={m.label} />
            ))}
          </div>
        </div>

        <div data-animate-stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p) => (
            <div key={p.title} data-animate>
              <PremiumCard className="h-full" spotlight>
                <p.icon className="h-5 w-5 text-neutral-400 mb-5" strokeWidth={1.75} />
                <h3 className="text-base font-bold text-[#F8FAFC] mb-2">{p.title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{p.desc}</p>
              </PremiumCard>
            </div>
          ))}
        </div>
    </SectionWrapper>
  )
}
