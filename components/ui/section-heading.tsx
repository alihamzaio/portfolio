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
        "mb-16 sm:mb-20 md:mb-24 lg:mb-28",
        align === "center" && "text-center mx-auto max-w-2xl",
        align === "left" && "max-w-2xl",
        className
      )}
    >
      {showLabel && (
        <p className={cn("section-label mb-4", align === "center" && "mx-auto")}>{label}</p>
      )}
      <TitleTag
        id={sectionId ? `${sectionId}-heading` : undefined}
        className="section-title break-words"
      >
        {title}
      </TitleTag>
      {description && (
        <p
          className={cn(
            "mt-5 sm:mt-6 text-[15px] sm:text-base text-neutral-500 leading-[1.8] max-w-xl",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </header>
  )
}
