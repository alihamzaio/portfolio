"use client"

import Link from "next/link"
import type { ReactNode, MouseEvent } from "react"
import { usePathname } from "next/navigation"
import { scrollToSection, shouldSmoothScrollHash } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface PremiumGlassCtaProps {
  children: ReactNode
  href: string
  className?: string
}

export function PremiumGlassCta({ children, href, className }: PremiumGlassCtaProps) {
  const pathname = usePathname()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (shouldSmoothScrollHash(href, pathname)) {
      e.preventDefault()
      scrollToSection(href)
      window.history.pushState(null, "", href)
    }
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      data-cursor="contact"
      data-cursor-magnetic
      className={cn(
        "premium-glass-cta group relative inline-flex w-full sm:w-auto transition-transform duration-300 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]",
        className
      )}
    >
      <span className="premium-glass-cta-inner relative z-[1] inline-flex w-full sm:w-auto items-center justify-center gap-2 min-h-11 px-6 sm:px-8 py-3.5 rounded-full text-sm font-semibold text-white">
        {children}
      </span>
    </Link>
  )
}

/** @deprecated Use PremiumGlassCta */
export const AmberGlassCta = PremiumGlassCta
