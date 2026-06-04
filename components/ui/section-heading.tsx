"use client"

import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  label: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeading({ label, title, description, align = "left", className }: SectionHeadingProps) {
  return (
    <Reveal className={cn("mb-12 md:mb-16", align === "center" && "text-center mx-auto max-w-2xl", className)}>
      <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] uppercase text-[#60A5FA] mb-4">
        <span className="h-px w-6 bg-gradient-to-r from-[#3B82F6] to-transparent" />
        {label}
      </span>
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
        {title}
      </h2>
      {description && <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{description}</p>}
    </Reveal>
  )
}
