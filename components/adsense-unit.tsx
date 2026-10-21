"use client"

import { useEffect, useRef } from "react"
import {
  getAdSenseClient,
  getAdSenseSlot,
  isAdSenseDisplayReady,
} from "@/lib/adsense"
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
 * Blog display ad unit.
 * Renders only when NEXT_PUBLIC_ADSENSE_SLOT is a real AdSense ad-unit id.
 * Without a slot, Google shows "This content is blocked" — so we hide the shell.
 * Page-level Auto ads still load from <AdSenseScript /> in the root layout.
 */
export function AdSenseUnit({ slot, className, format = "auto" }: Props) {
  const pushed = useRef(false)
  const client = getAdSenseClient()
  const unitSlot = (slot || getAdSenseSlot()).trim()
  const ready = Boolean(client) && /^\d{8,}$/.test(unitSlot)

  useEffect(() => {
    if (!ready || pushed.current) return

    const push = () => {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        pushed.current = true
      } catch {
        // Ad blockers / script not ready
      }
    }

    // Wait for the async AdSense script if it has not loaded yet.
    const existing = document.querySelector(
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    ) as HTMLScriptElement | null
    if (existing && !(window as unknown as { adsbygoogle?: unknown }).adsbygoogle) {
      existing.addEventListener("load", push, { once: true })
      const t = window.setTimeout(push, 2500)
      return () => {
        existing.removeEventListener("load", push)
        window.clearTimeout(t)
      }
    }
    push()
  }, [ready])

  if (!isAdSenseDisplayReady() && !ready) return null
  if (!ready) return null

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
        data-ad-slot={unitSlot}
        data-ad-format={format === "auto" ? "auto" : "rectangle"}
        data-full-width-responsive="true"
      />
    </div>
  )
}
