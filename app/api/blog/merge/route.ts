import { NextRequest, NextResponse } from "next/server"
import { requireBlogIngestAuth } from "@/lib/blog-auth"
import { mergeBlogPullRequest } from "@/lib/blog-github"

export const runtime = "nodejs"

/**
 * Call 2 — merge the blog PR into main (triggers Vercel deploy).
 *
 * POST /api/blog/merge
 * Authorization: Bearer <BLOG_INGEST_SECRET or ADMIN_TOKEN>
 * Body: { prNumber: number, commitTitle?: string }
 */
export async function POST(req: NextRequest) {
  if (!(await requireBlogIngestAuth(req))) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  let body: { prNumber?: number; commitTitle?: string }
  try {
    body = (await req.json()) as { prNumber?: number; commitTitle?: string }
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 })
  }

  const prNumber = Number(body.prNumber)
  if (!Number.isFinite(prNumber) || prNumber < 1) {
    return NextResponse.json({ ok: false, error: "prNumber is required" }, { status: 400 })
  }

  try {
    const result = await mergeBlogPullRequest(prNumber, body.commitTitle)
    return NextResponse.json(result)
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
