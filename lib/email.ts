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

async function sendResendEmail(input: {
  to: string | string[]
  subject: string
  text: string
  html: string
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = getResendApiKey()
  const fromRaw = getResendFromEmail()
  const from = fromRaw.includes("<") ? fromRaw : `Ali Hamza <${fromRaw}>`
  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info(`[DEV EMAIL] to=${JSON.stringify(input.to)} subject=${input.subject}`)
      console.info(input.text)
      return { ok: true }
    }
    return {
      ok: false,
      error: "RESEND_API_KEY is missing. Add it in Vercel env to send order emails.",
    }
  }

  const to = Array.isArray(input.to) ? input.to : [input.to]
  const res = await postResend(
    { from, to, subject: input.subject, text: input.text, html: input.html },
    apiKey
  )
  if (!res.ok) {
    const errText = await res.text()
    console.error("[order-email] Resend error", res.status, errText)
    return { ok: false, error: parseResendError(errText) }
  }
  return { ok: true }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function sendOrderProofToAdmin(input: {
  to: string
  orderId: string
  productName: string
  priceLabel: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  paymentMethodLabel: string
  transactionRef: string
  proofNote: string
  adminUrl: string
}): Promise<{ ok: boolean; error?: string }> {
  const subject = `New direct order: ${input.productName} (${input.priceLabel})`
  const text = [
    `Order ${input.orderId}`,
    `Product: ${input.productName} (${input.priceLabel})`,
    `Buyer: ${input.buyerName} <${input.buyerEmail}>`,
    input.buyerPhone ? `Phone: ${input.buyerPhone}` : null,
    input.paymentMethodLabel ? `Method: ${input.paymentMethodLabel}` : null,
    `Transaction / proof: ${input.transactionRef}`,
    input.proofNote ? `Note: ${input.proofNote}` : null,
    `Admin: ${input.adminUrl}`,
  ]
    .filter(Boolean)
    .join("\n")

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <p style="color:#64748b;font-size:13px;">Direct product order</p>
      <h1 style="font-size:20px;color:#0f172a;">${escapeHtml(input.productName)}</h1>
      <p><strong>${escapeHtml(input.priceLabel)}</strong> · ${escapeHtml(input.orderId)}</p>
      <ul style="color:#334155;font-size:14px;line-height:1.6;">
        <li>Buyer: ${escapeHtml(input.buyerName)} &lt;${escapeHtml(input.buyerEmail)}&gt;</li>
        ${input.buyerPhone ? `<li>Phone: ${escapeHtml(input.buyerPhone)}</li>` : ""}
        ${input.paymentMethodLabel ? `<li>Method: ${escapeHtml(input.paymentMethodLabel)}</li>` : ""}
        <li>Transaction / proof: ${escapeHtml(input.transactionRef)}</li>
        ${input.proofNote ? `<li>Note: ${escapeHtml(input.proofNote)}</li>` : ""}
      </ul>
      <p><a href="${escapeHtml(input.adminUrl)}">Open admin → Orders</a></p>
    </div>
  `
  return sendResendEmail({ to: input.to, subject, text, html })
}

export async function sendOrderReceivedToBuyer(input: {
  to: string
  buyerName: string
  productName: string
  priceLabel: string
  paymentHeadline: string
  paymentInstructions: string
  methodsText: string
  footerNote: string
}): Promise<{ ok: boolean; error?: string }> {
  const subject = `Payment received for review: ${input.productName}`
  const text = [
    `Hi ${input.buyerName},`,
    ``,
    `Thanks. I received your payment proof for ${input.productName} (${input.priceLabel}).`,
    `I will verify and email your download when confirmed.`,
    ``,
    input.paymentHeadline,
    input.paymentInstructions,
    input.methodsText,
    input.footerNote,
  ].join("\n")

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <p>Hi ${escapeHtml(input.buyerName)},</p>
      <p>Thanks. I received your payment proof for <strong>${escapeHtml(input.productName)}</strong> (${escapeHtml(input.priceLabel)}).</p>
      <p>I will verify and email your download when confirmed.</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
      <p style="font-size:13px;color:#64748b;">${escapeHtml(input.paymentHeadline)}</p>
      <p style="font-size:13px;color:#475569;white-space:pre-wrap;">${escapeHtml(input.paymentInstructions)}</p>
      <pre style="font-size:12px;background:#f8fafc;padding:12px;border-radius:8px;white-space:pre-wrap;">${escapeHtml(input.methodsText)}</pre>
      ${input.footerNote ? `<p style="font-size:12px;color:#94a3b8;">${escapeHtml(input.footerNote)}</p>` : ""}
    </div>
  `
  return sendResendEmail({ to: input.to, subject, text, html })
}

export async function sendOrderPaidDownload(input: {
  to: string
  buyerName: string
  productName: string
  downloadUrl: string
  productUrl?: string
  gumroadUrl?: string
}): Promise<{ ok: boolean; error?: string }> {
  const subject = `Your download: ${input.productName}`
  const productUrl = input.productUrl?.trim() || ""
  const gumroadUrl = input.gumroadUrl?.trim() || ""
  const text = [
    `Hi ${input.buyerName},`,
    ``,
    `Payment confirmed. Here is everything for ${input.productName}:`,
    ``,
    `Download zip:`,
    input.downloadUrl,
    productUrl ? `` : null,
    productUrl ? `Product page:` : null,
    productUrl || null,
    gumroadUrl ? `` : null,
    gumroadUrl ? `Gumroad (card checkout):` : null,
    gumroadUrl || null,
    ``,
    `Thanks,`,
    `Ali Hamza`,
  ]
    .filter((line) => line !== null)
    .join("\n")

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <p>Hi ${escapeHtml(input.buyerName)},</p>
      <p>Payment confirmed. Here is everything for <strong>${escapeHtml(input.productName)}</strong>:</p>
      <p style="margin: 20px 0;">
        <a href="${escapeHtml(input.downloadUrl)}" style="display:inline-block;background:#111;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-size:14px;">
          Download zip
        </a>
      </p>
      <p style="font-size:13px;color:#475569;">Or open this link:<br/><a href="${escapeHtml(input.downloadUrl)}">${escapeHtml(input.downloadUrl)}</a></p>
      ${
        productUrl
          ? `<p style="font-size:13px;color:#475569;margin-top:16px;">Product page:<br/><a href="${escapeHtml(productUrl)}">${escapeHtml(productUrl)}</a></p>`
          : ""
      }
      ${
        gumroadUrl
          ? `<p style="font-size:13px;color:#475569;margin-top:12px;">Gumroad (card checkout):<br/><a href="${escapeHtml(gumroadUrl)}">${escapeHtml(gumroadUrl)}</a></p>`
          : ""
      }
      <p style="margin-top:24px;color:#64748b;font-size:13px;">Thanks,<br/>Ali Hamza</p>
    </div>
  `
  return sendResendEmail({ to: input.to, subject, text, html })
}

export async function sendPaymentDetailsEmail(input: {
  to: string
  buyerName: string
  productName: string
  priceLabel: string
  paymentHeadline: string
  paymentInstructions: string
  methodsText: string
  footerNote: string
  productUrl: string
}): Promise<{ ok: boolean; error?: string }> {
  const subject = `How to pay for ${input.productName}`
  const text = [
    `Hi ${input.buyerName || "there"},`,
    ``,
    `To buy ${input.productName} (${input.priceLabel}), use the payment details below, then submit proof on the product page:`,
    input.productUrl,
    ``,
    input.paymentHeadline,
    input.paymentInstructions,
    input.methodsText,
    input.footerNote,
  ].join("\n")

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <p>Hi ${escapeHtml(input.buyerName || "there")},</p>
      <p>To buy <strong>${escapeHtml(input.productName)}</strong> (${escapeHtml(input.priceLabel)}), use the details below, then submit your transaction ID on the product page.</p>
      <p><a href="${escapeHtml(input.productUrl)}">${escapeHtml(input.productUrl)}</a></p>
      <h2 style="font-size:16px;">${escapeHtml(input.paymentHeadline)}</h2>
      <p style="white-space:pre-wrap;font-size:14px;color:#475569;">${escapeHtml(input.paymentInstructions)}</p>
      <pre style="font-size:12px;background:#f8fafc;padding:12px;border-radius:8px;white-space:pre-wrap;">${escapeHtml(input.methodsText)}</pre>
      ${input.footerNote ? `<p style="font-size:12px;color:#94a3b8;">${escapeHtml(input.footerNote)}</p>` : ""}
    </div>
  `
  return sendResendEmail({ to: input.to, subject, text, html })
}
