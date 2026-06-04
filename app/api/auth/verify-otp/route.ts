import { NextRequest, NextResponse } from "next/server"
import { createSession, isAllowedAdminEmail, verifyOtp } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json()
    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 })
    }

    const normalized = email.toLowerCase().trim()
    if (!isAllowedAdminEmail(normalized)) {
      return NextResponse.json({ error: "Unauthorized email" }, { status: 403 })
    }

    const valid = await verifyOtp(normalized, String(code))
    if (!valid) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 })
    }

    const session = await createSession(normalized)
    return NextResponse.json({
      ok: true,
      token: session.token,
      expiresAt: session.expiresAt,
      email: normalized,
    })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
