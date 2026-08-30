import { NextRequest, NextResponse } from "next/server"
import {
  SESSION_COOKIE_NAME,
  applySessionCookie,
  clearSessionCookie,
  readSessionPayload,
  revokeSession,
  verifySession,
} from "@/lib/auth"
import { getAdminTokenFromRequest } from "@/lib/admin"

export async function GET(req: NextRequest) {
  const header = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() || null
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value || null
  const token =
    (header && (await verifySession(header)) ? header : null) ||
    (cookie && (await verifySession(cookie)) ? cookie : null)

  if (!token) {
    return NextResponse.json({ valid: false })
  }

  const payload = readSessionPayload(token)
  const res = NextResponse.json({
    valid: true,
    token,
    email: payload?.email || null,
    expiresAt: payload?.exp || null,
  })
  if (payload) applySessionCookie(res, token, payload.exp)
  return res
}

export async function DELETE(req: NextRequest) {
  const token = getAdminTokenFromRequest(req)
  if (token) await revokeSession(token)
  const res = NextResponse.json({ ok: true })
  clearSessionCookie(res)
  return res
}
