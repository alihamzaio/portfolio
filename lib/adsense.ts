/** Google AdSense publisher id helpers (safe on server + client). */

export function getAdSenseClient(): string {
  const client = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "").trim()
  return /^ca-pub-\d+$/i.test(client) ? client : ""
}

export function isAdSenseConfigured(): boolean {
  return Boolean(getAdSenseClient())
}
