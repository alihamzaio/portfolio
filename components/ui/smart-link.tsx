"use client"

import type { ComponentProps, MouseEvent, ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  getLinkKind,
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
    return (
      <a href={href} className={className} target={target} rel={rel} onClick={onClick}>
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
