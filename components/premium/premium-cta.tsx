"use client"

import type { ReactNode } from "react"
import { PremiumPanel } from "@/components/premium/premium-panel"
import { PremiumSection } from "@/components/premium/premium-section"

interface PremiumCtaProps {
  label: string
  title: string
  description: string
  children: ReactNode
}

export function PremiumCta({ label, title, description, children }: PremiumCtaProps) {
  const showLabel = label.trim().toLowerCase() !== title.trim().toLowerCase()

  return (
    <PremiumSection className="!py-24 sm:!py-28 md:!py-32 border-t-0">
      <PremiumPanel centered>
        {showLabel && <p className="section-label mb-3">{label}</p>}
        <h2 className="section-title text-3xl md:text-4xl mb-4">{title}</h2>
        <p className="text-neutral-400 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-wrap justify-center gap-4">{children}</div>
      </PremiumPanel>
    </PremiumSection>
  )
}
