"use client"

import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  label: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
  sectionId?: string
  /** Use h1 on standalone pages for SEO */
  headingLevel?: 1 | 2
}

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  className,
  sectionId,
  headingLevel = 2,
}: SectionHeadingProps) {
  const TitleTag = headingLevel === 1 ? "h1" : "h2"

  return (
    <header
      data-animate
      className={cn(
        "mb-16 md:mb-20 lg:mb-24",
        align === "center" && "text-center mx-auto max-w-3xl",
        align === "left" && "max-w-3xl",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 mb-5",
          align === "center" && "justify-center"
        )}
      >
        <span className="h-px w-8 bg-gradient-to-r from-cyan-400/80 to-blue-500/40" aria-hidden />
        <p className="accent-label">{label}</p>
        <span className="h-px w-8 bg-gradient-to-l from-cyan-400/80 to-blue-500/40" aria-hidden />
      </div>
      <div data-heading-reveal className="overflow-hidden mb-0">
        <TitleTag
          id={sectionId ? `${sectionId}-heading` : undefined}
          data-heading-inner
          className="section-title"
        >
          {title}
        </TitleTag>
      </div>
      {description && (
        <p data-animate className="mt-6 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </header>
  )
}
