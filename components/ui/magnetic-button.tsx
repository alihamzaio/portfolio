"use client"

import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"
import {
  getLinkKind,
  resolveNavHref,
  scrollToSection,
  shouldSmoothScrollHash,
} from "@/lib/navigation"
import { prefersFinePointer } from "@/lib/motion-prefs"
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
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  const [magnetic, setMagnetic] = useState(false)

  useEffect(() => {
    setMagnetic(prefersFinePointer() && !reduceMotion)
  }, [reduceMotion])

  const handleMove = (e: MouseEvent) => {
    if (!magnetic) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`
    el.style.setProperty("--bx", `${((e.clientX - rect.left) / rect.width) * 100}%`)
    el.style.setProperty("--by", `${((e.clientY - rect.top) / rect.height) * 100}%`)
  }

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)"
  }

  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-[color,background,border-color,box-shadow] duration-300",
    magnetic && "will-change-transform",
    variant === "primary" &&
      "btn-primary px-7 py-3 relative overflow-hidden before:absolute before:inset-0 before:opacity-0 hover:before:opacity-100 before:bg-[radial-gradient(circle_at_var(--bx,50%)_var(--by,50%),rgba(255,255,255,0.12),transparent_55%)] before:transition-opacity before:duration-300",
    variant === "secondary" && "btn-secondary px-7 py-3",
    variant === "ghost" && "text-[#94A3B8] hover:text-[#F8FAFC] px-3 py-2",
    className
  )

  const tap = reduceMotion ? undefined : { scale: 0.97 }
  const moveProps = magnetic
    ? { onMouseMove: handleMove, onMouseLeave: handleLeave }
    : {}

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
          whileTap={tap}
          className={base}
          {...moveProps}
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
        whileTap={tap}
        className={base}
        {...moveProps}
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
      whileTap={tap}
      className={base}
      {...moveProps}
    >
      {children}
    </motion.button>
  )
}
