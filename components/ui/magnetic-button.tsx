"use client"

import { type ReactNode, type MouseEvent } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  getLinkKind,
  resolveNavHref,
  scrollToSection,
  shouldSmoothScrollHash,
} from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
  variant?: "primary" | "secondary" | "ghost"
  type?: "button" | "submit"
  target?: string
  rel?: string
  cursorMode?: "button" | "contact" | "external"
  cursorLabel?: string
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
  cursorMode = "button",
  cursorLabel,
}: MagneticButtonProps) {
  const pathname = usePathname()

  const cursorProps = {
    "data-cursor": cursorMode,
    "data-cursor-magnetic": true,
    ...(cursorLabel ? { "data-cursor-label": cursorLabel } : {}),
    ...(cursorMode === "external" ? { "data-cursor-arrow": "true" } : {}),
  }

  const base = cn(
    "inline-flex items-center justify-center gap-2 min-h-11 rounded-xl text-sm font-semibold transition-[color,background,border-color,box-shadow,transform] duration-300 motion-safe:active:scale-[0.97]",
    variant === "primary" &&
      "btn-primary px-7 py-3 relative overflow-hidden before:absolute before:inset-0 before:opacity-0 hover:before:opacity-100 before:bg-[radial-gradient(circle_at_var(--bx,50%)_var(--by,50%),rgba(255,255,255,0.12),transparent_55%)] before:transition-opacity before:duration-300",
    variant === "secondary" && "btn-secondary px-7 py-3",
    variant === "ghost" && "text-[#94A3B8] hover:text-[#F8FAFC] px-3 py-2",
    className
  )

  if (href) {
    const kind = getLinkKind(href)
    const mode = kind === "external" || kind === "download" ? "external" : cursorMode

    const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (shouldSmoothScrollHash(href, pathname)) {
        e.preventDefault()
        scrollToSection(href)
        window.history.pushState(null, "", href)
      }
    }

    if (kind === "external" || kind === "download") {
      return (
        <a
          href={href}
          target={target ?? (kind === "external" ? "_blank" : undefined)}
          rel={rel ?? (kind === "external" ? "noopener noreferrer" : undefined)}
          data-cursor={mode}
          data-cursor-magnetic
          {...(cursorLabel ? { "data-cursor-label": cursorLabel } : {})}
          data-cursor-arrow="true"
          className={base}
        >
          {children}
        </a>
      )
    }

    const linkHref = kind === "hash" ? resolveNavHref(href, pathname) : href
    const isContact = href.includes("contact")

    return (
      <Link
        href={linkHref}
        target={target}
        rel={rel}
        data-cursor={isContact ? "contact" : cursorMode}
        data-cursor-magnetic
        {...(cursorLabel ? { "data-cursor-label": cursorLabel } : {})}
        onClick={kind === "hash" ? handleLinkClick : undefined}
        className={base}
      >
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} {...cursorProps} className={base}>
      {children}
    </button>
  )
}
