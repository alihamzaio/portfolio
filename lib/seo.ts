import type { Metadata } from "next"
import { siteConfig } from "@/lib/site"

/** Primary keywords for portfolio discovery in search */
export const SEO_KEYWORDS = [
  siteConfig.name,
  "Ali Hamza Full Stack Developer",
  "Full Stack Developer",
  "Full Stack Developer Lahore",
  "Full Stack Developer Pakistan",
  "MERN Stack Developer",
  "React Developer",
  "Next.js Developer",
  "Node.js Developer",
  "TypeScript Developer",
  "AWS Developer",
  "Serverless Architecture",
  "REST API Development",
  "Cloud Infrastructure",
  "MongoDB Developer",
  "Express.js Developer",
  "JavaScript Developer",
  "Blockchain Development",
  "Web3 Development",
  "hire full stack developer Pakistan",
  ...siteConfig.specialties,
] as const

export function absoluteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "")
  if (!path || path === "/") return base
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

export const DEFAULT_OG_PATH = "/opengraph-image"

/** Ideal SERP length: 50–60 characters */
export const HOME_PAGE_TITLE = "Ali Hamza | Full Stack Developer in Lahore, Pakistan"

type PageSeoOptions = {
  /** Page title segment (template adds site name in root layout) */
  title: string
  description: string
  /** Path without domain, e.g. `/about` or `/` */
  path: string
  keywords?: string[]
  noIndex?: boolean
  ogImage?: string | { url: string; alt?: string; width?: number; height?: number }
  type?: "website" | "article"
  /** Use absolute title (no template suffix) */
  absoluteTitle?: boolean
}

function resolveOgImage(
  ogImage: PageSeoOptions["ogImage"]
): { url: string; width: number; height: number; alt: string; type: string } {
  if (!ogImage) {
    return {
      url: absoluteUrl(DEFAULT_OG_PATH),
      width: 1200,
      height: 630,
      alt: `${siteConfig.name} - ${siteConfig.title}`,
      type: "image/png",
    }
  }
  if (typeof ogImage === "string") {
    const url = ogImage.startsWith("http") ? ogImage : absoluteUrl(ogImage)
    return { url, width: 1200, height: 630, alt: siteConfig.name, type: "image/png" }
  }
  const url = ogImage.url.startsWith("http") ? ogImage.url : absoluteUrl(ogImage.url)
  return {
    url,
    width: ogImage.width ?? 1200,
    height: ogImage.height ?? 630,
    alt: ogImage.alt ?? siteConfig.name,
    type: "image/png",
  }
}

/** Per-route metadata with canonical URL, Open Graph, and Twitter cards */
export function buildPageMetadata(options: PageSeoOptions): Metadata {
  const canonical = absoluteUrl(options.path)
  const og = resolveOgImage(options.ogImage)
  const keywords = options.keywords ?? [...SEO_KEYWORDS]

  return {
    title: options.absoluteTitle ? { absolute: options.title } : options.title,
    description: options.description,
    keywords,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      type: options.type ?? "website",
      url: canonical,
      title: options.title,
      description: options.description,
      siteName: `${siteConfig.name} - Portfolio`,
      locale: "en_US",
      images: [og],
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description: options.description,
      images: [og.url],
    },
    robots: options.noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  }
}

/**
 * Root layout defaults. Title + description MUST live here so Next.js
 * can place them in <head> (required for Lighthouse SEO).
 */
export function buildRootMetadata(): Metadata {
  const og = resolveOgImage("/opengraph-image")
  const canonical = absoluteUrl("/")
  const description = siteConfig.description

  const verification: Metadata["verification"] = {}
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? process.env.GOOGLE_SITE_VERIFICATION
  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? process.env.BING_SITE_VERIFICATION
  if (google) verification.google = google
  if (bing) verification.other = { "msvalidate.01": bing }

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: HOME_PAGE_TITLE,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: [...SEO_KEYWORDS],
    authors: [{ name: siteConfig.name, url: absoluteUrl() }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "technology",
    applicationName: `${siteConfig.name} Portfolio`,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        "x-default": canonical,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: HOME_PAGE_TITLE,
      description,
      siteName: `${siteConfig.name} - Portfolio`,
      locale: "en_US",
      images: [og],
    },
    twitter: {
      card: "summary_large_image",
      title: HOME_PAGE_TITLE,
      description,
      images: [og.url],
    },
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "32x32" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icon", type: "image/png", sizes: "32x32" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
    },
    manifest: "/manifest.webmanifest",
    other: {
      "geo.region": "PK-PB",
      "geo.placename": "Lahore",
    },
  }
}
