import type { NextRequest } from "next/server"

/** Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` when CRON_SECRET is set. */
export function isCronAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return process.env.NODE_ENV !== "production"

  const authHeader = req.headers.get("authorization")
  if (authHeader === `Bearer ${secret}`) return true

  const query = req.nextUrl.searchParams.get("secret")
  return query === secret
}
