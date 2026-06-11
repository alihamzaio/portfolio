/**
 * Build a Lighthouse-compliant CSP for Next.js App Router.
 * Used by middleware — nonce is required for inline Next.js bootstrap scripts.
 */

export type CspOptions = {
  nonce: string
  isDev: boolean
}

export function buildContentSecurityPolicy({ nonce, isDev }: CspOptions): string {
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "https://va.vercel-scripts.com",
    ...(isDev ? ["'unsafe-eval'"] : []),
  ]

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "script-src-attr 'none'",
    // Tailwind + Framer Motion inject runtime styles; style nonce is not wired for CSS files.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://www.exec9.com https://cdn.jsdelivr.net https://ghchart.rshah.org",
    "font-src 'self' data:",
    "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
    // Trusted Types enforcement breaks Turbopack runtime (dynamic script.src / innerHTML).
    ...(!isDev ? ["trusted-types nextjs#bundler"] : []),
  ].join("; ")
}
