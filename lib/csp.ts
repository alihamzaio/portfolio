/**
 * Content-Security-Policy for Next.js App Router (production).
 * Dev mode skips CSP in proxy.ts — Turbopack HMR is incompatible with strict enforcement.
 */

export type CspOptions = {
  nonce: string
}

export function buildContentSecurityPolicy({ nonce }: CspOptions): string {
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "https://va.vercel-scripts.com",
  ]

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://www.exec9.com https://cdn.jsdelivr.net https://ghchart.rshah.org",
    "font-src 'self' data:",
    "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
    "trusted-types nextjs#bundler default 'allow-duplicates'",
  ].join("; ")
}
