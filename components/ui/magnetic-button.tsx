"use client"

import { useRef, type ReactNode, type MouseEvent } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import {
  getLinkKind,
  resolveNavHref,
  scrollToSection,
  shouldSmoothScrollHash,
} from "@/lib/navigation"
import { cn } from "@/lib/utils"

const MotionLink = motion.create(Link)

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
  variant?: "primary" | "secondary" | "ghost"
  type?: "button" | "submit"
  target?: string
  rel?: string
}

export function MagneticButton({
  children,
  className,
  onClick,
  href,
  variant = "primary",
  type = "button",
  target,
  rel,
}: MagneticButtonProps) {
  const pathname = usePathname()
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)

  const handleMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`
  }

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)"
  }

  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-300",
    variant === "primary" && "btn-primary px-6 py-3",
    variant === "secondary" && "btn-secondary px-6 py-3",
    variant === "ghost" && "text-[#94A3B8] hover:text-[#F8FAFC] px-3 py-2",
    className
  )

  if (href) {
    const kind = getLinkKind(href)

    const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (shouldSmoothScrollHash(href, pathname)) {
        e.preventDefault()
        scrollToSection(href)
        window.history.pushState(null, "", href)
      }
    }

    if (kind === "external" || kind === "download") {
      return (
        <motion.a
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={href}
          target={target ?? (kind === "external" ? "_blank" : undefined)}
          rel={rel ?? (kind === "external" ? "noopener noreferrer" : undefined)}
          data-cursor
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          whileTap={{ scale: 0.97 }}
          className={base}
        >
          {children}
        </motion.a>
      )
    }

    const linkHref = kind === "hash" ? resolveNavHref(href, pathname) : href

    return (
      <MotionLink
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={linkHref}
        target={target}
        rel={rel}
        data-cursor
        onClick={kind === "hash" ? handleLinkClick : undefined}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileTap={{ scale: 0.97 }}
        className={base}
      >
        {children}
      </MotionLink>
    )
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      data-cursor
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.97 }}
      className={base}
    >
      {children}
    </motion.button>
  )
}
