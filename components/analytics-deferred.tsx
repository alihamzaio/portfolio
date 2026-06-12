"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const Analytics = dynamic(
  () => import("@vercel/analytics/next").then((m) => m.Analytics),
  { ssr: false }
)

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]"
}

export function AnalyticsDeferred() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!isLocalHost(window.location.hostname)) {
      setEnabled(true)
    }
  }, [])

  if (!enabled) return null
  return <Analytics />
}
