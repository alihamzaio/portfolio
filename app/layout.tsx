import type { Metadata } from "next"
import type React from "react"
import Script from "next/script"
import { Bricolage_Grotesque, DM_Sans, IBM_Plex_Mono } from "next/font/google"
import { AnalyticsDeferred } from "@/components/analytics-deferred"
import { GoogleAnalytics } from "@/components/google-analytics"
import { StructuredData } from "@/components/structured-data"
import { buildRootMetadata } from "@/lib/seo"
import { extensionErrorFilterScript } from "@/lib/extension-error-filter"
import "./globals.css"
import "lenis/dist/lenis.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
  adjustFontFallback: true,
})

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
})

export const dynamic = "force-static"

export const metadata: Metadata = buildRootMetadata()

export { viewport } from "@/lib/viewport"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark site-noise" prefix="og: https://ogp.me/ns#" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${bricolage.variable} ${plexMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <Script id="extension-error-filter" strategy="beforeInteractive">
          {extensionErrorFilterScript}
        </Script>
        <StructuredData />
        {children}
        <GoogleAnalytics />
        <AnalyticsDeferred />
      </body>
    </html>
  )
}
