import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/**
 * TikTok OAuth bounce: registered HTTPS redirect_uri forwards to local
 * Desktop callback used by yt-auto-studio setup_tiktok_oauth.py.
 */
export async function GET(request: NextRequest) {
  const incoming = request.nextUrl.searchParams
  const target = new URL("http://127.0.0.1:8080/callback/")
  incoming.forEach((value, key) => {
    target.searchParams.set(key, value)
  })
  return NextResponse.redirect(target, 302)
}
