"use client"

import { Briefcase, TrendingUp } from "lucide-react"
import { PremiumIcon, PremiumPage, PremiumReveal } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { experiences } from "@/lib/experience"

export function ExperienceContent() {
  return (
    <PremiumPage narrow>
      <SectionHeading
        headingLevel={1}
        label="Experience"
        title="Work history"
        description="Three years in full stack and MERN stack roles building APIs, cloud infrastructure, and production web applications."
      />

      <div className="relative">
        <div
          className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/60 via-cyan-500/20 to-transparent"
          aria-hidden
        />

        <div className="space-y-10">
          {experiences.map((exp, i) => (
            <PremiumReveal key={exp.id} direction="left" delay={i * 0.1} className="relative pl-12 sm:pl-14 min-w-0">
              <div className="absolute left-0 top-6 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-[#0a0f1a] shadow-[0_0_24px_rgba(59,130,246,0.15)]">
                <PremiumIcon icon={Briefcase} size={16} />
              </div>

              <PremiumCard spotlight>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-semibold text-white text-lg break-words">{exp.role}</h3>
                    <p className="text-cyan-400 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-sm text-neutral-500 sm:text-right">
                    <p>{exp.period}</p>
                    <p>{exp.location}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-400 mb-5 leading-relaxed">{exp.description}</p>
                <ul className="space-y-2 mb-5">
                  {exp.achievements.map((a) => (
                    <li key={a} className="flex gap-2 text-sm text-neutral-300 break-words">
                      <TrendingUp className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      {a}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                  {exp.technologies.map((t) => (
                    <span key={t} className="premium-chip text-[10px] font-medium px-2.5 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              </PremiumCard>
            </PremiumReveal>
          ))}
        </div>
      </div>
    </PremiumPage>
  )
}
