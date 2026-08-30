"use client"

import type { ReactNode } from "react"
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
    <PremiumSection className="!py-24 sm:!py-32 md:!py-40">
      <div data-animate className="mx-auto max-w-2xl text-center">
        {showLabel && <p className="section-label mb-4">{label}</p>}
        <p className="section-title mb-5">{title}</p>
        <p className="text-body text-base sm:text-[15px] mb-10 sm:mb-12 mx-auto max-w-xl text-balance">
          {description}
        </p>
        <div className="hero-actions justify-center w-full max-w-md sm:max-w-none mx-auto">
          {children}
        </div>
      </div>
    </PremiumSection>
  )
}
