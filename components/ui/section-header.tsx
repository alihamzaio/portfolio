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
      <span className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-primary/80 mb-4">
        <span className="h-px w-6 bg-primary/50" />
        {label}
        <span className="h-px w-6 bg-primary/50" />
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{description}</p>
      )}
    </motion.div>
  )
}
