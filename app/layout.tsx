import type { Metadata } from "next"
import { headers } from "next/headers"
import type React from "react"
import { Inter, JetBrains_Mono } from "next/font/google"
import { AnalyticsDeferred } from "@/components/analytics-deferred"
import { StructuredData } from "@/components/structured-data"
import { buildRootMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
  preload: false,
})

export const metadata = buildRootMetadata()

export { viewport } from "@/lib/viewport"

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="description" content={siteConfig.description} />
        <StructuredData nonce={nonce} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${jetbrains.variable} font-sans antialiased noise-overlay dot-grid-body`}
        suppressHydrationWarning
      >
        {children}
        <AnalyticsDeferred />
      </body>
    </html>
  )
}
