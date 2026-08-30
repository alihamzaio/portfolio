import { baselineSecurityHeaders, crossOriginResourceHeaders, sourceMapHeaders, staticAssetHeaders } from "./lib/security-headers.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
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
  async redirects() {
    return [
      { source: "/favicon.ico", destination: "/icon", permanent: false },
      { source: "/index.html", destination: "/", statusCode: 301 },
      { source: "/index.php", destination: "/", statusCode: 301 },
      { source: "/index.htm", destination: "/", statusCode: 301 },
      { source: "/home.html", destination: "/", statusCode: 301 },
      { source: "/home.php", destination: "/", statusCode: 301 },
      { source: "/linkedin", destination: "https://www.linkedin.com/in/alihamza-fullstack-developer", statusCode: 301 },
      { source: "/out/linkedin", destination: "https://www.linkedin.com/in/alihamza-fullstack-developer", statusCode: 301 },
      { source: "/github", destination: "https://github.com/alihamzaio", statusCode: 301 },
      { source: "/out/github", destination: "https://github.com/alihamzaio", statusCode: 301 },
    ]
  },
  async rewrites() {
    return [{ source: "/og.png", destination: "/opengraph-image" }]
  },
  async headers() {
    const baselineSecurity = baselineSecurityHeaders

    return [
      {
        source: "/(.*)",
        headers: [
          ...baselineSecurity,
          {
            key: "X-Site-Build",
            value: "seo-v20",
          },
          {
            key: "Link",
            value:
              "<https://res.cloudinary.com>; rel=preconnect; crossorigin, <https://res.cloudinary.com>; rel=dns-prefetch",
          },
        ],
      },
      {
        source: "/opengraph-image",
        headers: crossOriginResourceHeaders,
      },
      {
        source: "/og.png",
        headers: crossOriginResourceHeaders,
      },
      {
        source: "/icon",
        headers: crossOriginResourceHeaders,
      },
      {
        source: "/apple-icon",
        headers: crossOriginResourceHeaders,
      },
      {
        source: "/favicon.svg",
        headers: crossOriginResourceHeaders,
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
