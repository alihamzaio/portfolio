import type { Metadata } from "next"
import type React from "react"
import { Inter } from "next/font/google"
import { AnalyticsDeferred } from "@/components/analytics-deferred"
import { GoogleAnalytics } from "@/components/google-analytics"
import { StructuredData } from "@/components/structured-data"
import { OpenGraphTags } from "@/components/seo/open-graph-tags"
import { buildRootMetadata } from "@/lib/seo"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "700"],
  preload: true,
  adjustFontFallback: true,
})

/** Static root layout so SEO tags stay in the initial HTML <head>. */
export const dynamic = "force-static"

export const metadata: Metadata = buildRootMetadata()

export { viewport } from "@/lib/viewport"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" prefix="og: https://ogp.me/ns#" suppressHydrationWarning>
      <head>
        <OpenGraphTags />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased noise-overlay dot-grid-body`}
        suppressHydrationWarning
      >
        <StructuredData />
        {children}
        <GoogleAnalytics />
        <AnalyticsDeferred />
      </body>
    </html>
  )
}
