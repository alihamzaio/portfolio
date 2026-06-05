"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import type { ReactNode, MouseEvent } from "react"
import { usePathname } from "next/navigation"
import { scrollToSection, shouldSmoothScrollHash } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface GlowCtaButtonProps {
  children: ReactNode
  href: string
  className?: string
}

export function GlowCtaButton({ children, href, className }: GlowCtaButtonProps) {
  const pathname = usePathname()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (shouldSmoothScrollHash(href, pathname)) {
      e.preventDefault()
      scrollToSection(href)
      window.history.pushState(null, "", href)
    }
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
      <Link
        href={href}
        onClick={handleClick}
        data-cursor
        className={cn("glow-cta group relative inline-flex items-center gap-2", className)}
      >
        <span className="relative z-[1] inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-[#0a0a1a] bg-[#00d4ff] group-hover:bg-[#33ddff] transition-colors duration-300">
          {children}
        </span>
      </Link>
    </motion.div>
  )
}
