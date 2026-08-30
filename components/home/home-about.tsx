"use client"

import { Download } from "lucide-react"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { AboutTimeline } from "@/components/home/about-timeline"
import { AboutStatsRow } from "@/components/home/about-stats-row"
import { usePublicProfile, useSiteContent } from "@/components/providers/site-content-provider"
import { copy } from "@/lib/copy"

export function HomeAbout() {
  const profile = usePublicProfile()
  const { experiences } = useSiteContent()

  return (
    <section id="about" aria-labelledby="about-heading" className="section-pad relative bg-[var(--bg-secondary)] overflow-hidden">
      <div className="section-glow absolute inset-0 pointer-events-none" aria-hidden />
      <div className="site-grid relative z-[1]">
        <div className="grid lg:grid-cols-12 gap-[var(--space-6)] items-start">
          <header className="lg:col-span-5 lg:sticky lg:top-32" data-animate>
            <p className="section-label">{copy.sections.about.label}</p>
            <h2 id="about-heading" className="section-title mt-[var(--space-2)]" data-reveal-title>
              {copy.sections.about.title}
            </h2>
            <p className="type-body-sm mt-[var(--space-3)] max-w-sm">{copy.sections.about.description}</p>

            <div className="mt-[var(--space-5)]">
              <AboutStatsRow />
            </div>

            <div className="mt-[var(--space-4)] flex flex-wrap gap-3">
              <MagneticButton href={profile.resumeUrl} variant="secondary" className="btn-responsive sm:w-auto">
                <Download className="h-3.5 w-3.5 shrink-0" /> Get my CV
              </MagneticButton>
              <MagneticButton href="/about" variant="ghost" className="btn-responsive sm:w-auto">
                Full about page
              </MagneticButton>
            </div>
          </header>

          <div className="lg:col-span-7 min-w-0" data-reveal-clip>
            <div className="flex flex-col gap-[var(--space-4)] max-w-xl">
              {copy.sections.about.bio.map((paragraph, i) => (
                <p key={paragraph.slice(0, 40)} className={i === 0 ? "type-lead" : "type-body-sm"} data-animate>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-[var(--space-6)] pt-[var(--space-5)] border-t border-[var(--border-subtle)]">
              <AboutTimeline experiences={experiences} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
