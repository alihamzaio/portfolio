import { NextRequest, NextResponse } from "next/server"
import {
  OTP_COOKIE_NAME,
  createSession,
  isAllowedAdminEmail,
  verifyOtp,
  verifyOtpCookie,
} from "@/lib/auth"

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

    const cookieValue = req.cookies.get(OTP_COOKIE_NAME)?.value
    const valid = verifyOtpCookie(normalized, String(code), cookieValue) || (await verifyOtp(normalized, String(code)))
    if (!valid) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 })
    }

    const session = await createSession(normalized)
    const res = NextResponse.json({
      ok: true,
      token: session.token,
      expiresAt: session.expiresAt,
      email: normalized,
    })
    res.cookies.set({
      name: OTP_COOKIE_NAME,
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0,
    })
    return res
  } catch (err) {
    console.error("[verify-otp]", err)
    return NextResponse.json({ error: err instanceof Error ? err.message : "Could not verify code" }, { status: 500 })
  }
}
