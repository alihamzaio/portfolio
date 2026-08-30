"use client"

import { PremiumPage, PremiumReveal } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
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
        <div className="absolute left-0 top-0 bottom-0 w-px bg-[#1a1a1a]" aria-hidden />

        <div className="space-y-14">
          {experiences.map((exp, i) => (
            <PremiumReveal key={exp.id} direction="left" delay={i * 0.08} className="relative pl-8 sm:pl-10 min-w-0">
              <span className="absolute left-[-3.5px] top-2 h-2 w-2 rounded-full bg-[var(--accent-primary)]" />

              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
                <div>
                  <h2 className="font-semibold text-[var(--text-primary)] text-lg break-words">{exp.role}</h2>
                  <p className="text-[var(--accent-primary)] font-medium mt-1">{exp.company}</p>
                </div>
                <div className="text-sm text-[var(--text-muted)] sm:text-right">
                  <p>{exp.period}</p>
                  <p>{exp.location}</p>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-5 leading-[1.75]">{exp.description}</p>
              <ul className="space-y-2.5 mb-5">
                {exp.achievements.map((a) => (
                  <li key={a} className="flex gap-3 text-sm text-[var(--text-secondary)] break-words leading-relaxed">
                    <span className="mt-2 h-px w-3 shrink-0 bg-[var(--accent-primary)]" />
                    {a}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((t) => (
                  <span key={t} className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-2.5 py-1 text-[11px] text-[var(--text-secondary)]">
                    {t}
                  </span>
                ))}
              </div>
            </PremiumReveal>
          ))}
        </div>
      </div>
    </PremiumPage>
  )
}
