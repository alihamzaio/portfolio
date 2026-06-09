"use client"

import { ArrowRight } from "lucide-react"
import { PremiumCta } from "@/components/premium/premium-cta"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { copy } from "@/lib/copy"

export function CtaBand() {
  return (
    <PremiumCta
      label={copy.sections.cta.label}
      title={copy.sections.cta.title}
      description={copy.sections.cta.description}
    >
      <MagneticButton href="/#contact">
        {copy.sections.cta.button} <ArrowRight className="h-4 w-4" />
      </MagneticButton>
      <MagneticButton href="/api/resume/download" variant="secondary">
        Download resume
      </MagneticButton>
    </PremiumCta>
  )
}
