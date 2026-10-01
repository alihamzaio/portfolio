import Script from "next/script"
import { getAdSenseClient, isAdSenseConfigured } from "@/lib/adsense"

export { getAdSenseClient, isAdSenseConfigured }

/**
 * AdSense loader in <head> (required for site ownership verify).
 * Units only render on blog pages via AdSenseUnit.
 */
export function AdSenseScript() {
  const client = getAdSenseClient()
  if (!isAdSenseConfigured() || !client) return null
  return (
    <Script
      id="adsense-loader"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="beforeInteractive"
    />
  )
}
