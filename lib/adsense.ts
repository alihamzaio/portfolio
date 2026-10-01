/** Google AdSense publisher id helpers (safe on server + client). */

/** Public publisher ID (also published via ads.txt). Override with env if needed. */
const DEFAULT_ADSENSE_CLIENT = "ca-pub-6403279914866695"

export function getAdSenseClient(): string {
  const client = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT || DEFAULT_ADSENSE_CLIENT).trim()
  return /^ca-pub-\d+$/i.test(client) ? client : ""
}

export function isAdSenseConfigured(): boolean {
  return Boolean(getAdSenseClient())
}
