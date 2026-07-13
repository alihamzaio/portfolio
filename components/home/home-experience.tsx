"use client"

import { useEffect, useRef } from "react"
import { Briefcase, TrendingUp } from "lucide-react"
import { PremiumIcon, PremiumSection } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { useSiteContent } from "@/components/providers/site-content-provider"
import { copy } from "@/lib/copy"

export function HomeExperience() {
  const { experiences } = useSiteContent()
  const sectionRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const line = lineRef.current
    if (!section || !line) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          line.classList.add("is-drawn")
          obs.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(section)
    return () => obs.disconnect()
  }, [])

  return (
    <PremiumSection id="experience" variant="muted" className="[&_.section-shell]:max-w-4xl">
      <SectionHeading
        sectionId="experience"
        label={copy.sections.experience.label}
        title={copy.sections.experience.title}
        description={copy.sections.experience.description}
        align="center"
        className="mx-auto"
      />

      <div ref={sectionRef} className="relative">
        <div
          ref={lineRef}
          className="timeline-draw absolute left-[19px] top-8 bottom-8 w-px bg-gradient-to-b from-cyan-400/70 via-cyan-500/25 to-transparent"
          aria-hidden
        />

        <div className="space-y-10">
          {experiences.map((exp, i) => (
            <article
              key={exp.id}
              data-animate
              data-timeline-side={i % 2 === 0 ? "left" : "right"}
              className="relative pl-12 sm:pl-14 timeline-card-enter min-w-0"
              style={
                {
                  "--timeline-from": i % 2 === 0 ? "-60px" : "60px",
                } as React.CSSProperties
              }
            >
              <div className="absolute left-0 top-7 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-[#0a0f1a] shadow-[0_0_24px_rgba(59,130,246,0.15)]">
                <PremiumIcon icon={Briefcase} size={16} />
              </div>

              <PremiumCard spotlight className="!p-6 sm:!p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight break-words">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-cyan-400/90 font-medium mt-1">{exp.company}</p>
                  </div>
                  <p className="text-xs text-neutral-500 font-mono sm:text-right shrink-0">
                    {exp.period}
                    <span className="block sm:inline sm:ml-2">{exp.location}</span>
                  </p>
                </div>

                <p className="text-sm text-neutral-400 mb-5 leading-relaxed">{exp.description}</p>

                <ul className="space-y-3 mb-6">
                  {exp.achievements.map((a) => (
                    <li key={a} className="text-sm text-neutral-400 flex gap-3 leading-relaxed break-words">
                      <TrendingUp className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      {a}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                  {exp.technologies.map((t) => (
                    <span key={t} className="premium-chip text-xs font-medium px-2.5 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              </PremiumCard>
            </article>
          ))}
        </div>
      </div>
    </PremiumSection>
  )
}
