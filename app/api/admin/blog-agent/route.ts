import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import {
  getBlogAgentState,
  runBlogAgent,
  saveBlogAgentState,
  type BlogAgentState,
} from "@/lib/blog-agent"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const state = await getBlogAgentState()
  return NextResponse.json({
    state,
    groqConfigured: Boolean(process.env.GROQ_API_KEY?.trim()),
  })
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as Partial<BlogAgentState> | null
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 })

  const current = await getBlogAgentState()
  const next: BlogAgentState = {
    ...current,
    enabled: body.enabled ?? current.enabled,
    publishWeekdaysUtc: Array.isArray(body.publishWeekdaysUtc)
      ? body.publishWeekdaysUtc.map(Number).filter((n) => n >= 0 && n <= 6)
      : current.publishWeekdaysUtc,
    maxRetries: body.maxRetries ?? current.maxRetries,
    pillars: Array.isArray(body.pillars)
      ? body.pillars.map(String).filter(Boolean)
      : current.pillars,
    runs: current.runs,
  }

  await saveBlogAgentState(next)
  return NextResponse.json({ ok: true, state: next })
}

export async function POST(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await req.json().catch(() => ({}))) as {
    force?: boolean
    retryId?: string
  }

  const result = await runBlogAgent({
    force: Boolean(body.force),
    retryId: body.retryId,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
