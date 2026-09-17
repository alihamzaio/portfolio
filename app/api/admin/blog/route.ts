import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { getAllBlogPostsAdmin } from "@/lib/blog"
import { createBlogPullRequest, type BlogIngestInput } from "@/lib/blog-github"

export const runtime = "nodejs"

/**
 * GET  /api/admin/blog — list drafts + published
 * POST /api/admin/blog — create/update via PR (+ merge by default)
 * Body: BlogIngestInput + { status?: "draft"|"published", autoMerge?: boolean }
 */
export async function GET(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const posts = await getAllBlogPostsAdmin()
  return NextResponse.json({ posts })
}

export async function POST(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: BlogIngestInput
  try {
    body = (await req.json()) as BlogIngestInput
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  try {
    const result = await createBlogPullRequest({
      ...body,
      source: body.source || "admin",
      // Admin saves auto-merge by default (same one-call flow as automation)
      autoMerge: body.autoMerge !== false,
    })
    return NextResponse.json(result)
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
