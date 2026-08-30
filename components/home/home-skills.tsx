"use client"

import { skillCategories } from "@/lib/skills-data"
import { copy } from "@/lib/copy"

const allSkills = skillCategories.flatMap((c) => c.skills.map((s) => s.name))

export function HomeSkills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="section-pad bg-[var(--bg-primary)] overflow-hidden">
      <div className="site-grid">
        <header className="section-header grid lg:grid-cols-12 gap-[var(--space-4)]" data-animate>
          <div className="lg:col-span-6">
            <p className="section-label">{copy.sections.skills.label}</p>
            <h2 id="skills-heading" className="section-title" data-reveal-title>
              {copy.sections.skills.title}
            </h2>
          </div>
          <p className="lg:col-span-6 lg:pt-[var(--space-4)] type-body max-w-lg">{copy.sections.skills.description}</p>
        </header>
      </div>

      <div className="marquee-mask border-y border-[var(--border-subtle)] py-[var(--space-4)] my-[var(--space-5)]" data-marquee data-animate>
        <div data-marquee-track className="flex gap-[var(--space-6)] whitespace-nowrap w-max">
          {allSkills.map((skill, i) => (
            <span
              key={`${skill}-${i}`}
              className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[var(--text-primary)]/[0.08]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="site-grid">
        {skillCategories.map((cat, i) => (
          <div
            key={cat.id}
            data-animate
            className={`grid gap-[var(--space-3)] py-[var(--space-5)] sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-[var(--space-5)] ${
              i !== 0 ? "border-t border-[var(--border-subtle)]" : ""
            }`}
          >
            <div>
              <p className="type-label !text-[var(--accent-primary)]/80 mb-[var(--space-1)]">{String(i + 1).padStart(2, "0")}</p>
              <p className="type-heading !text-[var(--text-primary)] !text-base font-semibold">{cat.title}</p>
              <p className="type-caption mt-[var(--space-1)]">{cat.description}</p>
            </div>
            <div className="flex flex-wrap gap-x-[var(--space-3)] gap-y-[var(--space-2)] content-start">
              {cat.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="type-body-sm border-b border-transparent hover:border-[var(--border-subtle)] hover:!text-[var(--text-primary)] transition-colors pb-0.5"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
