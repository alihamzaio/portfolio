import { NextRequest, NextResponse } from "next/server"
import { createAndStoreOtp, getAdminEmail, isAllowedAdminEmail } from "@/lib/auth"
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
          error: sent.error || "Failed to send OTP. Check server logs and Resend dashboard.",
          hint: !cfg.hasApiKey
            ? "RESEND_API_KEY not loaded. Use .env (not NEXT_PUBLIC_) and restart pnpm dev."
            : undefined,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: `OTP sent to ${getAdminEmail()}`,
      expiresAt: result.expiresAt,
      ...(sent.devCode ? { devCode: sent.devCode, devNote: "RESEND_API_KEY not set — use code from server console" } : {}),
    })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
