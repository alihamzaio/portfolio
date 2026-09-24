import { NextRequest, NextResponse } from "next/server"
import { isCronAuthorized } from "@/lib/cron-auth"
import { runBlogAgent } from "@/lib/blog-agent"

export const dynamic = "force-dynamic"
export const maxDuration = 300

export async function GET(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  const force = req.nextUrl.searchParams.get("force") === "1"
  const retryId = req.nextUrl.searchParams.get("retryId") || undefined
  const result = await runBlogAgent({ force, retryId })

  return NextResponse.json({
    ok: result.ok,
    action: result.action,
    run: result.run,
    ts: new Date().toISOString(),
  })
}

export async function POST(req: NextRequest) {
  return GET(req)
}
