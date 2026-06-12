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
  const scriptSrc = [
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "https://va.vercel-scripts.com",
    // next dev react-refresh uses eval(); only on http://localhost, not production https.
    ...(!isSecure ? ["'unsafe-eval'"] : []),
  ]

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://www.exec9.com https://cdn.jsdelivr.net https://ghchart.rshah.org",
    "font-src 'self' data:",
    "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com ws://localhost:* wss://localhost:*",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "object-src 'none'",
    ...(isSecure ? ["upgrade-insecure-requests"] : []),
    // require-trusted-types-for breaks next dev RSC script injection on http://localhost.
    ...(isSecure ? ["require-trusted-types-for 'script'"] : []),
    "trusted-types nextjs#bundler default 'allow-duplicates'",
  ].join("; ")
}


