import { NextResponse, type NextRequest } from "next/server"
import { buildContentSecurityPolicy } from "@/lib/csp"

const isProd = process.env.NODE_ENV === "production"

function buildProductionSecurityHeaders(csp: string) {
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
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
  ] as const
}

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64")

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)

  if (isProd) {
    const csp = buildContentSecurityPolicy({ nonce })
    requestHeaders.set("Content-Security-Policy", csp)
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  if (isProd) {
    const csp = buildContentSecurityPolicy({ nonce })
    for (const header of buildProductionSecurityHeaders(csp)) {
      response.headers.set(header.key, header.value)
    }
  }

  return response
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|icon|apple-icon|manifest.webmanifest|robots.txt|sitemap.xml|opengraph-image).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
}
