"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode, MouseEvent } from "react"
import { usePathname } from "next/navigation"
import { scrollToSection, shouldSmoothScrollHash } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface PremiumGlassCtaProps {
  children: ReactNode
  href: string
  className?: string
  delay?: number
}

export function PremiumGlassCta({ children, href, className, delay = 0.4 }: PremiumGlassCtaProps) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (shouldSmoothScrollHash(href, pathname)) {
      e.preventDefault()
      scrollToSection(href)
      window.history.pushState(null, "", href)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      className={cn("inline-block w-full sm:w-auto", className)}
    >
      <Link
        href={href}
        onClick={handleClick}
        data-cursor="contact"
        data-cursor-magnetic
        className="premium-glass-cta group relative flex w-full sm:w-auto"
      >
        <span className="premium-glass-cta-inner relative z-[1] inline-flex w-full sm:w-auto items-center justify-center gap-2 min-h-11 px-6 sm:px-8 py-3.5 rounded-full text-sm font-semibold text-white">
          {children}
        </span>
      </Link>
    </motion.div>
  )
}

/** @deprecated Use PremiumGlassCta */
export const AmberGlassCta = PremiumGlassCta
