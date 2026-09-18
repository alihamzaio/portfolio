import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { dispatchYtWorkflow, type DispatchWorkflow } from "@/lib/yt-auto-ops"

export const runtime = "nodejs"

const ALLOWED: DispatchWorkflow[] = ["daily_short", "weekly_long", "session_keepalive"]

/** Admin: manually trigger yt-auto-studio workflows. */
export async function POST(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const workflow = String(body.workflow || "").trim() as DispatchWorkflow
  if (!ALLOWED.includes(workflow)) {
    return NextResponse.json(
      { error: "workflow must be daily_short, weekly_long, or session_keepalive" },
      { status: 400 }
    )
  }
  const topic = String(body.topic || "").trim()
  const inputs = topic && workflow === "daily_short" ? { topic } : undefined
  const result = await dispatchYtWorkflow(workflow, inputs)
  if (!result.ok) {
    return NextResponse.json({ error: result.error || "Dispatch failed" }, { status: 502 })
  }
  return NextResponse.json({
    ok: true,
    message: `Triggered ${workflow}. Check Actions in about 10 seconds.`,
    actionsUrl: `https://github.com/alihamzaio/yt-auto-studio/actions`,
  })
}
