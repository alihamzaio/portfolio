import { getAdSenseClient, isAdSenseConfigured } from "@/lib/adsense"

export { getAdSenseClient, isAdSenseConfigured }

/**
 * Raw head script so AdSense ownership crawler finds the exact snippet.
 * Units only mount on blog pages via AdSenseUnit.
 */
export function AdSenseScript() {
  const client = getAdSenseClient()
  if (!isAdSenseConfigured() || !client) return null
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  )
}
