"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import type { ReactNode, MouseEvent } from "react"
import { usePathname } from "next/navigation"
import { scrollToSection, shouldSmoothScrollHash } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface GlassCtaButtonProps {
  children: ReactNode
  href: string
  className?: string
  delay?: number
}

export function GlassCtaButton({ children, href, className, delay = 0.6 }: GlassCtaButtonProps) {
  const pathname = usePathname()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (shouldSmoothScrollHash(href, pathname)) {
      e.preventDefault()
      scrollToSection(href)
      window.history.pushState(null, "", href)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="inline-block"
    >
      <Link
        href={href}
        onClick={handleClick}
        data-cursor
        className={cn("glass-cta group relative inline-flex", className)}
      >
        <span className="glass-cta-inner relative z-[1] inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white">
          {children}
        </span>
      </Link>
    </motion.div>
  )
}
