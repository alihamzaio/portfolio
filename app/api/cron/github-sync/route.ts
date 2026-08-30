import { NextRequest, NextResponse } from "next/server"
import { runBatchGitHubSync } from "@/lib/github-batch-sync"

export const dynamic = "force-dynamic"
export const maxDuration = 60

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return process.env.NODE_ENV !== "production"
  const header = req.headers.get("authorization")
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : ""
  const query = req.nextUrl.searchParams.get("secret")
  return bearer === secret || query === secret
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
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
