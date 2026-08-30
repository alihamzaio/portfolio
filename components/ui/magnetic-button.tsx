"use client"

import { type ReactNode, type MouseEvent } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  getLinkKind,
  isHttpUrl,
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
    variant === "primary" && "btn-primary",
    variant === "secondary" && "btn-secondary",
    variant === "ghost" && "btn-ghost",
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
      const offsite = isHttpUrl(href)
      return (
        <a
          href={href}
          target={target ?? (offsite ? "_blank" : undefined)}
          rel={rel ?? (offsite ? "noopener noreferrer" : undefined)}
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
