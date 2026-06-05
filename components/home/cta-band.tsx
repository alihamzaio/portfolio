"use client"

import { ArrowRight } from "lucide-react"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { copy } from "@/lib/copy"

export function CtaBand() {
  return (
    <section className="section-pad pb-12 relative">
      <div className="section-shell">
        <div
          data-animate
          className="relative rounded-3xl overflow-hidden border border-[#3B82F6]/20 bg-[#0F172A]/60 backdrop-blur-2xl p-12 md:p-16 text-center"
        >
          <div className="absolute inset-0 mesh-hero opacity-60 pointer-events-none" />
          <div className="absolute inset-0 shimmer-border opacity-25 pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 80% at 50% 120%, rgba(59,130,246,0.2), transparent 65%), radial-gradient(ellipse 40% 50% at 0% 0%, rgba(139,92,246,0.08), transparent 50%)",
            }}
          />
          <div className="relative max-w-2xl mx-auto">
            <p className="text-[11px] font-mono tracking-[0.28em] uppercase text-[#06B6D4] mb-5">
              {copy.sections.cta.label}
            </p>
            <h2 className="text-3xl md:text-[2.75rem] font-bold text-[#F8FAFC] mb-5 tracking-tight leading-tight">
              {copy.sections.cta.title}
            </h2>
            <p className="text-[#94A3B8] text-base sm:text-lg leading-relaxed mb-10">
              {copy.sections.cta.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton href="/#contact">
                {copy.sections.cta.button} <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton href="/api/resume/download" variant="secondary">
                Get my resume
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
