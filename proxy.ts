import { NextResponse, type NextRequest } from "next/server"
import { buildContentSecurityPolicy } from "@/lib/csp"

function isSecureRequest(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-proto")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() === "https"
  }
  return request.nextUrl.protocol === "https:"
}

function buildSecurityHeaders(csp: string) {
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
  const isSecure = isSecureRequest(request)
  const csp = buildContentSecurityPolicy({ nonce, isSecure })

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)
  requestHeaders.set("x-pathname", request.nextUrl.pathname)
  requestHeaders.set("Content-Security-Policy", csp)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  for (const header of buildSecurityHeaders(csp)) {
    response.headers.set(header.key, header.value)
  }

  response.headers.set("X-Site-Build", "seo-v18")

  const path = request.nextUrl.pathname.toLowerCase()
  if (
    path === "/index.html" ||
    path === "/index.php" ||
    path === "/index.htm" ||
    path === "/home.html" ||
    path === "/home.php"
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    url.search = ""
    const redirect = NextResponse.redirect(url, 301)
    for (const header of buildSecurityHeaders(csp)) {
      redirect.headers.set(header.key, header.value)
    }
    redirect.headers.set("X-Site-Build", "seo-v18")
    return redirect
  }

  return response
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|icon|apple-icon|manifest.webmanifest|robots.txt|sitemap.xml|llms.txt|opengraph-image).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
}
