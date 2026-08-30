"use client"

import { BrandMark } from "@/components/brand/brand-mark"
import { cn } from "@/lib/utils"

interface LogoMarkProps {
  size?: number
  className?: string
  animated?: boolean
  instanceId?: string
}

export function LogoMark({ size = 34, className }: LogoMarkProps) {
  return <BrandMark size={size} className={className} weight="nav" />
}

interface LogoProps {
  name?: string
  showName?: boolean
  size?: number
  className?: string
  animated?: boolean
  instanceId?: string
}

export function Logo({
  name = "Ali Hamza",
  showName = true,
  size = 34,
  className,
}: LogoProps) {
  const parts = name.trim().split(/\s+/)
  const first = parts[0] ?? "Ali"
  const rest = parts.slice(1).join(" ")

  return (
    <span className={cn("logo-brand inline-flex items-center gap-3.5 min-w-0", className)}>
      <LogoMark size={size} />
      {showName && (
        <span className="logo-wordmark min-w-0" aria-label={name}>
          <span className="logo-wordmark-stack block leading-none">
            <span className="logo-wordmark-first">{first}</span>
            {rest ? <span className="logo-wordmark-line">{rest}</span> : null}
          </span>
        </span>
      )}
    </span>
  )
}
