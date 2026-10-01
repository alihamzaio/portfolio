import { NextResponse } from "next/server"
import { getAdSenseClient } from "@/lib/adsense"

/**
 * AdSense site verification / crawler file.
 * https://support.google.com/adsense/answer/12171612
 * Populates when NEXT_PUBLIC_ADSENSE_CLIENT is set.
 */
export function GET() {
  const client = getAdSenseClient()
  const lines = [
    "# ads.txt for alihamza portfolio",
    client ? `google.com, ${client}, DIRECT, f08c47fec0942fa0` : "# Set NEXT_PUBLIC_ADSENSE_CLIENT to enable Google AdSense entry",
    "",
  ]
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
