import { baselineSecurityHeaders, sourceMapHeaders, staticAssetHeaders } from "./lib/security-headers.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "www.exec9.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "ghchart.rshah.org" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  // Disable metadata streaming so <meta name="description"> stays in <head> for Lighthouse.
  htmlLimitedBots: /.*/,
  async headers() {
    const baselineSecurity = baselineSecurityHeaders

    return [
      {
        source: "/(.*)",
        headers: [
          ...baselineSecurity,
          {
            key: "X-Site-Build",
            value: "seo-v8",
          },
          {
            key: "Link",
            value:
              "<https://res.cloudinary.com>; rel=preconnect; crossorigin, <https://res.cloudinary.com>; rel=dns-prefetch",
          },
        ],
      },
      {
        source: "/_next/static/:path*.map",
        headers: sourceMapHeaders,
      },
      {
        source: "/_next/static/:path*",
        headers: staticAssetHeaders,
      },
      {
        source: "/sitemap.xml",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" }],
      },
      {
        source: "/robots.txt",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" }],
      },
    ]
  },
}

export default nextConfig
