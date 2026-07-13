/**
 * Content-Security-Policy for Next.js App Router.
 * `isSecure` is derived from the request URL (https), not NODE_ENV.
 */
export type CspOptions = {
  nonce: string
  /** true when the page is served over HTTPS */
  isSecure: boolean
}

export function buildContentSecurityPolicy({ nonce, isSecure }: CspOptions): string {
  // Static Next.js pages cannot stamp per-request nonces on all hydration scripts.
  // Prefer a host-allowlist CSP that keeps XSS protections without console CSP noise.
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    "https://va.vercel-scripts.com",
    // next dev react-refresh uses eval(); only on http://localhost, not production https.
    ...(!isSecure ? ["'unsafe-eval'"] : []),
  ]

  const connectSrc = [
    "'self'",
    "https://vitals.vercel-insights.com",
    "https://va.vercel-scripts.com",
    ...(!isSecure ? ["ws://localhost:*", "wss://localhost:*"] : []),
  ]

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://www.exec9.com https://cdn.jsdelivr.net https://ghchart.rshah.org",
    "font-src 'self' data:",
    `connect-src ${connectSrc.join(" ")}`,
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'self' mailto:",
    "object-src 'none'",
    ...(isSecure ? ["upgrade-insecure-requests"] : []),
  ].join("; ")
}

