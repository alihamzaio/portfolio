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
  void nonce
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    "https://va.vercel-scripts.com",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    // Google AdSense + Privacy Sandbox / Funding Choices
    "https://pagead2.googlesyndication.com",
    "https://www.googleadservices.com",
    "https://www.googletagservices.com",
    "https://adservice.google.com",
    "https://partner.googleadservices.com",
    "https://tpc.googlesyndication.com",
    "https://fundingchoicesmessages.google.com",
    "https://ep1.adtrafficquality.google",
    "https://ep2.adtrafficquality.google",
    // next dev react-refresh uses eval(); only on http://localhost, not production https.
    ...(!isSecure ? ["'unsafe-eval'"] : []),
  ]

  const connectSrc = [
    "'self'",
    "https://vitals.vercel-insights.com",
    "https://va.vercel-scripts.com",
    "https://www.google-analytics.com",
    "https://region1.google-analytics.com",
    "https://www.googletagmanager.com",
    "https://pagead2.googlesyndication.com",
    "https://googleads.g.doubleclick.net",
    "https://tpc.googlesyndication.com",
    "https://adservice.google.com",
    "https://partner.googleadservices.com",
    "https://fundingchoicesmessages.google.com",
    "https://ep1.adtrafficquality.google",
    "https://ep2.adtrafficquality.google",
    "https://csi.gstatic.com",
    ...(!isSecure ? ["ws://localhost:*", "wss://localhost:*"] : []),
  ]

  const frameSrc = [
    "'self'",
    "https://googleads.g.doubleclick.net",
    "https://tpc.googlesyndication.com",
    "https://www.google.com",
    "https://pagead2.googlesyndication.com",
    "https://fundingchoicesmessages.google.com",
    "https://www.googleadservices.com",
    "https://ep1.adtrafficquality.google",
    "https://ep2.adtrafficquality.google",
  ]

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://tagmanager.google.com",
    // Allow any https image host so blog covers (Pexels, Unsplash, Cloudinary, etc.) work.
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    `connect-src ${connectSrc.join(" ")}`,
    `frame-src ${frameSrc.join(" ")}`,
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'self' mailto:",
    "object-src 'none'",
    ...(isSecure ? ["upgrade-insecure-requests"] : []),
  ].join("; ")
}
