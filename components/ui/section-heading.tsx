"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { easeCinematic, viewportOnce } from "@/lib/motion"

interface SectionHeadingProps {
  label: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.75, ease: easeCinematic }}
      className={cn(
        "mb-20 md:mb-24",
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
        <span className="h-px w-8 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]" aria-hidden />
        <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#06B6D4]">
          {label}
        </p>
        <span className="h-px w-8 bg-gradient-to-l from-[#3B82F6] to-[#06B6D4]" aria-hidden />
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-[3.25rem] font-bold tracking-tight text-[#F8FAFC] leading-[1.05]">
        {title}
      </h2>
      {description && (
        <p className="mt-6 text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </motion.header>
  )
}
