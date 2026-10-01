"use client"

import { useEffect, useRef } from "react"
import { getAdSenseClient, isAdSenseConfigured } from "@/lib/adsense"
import { cn } from "@/lib/utils"

type Props = {
  slot?: string
  className?: string
  format?: "auto" | "rectangle"
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[]
  }
}

/**
 * Blog-only ad unit. No-op until NEXT_PUBLIC_ADSENSE_CLIENT is set on Vercel.
 */
export function AdSenseUnit({ slot, className, format = "auto" }: Props) {
  const pushed = useRef(false)
  const client = getAdSenseClient()
  const unitSlot = (slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT || "").trim()

  useEffect(() => {
    if (!isAdSenseConfigured() || pushed.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      // Ad blockers / script not ready
    }
  }, [])

  if (!isAdSenseConfigured()) return null

  return (
    <div
      className={cn(
        "my-8 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 py-3",
        className
      )}
      aria-label="Sponsored"
    >
      <p className="mb-2 text-center text-[10px] uppercase tracking-wider text-neutral-600">
        Sponsored
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: format === "rectangle" ? 250 : 90 }}
        data-ad-client={client}
        data-ad-slot={unitSlot || undefined}
        data-ad-format={format === "auto" ? "auto" : "rectangle"}
        data-full-width-responsive="true"
      />
    </div>
  )
}
