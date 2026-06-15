import type { Metadata } from "next"
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <title>Ali Hamza | Full Stack Developer (MERN, AWS & Web3)</title>
        <meta name="description" content={siteConfig.description} />
        <link rel="canonical" href={siteConfig.url.replace(/\/$/, "")} />
      </head>
      <body
        className={`${inter.variable} ${jetbrains.variable} font-sans antialiased noise-overlay dot-grid-body`}
        suppressHydrationWarning
      >
        <StructuredData />
        {children}
        <AnalyticsDeferred />
      </body>
    </html>
  )
}
