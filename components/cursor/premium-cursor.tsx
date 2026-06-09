"use client"

import { useEffect, useRef } from "react"
import { createCursorEngine } from "@/lib/cursor/engine"
import { prefersFinePointer, prefersReducedMotion } from "@/lib/motion-prefs"

export function PremiumCursor() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!prefersFinePointer() || prefersReducedMotion()) return
    const root = rootRef.current
    if (!root) return
    return createCursorEngine(root)
  }, [])

  return (
    <div
      ref={rootRef}
      className="pc"
      data-mode="default"
      data-theme="dark"
      aria-hidden="true"
    >
      <div className="pc__glow" data-pc-glow />
      <div className="pc__ring" data-pc-ring />
      <div className="pc__dot" data-pc-dot />
      <div className="pc__label" data-pc-label>
        <span className="pc__label-text" data-pc-label-text />
        <span className="pc__label-arrow" data-pc-label-arrow aria-hidden>
          ↗
        </span>
      </div>
    </div>
  )
}
