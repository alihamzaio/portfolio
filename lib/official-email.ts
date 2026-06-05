/**
 * OTP / admin verification recipient ONLY.
 * Contact forms, portfolio display, and newsletter use siteConfig.email — not this address.
 */
export const OTP_ADMIN_EMAIL = "alilogics007@gmail.com" as const

export function normalizeOtpEmail(email: string): string {
  return email.toLowerCase().trim()
}

export function isOtpAdminEmail(email: string): boolean {
  return normalizeOtpEmail(email) === OTP_ADMIN_EMAIL
}

/** @deprecated Use OTP_ADMIN_EMAIL */
export const OFFICIAL_EMAIL = OTP_ADMIN_EMAIL
