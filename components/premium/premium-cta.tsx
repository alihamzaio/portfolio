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
    <PremiumSection className="!py-16 sm:!py-24 md:!py-28 lg:!py-32 border-t-0">
      <PremiumPanel centered>
        {showLabel && <p className="section-label mb-3">{label}</p>}
        <h2 className="section-title mb-4">{title}</h2>
        <p className="text-neutral-400 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto text-balance">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-stretch sm:items-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto sm:mx-0">
          {children}
        </div>
      </PremiumPanel>
    </PremiumSection>
  )
}
