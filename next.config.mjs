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
      { protocol: "https", hostname: "ghchart.rshah.org" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  // RegExp object — must be in config so metadata is not streamed outside <head>.
  htmlLimitedBots: /[\s\S]*/,
  async headers() {
    const baselineSecurity = baselineSecurityHeaders

    return [
      {
        source: "/(.*)",
        headers: [
          ...baselineSecurity,
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
