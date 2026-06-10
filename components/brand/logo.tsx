"use client"

import { cn } from "@/lib/utils"

interface LogoMarkProps {
  size?: number
  className?: string
  animated?: boolean
  /** Stable SVG id suffix when multiple logos render on one page */
  instanceId?: string
}

/**
 * AH monogram for Ali Hamza — A has apex + crossbar (not N-shaped).
 * Cyan dot = status accent on the badge corner, not part of the letterforms.
 */
export function LogoMark({ size = 40, className, animated = false, instanceId = "default" }: LogoMarkProps) {
  const grad = `ah-logo-grad-${instanceId}`
  const bg = `ah-logo-bg-${instanceId}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn(animated && "logo-pulse", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={grad} x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DD3FC" />
          <stop offset="0.45" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id={bg} x1="24" y1="0" x2="24" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e293b" />
          <stop offset="1" stopColor="#0a0f1a" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill={`url(#${bg})`} />
      <rect
        x="1"
        y="1"
        width="46"
        height="46"
        rx="12"
        stroke={`url(#${grad})`}
        strokeOpacity="0.55"
        strokeWidth="1.25"
      />

      {/* A — left leg, right leg, horizontal crossbar */}
      <path
        d="M9 33.5 L16.5 13.5 L24 33.5"
        stroke={`url(#${grad})`}
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 25 H22"
        stroke={`url(#${grad})`}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* H */}
      <path
        d="M27 13.5 V33.5 M27 23 H37 M37 13.5 V33.5"
        stroke={`url(#${grad})`}
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Online accent — corner of badge, not on the H */}
      <circle
        cx="39"
        cy="9"
        r="2.25"
        fill="#22D3EE"
        className={animated ? "logo-dot" : undefined}
      />
    </svg>
  )
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
  size = 40,
  className,
  animated,
  instanceId = "default",
}: LogoProps) {
  const first = name.split(" ")[0]

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark size={size} animated={animated} instanceId={instanceId} />
      {showName && (
        <span className="logo-name flex flex-col leading-none min-w-0">
          <span className="text-[15px] font-bold tracking-tight text-[#F8FAFC] truncate">{first}</span>
          <span className="text-[10px] font-mono text-[#64748B] mt-1 tracking-wide uppercase">Developer</span>
        </span>
      )}
    </span>
  )
}
