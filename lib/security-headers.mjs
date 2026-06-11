const isProd = process.env.NODE_ENV === "production"

/** Non-CSP security headers applied to all routes via next.config.mjs */
export const productionSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
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
]

export const baselineSecurityHeaders = productionSecurityHeaders

export const sourceMapHeaders = [
  {
    key: "Content-Type",
    value: "application/json; charset=utf-8",
  },
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
]

export const staticAssetHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
]
