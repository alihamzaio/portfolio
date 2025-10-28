import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Ali Hamza | Software Engineer (MERN Stack Developer)",
    template: "%s | Ali Hamza"
  },
  description:
    "Ali Hamza — Software Engineer and MERN Stack Developer. Building high-performance web apps with Next.js, React, Node.js, Express, and MongoDB.",
  keywords: [
    "Ali Hamza",
    "Software Engineer",
    "MERN Stack Developer",
    "MERN Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Full Stack Developer",
    "Pakistan Developer",
  ],
  authors: [{ name: "Ali Hamza" }],
  creator: "Ali Hamza",
  publisher: "Ali Hamza",
  alternates: {
    canonical: "https://alihamza-fawn.vercel.app/",
  },
  openGraph: {
    type: "website",
    url: "https://alihamza-fawn.vercel.app/",
    title: "Ali Hamza | Software Engineer (MERN Stack Developer)",
    description:
      "MERN stack portfolio — React, Next.js, Node.js, Express, MongoDB. View projects, skills, and contact Ali Hamza.",
    siteName: "Ali Hamza Portfolio",
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: "Ali Hamza — MERN Stack Developer",
      },
    ],
  },
  category: "technology",
  applicationName: "Ali Hamza Portfolio",
  generator: "Next.js",
  metadataBase: new URL("https://alihamza-fawn.vercel.app/"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple.png",
    shortcut: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`font-sans antialiased dark`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
