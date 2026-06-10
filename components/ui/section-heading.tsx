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
  const showLabel = label.trim().toLowerCase() !== title.trim().toLowerCase()

  return (
    <header
      data-animate
      className={cn(
        "mb-10 sm:mb-12 md:mb-16 lg:mb-20",
        align === "center" && "text-center mx-auto max-w-3xl",
        align === "left" && "max-w-3xl",
        className
      )}
    >
      {showLabel && (
        <p className={cn("section-label mb-3", align === "center" && "mx-auto")}>{label}</p>
      )}
      <TitleTag
        id={sectionId ? `${sectionId}-heading` : undefined}
        className="section-title break-words"
      >
        {title}
      </TitleTag>
      {description && (
        <p
          data-animate
          className={cn(
            "mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </header>
  )
}
