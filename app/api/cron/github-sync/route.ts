import { NextRequest, NextResponse } from "next/server"
import { isCronAuthorized } from "@/lib/cron-auth"
import { runBatchGitHubSync } from "@/lib/github-batch-sync"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  const result = await runBatchGitHubSync()
  return NextResponse.json({
    ok: result.ok,
    changed: result.changed,
    prUrl: result.prUrl,
    skipped: result.skipped,
    error: result.error,
    ts: new Date().toISOString(),
  })
}

export async function POST(req: NextRequest) {
  return GET(req)
}
