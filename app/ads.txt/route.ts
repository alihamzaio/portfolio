import { NextResponse } from "next/server"
import { getAdSensePublisherId } from "@/lib/adsense"

/**
 * AdSense site verification / crawler file.
 * https://support.google.com/adsense/answer/12171612
 *
 * Format must be: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
 * (publisher id WITHOUT the "ca-" prefix used in pagead client=).
 */
export function GET() {
  const pub = getAdSensePublisherId()
  const lines = [
    "# ads.txt for alihamza portfolio",
    pub
      ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0`
      : "# Set NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-…) to enable Google AdSense entry",
    "",
  ]
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
