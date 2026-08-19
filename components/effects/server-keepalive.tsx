"use client"

import { useEffect } from "react"

const PING_MS = 4 * 60 * 1000

/** Pings the app so a free/idle host does not spin down while a visitor is on the site. */
export function ServerKeepAlive() {
  useEffect(() => {
    const ping = () => {
      void fetch("/api/health", { method: "HEAD", cache: "no-store" }).catch(() => undefined)
    }
    ping()
    const id = window.setInterval(ping, PING_MS)
    return () => window.clearInterval(id)
  }, [])

  return null
}
