"use client"

import { Download } from "lucide-react"
import { PremiumSection } from "@/components/premium"
import { ProfileAvatar } from "@/components/ui/profile-avatar"
import { SectionHeading } from "@/components/ui/section-heading"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { AboutOrbLazy } from "@/components/effects/about-orb-lazy"
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
      <AboutOrbLazy />
      <SectionHeading
        sectionId="about"
        label={copy.sections.about.label}
        title={copy.sections.about.title}
        description={copy.sections.about.description}
      />

      <div className="relative z-[1] grid lg:grid-cols-2 gap-14 lg:gap-16 items-start">
        <div data-animate>
          <div className="flex items-center gap-5 mb-8 lg:hidden">
            <ProfileAvatar name={profile.name} size={88} />
            <p className="text-sm text-neutral-400">{profile.title}</p>
          </div>
          <p className="text-neutral-400 leading-relaxed mb-8 max-w-lg">
            I&apos;m {profile.name} — {profile.title.toLowerCase()} in {profile.location}.{" "}
            {profile.description}
          </p>
          <AboutTimeline experiences={experiences} />
        </div>

        <div data-animate>
          <SkillsRadar />
          <AboutStatsRow />
          <div className="mt-8 flex justify-center lg:justify-start">
            <MagneticButton href={profile.resumeUrl} variant="secondary" className="premium-cv-btn">
              <Download className="h-4 w-4" /> Download CV
            </MagneticButton>
          </div>
        </div>
      </div>
    </PremiumSection>
  )
}
