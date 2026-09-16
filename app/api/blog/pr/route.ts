import { NextRequest, NextResponse } from "next/server"
import { requireBlogIngestAuth } from "@/lib/blog-auth"
import { createBlogPullRequest, type BlogIngestInput } from "@/lib/blog-github"

export const runtime = "nodejs"

/**
 * Call 1 — create a GitHub PR that adds content/blog/{slug}.json
 *
 * POST /api/blog/pr
 * Authorization: Bearer <BLOG_INGEST_SECRET or ADMIN_TOKEN>
 * Body: { title, body, excerpt?, category?, slug?, youtubeUrl?, youtubeId?, autoMerge? }
 */
export async function POST(req: NextRequest) {
  if (!(await requireBlogIngestAuth(req))) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  let body: BlogIngestInput
  try {
    body = (await req.json()) as BlogIngestInput
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 })
  }

  try {
    const result = await createBlogPullRequest(body)
    return NextResponse.json(result)
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
