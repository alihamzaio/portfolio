import { getAdminEmail } from "./auth"
import { getResendApiKey, getResendFromEmail } from "./env-server"

function parseResendError(body: string): string {
  try {
    const data = JSON.parse(body) as { message?: string; name?: string }
    const msg = data.message || data.name || body

    if (/only send testing emails to your own/i.test(msg)) {
      return `Resend test mode: emails can only be sent to the Gmail address you used to sign up at resend.com. Set ADMIN_EMAIL to that exact address, or verify a domain in Resend and use a custom RESEND_FROM_EMAIL.`
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

export async function sendOtpEmail(to: string, code: string): Promise<{ ok: boolean; error?: string; devCode?: string }> {
  const apiKey = getResendApiKey()
  const fromRaw = getResendFromEmail()
  const from = fromRaw.includes("<") ? fromRaw : `Portfolio Admin <${fromRaw}>`

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
