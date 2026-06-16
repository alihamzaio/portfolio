"use client"

import { useEffect, useState, type ComponentType } from "react"

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]"
}

export function AnalyticsDeferred() {
  const [Analytics, setAnalytics] = useState<ComponentType | null>(null)

  useEffect(() => {
    if (isLocalHost(window.location.hostname)) return
    let cancelled = false
    import("@vercel/analytics/next").then((mod) => {
      if (!cancelled) setAnalytics(() => mod.Analytics)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!Analytics) return null
  return <Analytics />
}
