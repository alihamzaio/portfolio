"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ease } from "@/lib/motion"

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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease }}
      className={cn(
        "mb-16 md:mb-20",
        align === "center" && "text-center mx-auto max-w-2xl",
        align === "left" && "max-w-2xl",
        className
      )}
    >
      <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-4">
        {label}
      </p>
      <h2 className="text-3xl sm:text-4xl md:text-[3rem] font-bold tracking-tight text-[#F8FAFC] leading-[1.06]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base sm:text-lg text-[#94A3B8] leading-relaxed">{description}</p>
      )}
    </motion.header>
  )
}
