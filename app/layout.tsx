import type { Metadata } from "next"
import type React from "react"
import { Inter } from "next/font/google"
import { AnalyticsDeferred } from "@/components/analytics-deferred"
import { StructuredData } from "@/components/structured-data"
import { buildRootMetadata } from "@/lib/seo"
import {
  HOME_CANONICAL,
  HOME_KEYWORDS,
  HOME_META_DESCRIPTION,
  HOME_PAGE_TITLE,
  HOME_ROBOTS,
} from "@/lib/seo-head"
import { siteConfig } from "@/lib/site"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
})

export const metadata = buildRootMetadata()

export { viewport } from "@/lib/viewport"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <title>{HOME_PAGE_TITLE}</title>
        <meta name="description" content={HOME_META_DESCRIPTION} />
        <meta name="keywords" content={HOME_KEYWORDS} />
        <meta name="author" content={siteConfig.name} />
        <meta name="robots" content={HOME_ROBOTS} />
        <link rel="canonical" href={HOME_CANONICAL} />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased noise-overlay dot-grid-body`}
        suppressHydrationWarning
      >
        <StructuredData />
        {children}
        <AnalyticsDeferred />
      </body>
    </html>
  )
}
