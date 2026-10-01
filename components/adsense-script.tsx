import Script from "next/script"
import { getAdSenseClient, isAdSenseConfigured } from "@/lib/adsense"

export { getAdSenseClient, isAdSenseConfigured }

/**
 * Load AdSense once from root layout. Units only mount on blog pages.
 * Requires NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXX on Vercel.
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
      strategy="lazyOnload"
    />
  )
}
