import { NextRequest, NextResponse } from "next/server"
import { isCronAuthorized } from "@/lib/cron-auth"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    ok: true,
    awake: true,
    ts: new Date().toISOString(),
  })
}

export async function POST(req: NextRequest) {
  return GET(req)
}
