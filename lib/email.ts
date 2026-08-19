import { getAdminEmail } from "./auth"
import { getResendApiKey, getResendFromEmail } from "./env-server"
import { OTP_ADMIN_EMAIL } from "./official-email"

function parseResendError(body: string): string {
  try {
    const data = JSON.parse(body) as { message?: string; name?: string }
    const msg = data.message || data.name || body

    if (/only send testing emails to your own/i.test(msg)) {
      return `Resend test mode: OTP can only go to the Gmail you used at resend.com. Either verify a domain, or make sure the OTP inbox is ${OTP_ADMIN_EMAIL}.`
    }
    if (/invalid api key/i.test(msg) || /unauthorized/i.test(msg)) {
      return "Invalid RESEND_API_KEY. Add a live key in Vercel env (RESEND_API_KEY) and redeploy."
    }
    if (/from/i.test(msg) && /domain/i.test(msg)) {
      return "Invalid RESEND_FROM_EMAIL. For testing use onboarding@resend.dev, or verify your domain in Resend first."
    }
    return msg
  } catch {
    return body || "Failed to send email"
  }
}

async function postResend(payload: unknown, apiKey: string): Promise<Response> {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
}

/** Sends OTP only — recipient is always OTP_ADMIN_EMAIL regardless of request body. */
export async function sendOtpEmail(
  _to: string,
  code: string
): Promise<{ ok: boolean; error?: string; devCode?: string }> {
  const apiKey = getResendApiKey()
  const fromRaw = getResendFromEmail()
  const from = fromRaw.includes("<") ? fromRaw : `Portfolio Admin <${fromRaw}>`
  const to = OTP_ADMIN_EMAIL

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info(`[DEV OTP] ${code} -> ${to}`)
      return { ok: true, devCode: code }
    }
    return {
      ok: false,
      error:
        "RESEND_API_KEY is missing on the server. Add it in Vercel Project Settings → Environment Variables, then redeploy.",
    }
  }

  const payload = {
    from,
    to: [to],
    subject: `${code} is your admin login code`,
    text: `Your portfolio admin login code is ${code}. It expires in 10 minutes.`,
    html: `
        <div style="font-family: Inter, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <p style="color: #64748b; font-size: 14px;">Portfolio admin login</p>
          <h1 style="font-size: 32px; letter-spacing: 8px; color: #0f172a; margin: 24px 0;">${code}</h1>
          <p style="color: #64748b; font-size: 14px;">This code expires in <strong>10 minutes</strong>. If you didn't request this, ignore this email.</p>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">Sent to ${getAdminEmail()}</p>
        </div>
      `,
  }

  let res: Response
  try {
    res = await postResend(payload, apiKey)
    if (!res.ok) {
      await new Promise((r) => setTimeout(r, 400))
      res = await postResend(payload, apiKey)
    }
  } catch {
    return { ok: false, error: "Could not reach Resend. The server may be waking up. Wait 10 seconds and try again." }
  }

  if (!res.ok) {
    const errText = await res.text()
    console.error("[otp-email] Resend error", res.status, errText)
    return { ok: false, error: parseResendError(errText) }
  }

  return { ok: true }
}
