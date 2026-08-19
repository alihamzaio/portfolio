import { NextRequest, NextResponse } from "next/server"
import {
  OTP_COOKIE_NAME,
  createAndStoreOtp,
  createOtpCookie,
  getAdminEmail,
  isAllowedAdminEmail,
} from "@/lib/auth"
import { sendOtpEmail } from "@/lib/email"
import { getResendConfigStatus } from "@/lib/env-server"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const normalized = email.toLowerCase().trim()
    if (!isAllowedAdminEmail(normalized)) {
      return NextResponse.json(
        { error: "This email is not authorized for admin access." },
        { status: 403 }
      )
    }

    const result = await createAndStoreOtp(normalized)
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 429 })
    }

    const sent = await sendOtpEmail(normalized, result.code)
    if (!sent.ok) {
      const cfg = getResendConfigStatus()
      return NextResponse.json(
        {
          error: sent.error || "Failed to send OTP. Check Resend dashboard and Vercel env vars.",
          hint: !cfg.hasApiKey
            ? "RESEND_API_KEY is not set on Vercel. Add it and redeploy."
            : undefined,
        },
        { status: 500 }
      )
    }

    const res = NextResponse.json({
      ok: true,
      message: `OTP sent to ${getAdminEmail()}`,
      expiresAt: result.expiresAt,
      ...(sent.devCode
        ? { devCode: sent.devCode, devNote: "RESEND_API_KEY not set - use code from the UI or server console" }
        : {}),
    })

    res.cookies.set({
      name: OTP_COOKIE_NAME,
      value: createOtpCookie(normalized, result.code, result.expiresAt),
      httpOnly: true,
      secure: process.env.VERCEL === "1" || process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    })

    return res
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send OTP"
    console.error("[send-otp]", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
