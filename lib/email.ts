import { getAdminEmail } from "./auth"

export async function sendOtpEmail(to: string, code: string): Promise<{ ok: boolean; error?: string; devCode?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"
  const appName = process.env.NEXT_PUBLIC_SITE_NAME || "Portfolio Admin"

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV OTP] Email: ${to} | Code: ${code}`)
      return { ok: true, devCode: code }
    }
    return {
      ok: false,
      error: "RESEND_API_KEY is not configured. Add it to .env.local (free tier at resend.com).",
    }
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${appName} <${from}>`,
      to: [to],
      subject: `${code} — Your admin login code`,
      html: `
        <div style="font-family: Inter, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <p style="color: #64748b; font-size: 14px;">Portfolio admin login</p>
          <h1 style="font-size: 32px; letter-spacing: 8px; color: #0f172a; margin: 24px 0;">${code}</h1>
          <p style="color: #64748b; font-size: 14px;">This code expires in <strong>10 minutes</strong>. If you didn't request this, ignore this email.</p>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">Sent to ${getAdminEmail()}</p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return { ok: false, error: err || "Failed to send email" }
  }

  return { ok: true }
}
