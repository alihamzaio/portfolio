/** Google AdSense publisher id helpers (safe on server + client). */

/** Public publisher ID (HTML client=ca-pub-… ; ads.txt uses pub-… without "ca-"). */
const DEFAULT_ADSENSE_CLIENT = "ca-pub-6403279914866695"

export function getAdSenseClient(): string {
  const client = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT || DEFAULT_ADSENSE_CLIENT).trim()
  return /^ca-pub-\d+$/i.test(client) ? client : ""
}

/** ads.txt seller id must be pub-… (not ca-pub-…). */
export function getAdSensePublisherId(): string {
  const client = getAdSenseClient()
  if (!client) return ""
  return client.replace(/^ca-/i, "")
}

export function getAdSenseSlot(): string {
  return (process.env.NEXT_PUBLIC_ADSENSE_SLOT || "").trim()
}

export function isAdSenseConfigured(): boolean {
  return Boolean(getAdSenseClient())
}

/** Display units need a real ad unit slot from AdSense → Ads → By ad unit. */
export function isAdSenseDisplayReady(): boolean {
  return isAdSenseConfigured() && /^\d{8,}$/.test(getAdSenseSlot())
}
