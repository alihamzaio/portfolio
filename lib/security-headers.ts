import { buildContentSecurityPolicy } from "./csp"

const isProd = process.env.NODE_ENV === "production"

/** Security headers applied on every HTML navigation (via proxy). */
export function buildSecurityHeaders(csp: string) {
  return [
    { key: "Content-Security-Policy", value: csp },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-DNS-Prefetch-Control", value: "on" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    },
    ...(isProd
      ? [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ]
      : []),
  ] as const
}

export function buildRequestSecurityHeaders(nonce: string) {
  const csp = buildContentSecurityPolicy({ nonce })
  return buildSecurityHeaders(csp)
}

/** Static asset headers (source maps, long cache) — set in next.config.mjs */
export const staticAssetHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
] as const

export const sourceMapHeaders = [
  {
    key: "Content-Type",
    value: "application/json; charset=utf-8",
  },
  ...staticAssetHeaders,
] as const
