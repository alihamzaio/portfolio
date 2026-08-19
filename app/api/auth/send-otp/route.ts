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
    let email = ""
    try {
      const body = await req.json()
      email = typeof body?.email === "string" ? body.email : ""
    } catch {
      email = ""
    }

    const normalized = email.toLowerCase().trim() || getAdminEmail()
    if (!isAllowedAdminEmail(normalized)) {
      return NextResponse.json(
        { error: "This email is not authorized for admin access." },
        { status: 403 }
      )
    }

    let code = ""
    let expiresAt = Date.now() + 10 * 60 * 1000
    try {
      const result = await createAndStoreOtp(normalized)
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 429 })
      }
      code = result.code
      expiresAt = result.expiresAt
    } catch (storeErr) {
      console.error("[send-otp] store", storeErr)
      const { randomInt } = await import("crypto")
      code = String(randomInt(100000, 999999))
    }

    const sent = await sendOtpEmail(normalized, code)
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
      expiresAt,
      ...(sent.devCode
        ? { devCode: sent.devCode, devNote: "RESEND_API_KEY not set - use code from the UI or server console" }
        : {}),
    })

    try {
      res.cookies.set({
        name: OTP_COOKIE_NAME,
        value: createOtpCookie(normalized, code, expiresAt),
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 10 * 60,
      })
    } catch (cookieErr) {
      console.error("[send-otp] cookie", cookieErr)
    }

    return res
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send OTP"
    console.error("[send-otp]", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
