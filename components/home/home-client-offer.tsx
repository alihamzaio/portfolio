"use client"

import { Code2, Cloud, Blocks, Gauge } from "lucide-react"
import { PremiumGrid } from "@/components/premium/premium-grid"
import { PremiumIcon } from "@/components/premium/premium-icon"
import { PremiumSection } from "@/components/premium/premium-section"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { SmartLink } from "@/components/ui/smart-link"
import { copy } from "@/lib/copy"

const icons = [Code2, Cloud, Blocks, Gauge]

export function HomeClientOffer() {
  return (
    <PremiumSection id="offer" variant="muted">
      <SectionHeading
        sectionId="offer"
        label={copy.sections.offer.label}
        title={copy.sections.offer.title}
        description={copy.sections.offer.description}
      />

      <PremiumGrid cols="4">
        {copy.services.map((service, i) => {
          const Icon = icons[i] ?? Code2
          return (
            <div key={service.title} data-animate>
              <PremiumCard className="h-full" spotlight>
                <PremiumIcon icon={Icon} className="mb-5" />
                <h3 className="text-base font-bold text-white mb-2 break-words">{service.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed break-words">{service.desc}</p>
              </PremiumCard>
            </div>
          )
        })}
      </PremiumGrid>

      <p data-animate className="mt-12 text-center text-sm text-neutral-500 max-w-lg mx-auto">
        Fixed-scope milestones or ongoing contract work.{" "}
        <SmartLink href="/#contact" className="text-cyan-400 hover:text-sky-300 hover:underline">
          Send your requirements
        </SmartLink>
        .
      </p>
    </PremiumSection>
  )
}
