"use client"

import type { ComponentProps, MouseEvent, ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  getLinkKind,
  isHttpUrl,
  resolveNavHref,
  scrollToSection,
  shouldSmoothScrollHash,
} from "@/lib/navigation"

type SmartLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string
  children: ReactNode
  className?: string
  target?: string
  rel?: string
}

export function SmartLink({
  href,
  children,
  className,
  onClick,
  target,
  rel,
  ...rest
}: SmartLinkProps) {
  const pathname = usePathname()
  const kind = getLinkKind(href)

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (shouldSmoothScrollHash(href, pathname)) {
      e.preventDefault()
      scrollToSection(href)
      window.history.pushState(null, "", href)
    }
    onClick?.(e as MouseEvent<HTMLAnchorElement>)
  }

  if (kind === "external" || kind === "download") {
    const offsite = isHttpUrl(href)
    return (
      <a
        href={href}
        className={className}
        target={target ?? (offsite ? "_blank" : undefined)}
        rel={rel ?? (offsite ? "noopener noreferrer" : undefined)}
        onClick={onClick}
      >
        {children}
      </a>
    )
  }

  const linkHref = kind === "hash" ? resolveNavHref(href, pathname) : href

  return (
    <Link
      href={linkHref}
      className={className}
      onClick={kind === "hash" ? handleClick : onClick}
      {...rest}
    >
      {children}
    </Link>
  )
}
