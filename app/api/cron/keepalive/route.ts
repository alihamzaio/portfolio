import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return true
  const header = req.headers.get("authorization")
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : ""
  const query = req.nextUrl.searchParams.get("secret")
  return bearer === secret || query === secret
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
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
