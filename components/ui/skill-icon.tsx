"use client"

import Image from "next/image"
import type { SkillItem } from "@/lib/types"
import { cn } from "@/lib/utils"

export function SkillIcon({
  skill,
  size = 14,
  className,
}: {
  skill: Pick<SkillItem, "name" | "icon" | "invertIcon">
  size?: number
  className?: string
}) {
  if (!skill.icon) return null

  const image = (
    <Image
      src={skill.icon}
      alt={`${skill.name} technology logo`}
      title={`${skill.name} technology logo`}
      width={size}
      height={size}
      unoptimized
      className={cn("shrink-0 object-contain", !skill.invertIcon && className)}
    />
  )

  // Dark/black logos: soft light plate + glow so the original mark stays readable
  if (skill.invertIcon) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-[4px]",
          "bg-gradient-to-b from-white/95 to-white/80",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_0_14px_rgba(59,130,246,0.35)]",
          "p-[2px]",
          className
        )}
        aria-hidden
      >
        {image}
      </span>
    )
  }

  return image
}
