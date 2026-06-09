"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  label: string
  title: string
  description?: string
  className?: string
  align?: "left" | "center"
}

export function SectionHeader({
  label,
  title,
  description,
  className,
  align = "center",
}: SectionHeaderProps) {
  const showLabel = label.trim().toLowerCase() !== title.trim().toLowerCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "mb-16 md:mb-20",
        align === "center" ? "text-center mx-auto max-w-2xl" : "text-left max-w-2xl",
        className
      )}
    >
      {showLabel && <p className="section-label mb-3">{label}</p>}
      <h2 className="section-title mb-4">{title}</h2>
      {description && (
        <p className="text-neutral-400 text-base md:text-lg leading-relaxed">{description}</p>
      )}
    </motion.div>
  )
}
