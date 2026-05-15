"use client"

import { motion } from "framer-motion"
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
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn("mb-16 md:mb-20", align === "center" && "text-center mx-auto max-w-2xl", className)}
    >
      <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] uppercase text-[#00FFB2] mb-4">
        <span className="h-px w-8 bg-[#00FFB2]/50" />
        {label}
      </span>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-4">
        {title}
      </h2>
      {description && <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{description}</p>}
    </motion.div>
  )
}
