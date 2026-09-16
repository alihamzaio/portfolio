import type { NextRequest } from "next/server"
import { requireAdminAuth } from "@/lib/admin"

/**
 * Auth for yt-auto-studio → portfolio blog ingest.
 * Accepts: BLOG_INGEST_SECRET, ADMIN_TOKEN, or admin session.
 */
export async function requireBlogIngestAuth(req: NextRequest): Promise<boolean> {
  const header = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() || ""
  const ingest = process.env.BLOG_INGEST_SECRET?.trim()
  if (ingest && header && header === ingest) return true
  return requireAdminAuth(req)
}
