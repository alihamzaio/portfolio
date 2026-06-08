/**
 * OTP / admin verification recipient ONLY.
 * Contact forms and public profile use siteConfig.email — not this address.
 */
// OTP recipient — do not change
export const OTP_ADMIN_EMAIL = "alilogics007@gmail.com" as const

export function normalizeOtpEmail(email: string): string {
  return email.toLowerCase().trim()
}

export function isOtpAdminEmail(email: string): boolean {
  return normalizeOtpEmail(email) === OTP_ADMIN_EMAIL
}
