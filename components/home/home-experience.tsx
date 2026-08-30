"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import { useSiteContent } from "@/components/providers/site-content-provider"
import { copy } from "@/lib/copy"

export function HomeExperience() {
  const { experiences } = useSiteContent()
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const line = lineRef.current
    if (!line) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          line.classList.add("is-drawn")
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(line)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="experience" aria-labelledby="experience-heading" className="section-pad bg-[var(--bg-primary)]">
      <div className="site-grid">
        <header className="section-header grid lg:grid-cols-12 gap-[var(--space-4)]" data-animate>
          <div className="lg:col-span-5">
            <p className="section-label">{copy.sections.experience.label}</p>
            <h2 id="experience-heading" className="section-title" data-reveal-title>
              {copy.sections.experience.title}
            </h2>
          </div>
          <p className="lg:col-span-7 lg:pt-[var(--space-4)] type-body max-w-lg">{copy.sections.experience.description}</p>
        </header>

        <div className="relative">
          <div
            ref={lineRef}
            className="timeline-draw absolute left-[5px] sm:left-[7px] top-0 bottom-0 w-px bg-[var(--border-subtle)]"
            aria-hidden
          />

          <div>
            {experiences.map((exp, i) => (
              <article
                key={exp.id}
                data-animate
                className="relative pl-[var(--space-5)] sm:pl-[var(--space-6)] py-[var(--space-5)] border-b border-[var(--border-subtle)] last:border-b-0"
                style={{ "--timeline-from": i % 2 === 0 ? "-40px" : "40px" } as CSSProperties}
              >
                <span
                  className="absolute left-0 top-[calc(var(--space-5)+0.65rem)] h-2.5 w-2.5 border border-[var(--accent-primary)] bg-[var(--bg-primary)] rotate-45"
                  aria-hidden
                />

                <div className="grid lg:grid-cols-12 gap-[var(--space-3)]">
                  <div className="lg:col-span-4">
                    <p className="type-label !text-[var(--accent-primary)] mb-[var(--space-2)]">{exp.period}</p>
                    <h3 className="type-display-sm !text-xl sm:!text-2xl">
                      {exp.role} at {exp.company}
                    </h3>
                    <p className="type-caption mt-[var(--space-1)]">{exp.location}</p>
                  </div>

                  <div className="lg:col-span-8">
                    <p className="type-body-sm mb-[var(--space-3)] max-w-2xl">{exp.description}</p>
                    <ul className="space-y-[var(--space-2)] mb-[var(--space-3)]">
                      {exp.achievements.map((a) => (
                        <li key={a} className="flex gap-[var(--space-2)] type-body-sm !text-[var(--text-secondary)]">
                          <span className="mt-[0.6rem] h-px w-3 shrink-0 bg-[var(--border-subtle)]" />
                          {a}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-[var(--space-1)]">
                      {exp.technologies.map((t) => (
                        <span
                          key={t}
                          className="type-label !text-[0.625rem] !tracking-[0.08em] border border-[var(--border-subtle)] px-[var(--space-2)] py-[var(--space-1)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
