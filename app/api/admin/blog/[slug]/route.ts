import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { deleteBlogPullRequest } from "@/lib/blog-github"

export const runtime = "nodejs"

type Ctx = { params: Promise<{ slug: string }> }

/**
 * DELETE /api/admin/blog/[slug]
 * Query: ?autoMerge=false to leave PR open
 */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug } = await ctx.params
  const autoMerge = req.nextUrl.searchParams.get("autoMerge") !== "false"

  try {
    const result = await deleteBlogPullRequest(slug, autoMerge)
    return NextResponse.json(result)
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    const status = message.includes("No blog file") ? 404 : 500
    return NextResponse.json({ ok: false, error: message }, { status })
  }
}
