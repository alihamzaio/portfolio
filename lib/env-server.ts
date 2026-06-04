/**
 * Server-only environment variables (API routes, lib/email, lib/auth).
 *
 * Do NOT use NEXT_PUBLIC_ for secrets — those are bundled into the browser.
 *
 * | Variable              | NEXT_PUBLIC? | Used for                    |
 * |-----------------------|--------------|-----------------------------|
 * | RESEND_API_KEY        | No           | Admin OTP emails (Resend)   |
 * | RESEND_FROM_EMAIL     | No           | Sender address              |
 * | ADMIN_EMAIL           | No           | Who can log in to /admin    |
 * | NEXT_PUBLIC_SITE_URL  | Yes          | SEO, canonical URLs         |
 * | PORT                  | No           | Local dev port (next dev)   |
 */

export function getResendApiKey(): string | undefined {
  const key = process.env.RESEND_API_KEY?.trim()
  if (!key || key === "re_xxxxxxxx" || /x{4,}/i.test(key)) return undefined
  return key
}

export function getResendFromEmail(): string {
  return (process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev").trim()
}

export function getAdminEmailFromEnv(): string {
  return (process.env.ADMIN_EMAIL || "hamzasarwer9@gmail.com").toLowerCase().trim()
}

/** For debugging only — never expose the actual key */
export function getResendConfigStatus(): {
  hasApiKey: boolean
  fromEmail: string
  adminEmail: string
} {
  return {
    hasApiKey: !!getResendApiKey(),
    fromEmail: getResendFromEmail(),
    adminEmail: getAdminEmailFromEnv(),
  }
}
