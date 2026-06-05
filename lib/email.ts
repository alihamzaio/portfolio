import { getAdminEmail } from "./auth"
import { getResendApiKey, getResendFromEmail } from "./env-server"
import { OTP_ADMIN_EMAIL } from "./official-email"

function parseResendError(body: string): string {
  try {
    const data = JSON.parse(body) as { message?: string; name?: string }
    const msg = data.message || data.name || body

    if (/only send testing emails to your own/i.test(msg)) {
      return `Resend test mode: OTP emails can only be sent to the Gmail address you used to sign up at resend.com (${OTP_ADMIN_EMAIL}).`
    }
    if (/invalid api key/i.test(msg) || /unauthorized/i.test(msg)) {
      return "Invalid RESEND_API_KEY. Copy a new key from resend.com → API Keys, add it to .env, then restart the dev server."
    }
    if (/from/i.test(msg) && /domain/i.test(msg)) {
      return "Invalid RESEND_FROM_EMAIL. For testing use onboarding@resend.dev, or verify your domain in Resend first."
    }
    return msg
  } catch {
    return body || "Failed to send email"
  }
}

/** Sends OTP only — recipient is always OTP_ADMIN_EMAIL regardless of request body. */
export async function sendOtpEmail(_to: string, code: string): Promise<{ ok: boolean; error?: string; devCode?: string }> {
  const apiKey = getResendApiKey()
  const fromRaw = getResendFromEmail()
  const from = fromRaw.includes("<") ? fromRaw : `Portfolio Admin <${fromRaw}>`
  const to = OTP_ADMIN_EMAIL

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV OTP] Email: ${to} | Code: ${code}`)
      return { ok: true, devCode: code }
    }
    return {
      ok: false,
      error:
        "RESEND_API_KEY is missing in .env (use this exact name — not NEXT_PUBLIC_RESEND_API_KEY). Restart the dev server after saving .env.",
    }
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
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
    const errText = await res.text()
    const error = parseResendError(errText)
    console.error("[Resend]", res.status, error)
    return { ok: false, error }
  }

  return { ok: true }
}
