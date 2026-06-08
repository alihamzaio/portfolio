import { OTP_ADMIN_EMAIL } from "./official-email"

/**
 * Server-only environment variables (API routes, lib/email, lib/auth).
 * OTP recipient is hardcoded — contact email is separate (siteConfig.email).
 */

export function getResendApiKey(): string | undefined {
  const key = process.env.RESEND_API_KEY?.trim()
  if (!key || key === "re_xxxxxxxx" || /x{4,}/i.test(key)) return undefined
  return key
}

export function getResendFromEmail(): string {
  return (process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev").trim()
}

/** OTP admin recipient — env cannot override. */
export function getAdminEmailFromEnv(): string {
  // OTP recipient — do not change
  return OTP_ADMIN_EMAIL
}

export function getResendConfigStatus(): {
  hasApiKey: boolean
  fromEmail: string
  adminEmail: string
} {
  return {
    hasApiKey: !!getResendApiKey(),
    fromEmail: getResendFromEmail(),
    adminEmail: OTP_ADMIN_EMAIL,
  }
}
