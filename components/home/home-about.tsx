"use client"

import { Download } from "lucide-react"
import { PremiumSection } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { AboutOrb } from "@/components/effects/about-orb"
import { AboutTimeline } from "@/components/home/about-timeline"
import { SkillsRadar } from "@/components/home/skills-radar"
import { AboutStatsRow } from "@/components/home/about-stats-row"
import { usePublicProfile, useSiteContent } from "@/components/providers/site-content-provider"
import { copy } from "@/lib/copy"

export function HomeAbout() {
  const profile = usePublicProfile()
  const { experiences } = useSiteContent()

  return (
    <PremiumSection id="about" variant="elevated" className="relative overflow-hidden">
      <AboutOrb />
      <SectionHeading
        sectionId="about"
        label={copy.sections.about.label}
        title={copy.sections.about.title}
        description={copy.sections.about.description}
      />

      <div className="relative z-[1] grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start min-w-0">
        <div data-animate className="min-w-0">
          <div className="space-y-4">
            {copy.sections.about.bio.map((paragraph) => (
              <p key={paragraph} className="text-neutral-400 leading-relaxed max-w-lg break-words">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-6 sm:mt-8">
            <AboutTimeline experiences={experiences} />
          </div>
        </div>

        <div data-animate className="min-w-0">
          <SkillsRadar />
          <AboutStatsRow />
          <div className="mt-8 flex justify-center lg:justify-start">
            <MagneticButton
              href={profile.resumeUrl}
              variant="secondary"
              className="premium-cv-btn btn-responsive sm:w-auto"
            >
              <Download className="h-4 w-4 shrink-0" /> Download resume
            </MagneticButton>
          </div>
        </div>
      </div>
    </PremiumSection>
  )
}
