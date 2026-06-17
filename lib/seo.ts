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
}

function resolveOgImage(
  ogImage: PageSeoOptions["ogImage"]
): { url: string; width: number; height: number; alt: string } {
  if (!ogImage) {
    return {
      url: absoluteUrl(DEFAULT_OG_PATH),
      width: 1200,
      height: 630,
      alt: `${siteConfig.name} — ${siteConfig.title}`,
    }
  }
  if (typeof ogImage === "string") {
    const url = ogImage.startsWith("http") ? ogImage : absoluteUrl(ogImage)
    return { url, width: 1200, height: 630, alt: siteConfig.name }
  }
  const url = ogImage.url.startsWith("http") ? ogImage.url : absoluteUrl(ogImage.url)
  return {
    url,
    width: ogImage.width ?? 1200,
    height: ogImage.height ?? 630,
    alt: ogImage.alt ?? siteConfig.name,
  }
}

/** Per-route metadata with canonical URL, Open Graph, and Twitter cards */
export function buildPageMetadata(options: PageSeoOptions): Metadata {
  const canonical = absoluteUrl(options.path)
  const og = resolveOgImage(options.ogImage)
  const fullTitle = options.title
  const keywords = options.keywords ?? [...SEO_KEYWORDS]

  return {
    title: fullTitle,
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
      title: `${fullTitle} | ${siteConfig.name}`,
      description: options.description,
      siteName: `${siteConfig.name} — Portfolio`,
      locale: "en_US",
      images: [og],
    },
    twitter: {
      card: "summary_large_image",
      title: `${fullTitle} | ${siteConfig.name}`,
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

/** Root layout defaults — merged with per-page metadata */
export function buildRootMetadata(): Metadata {
  const og = resolveOgImage("/opengraph-image")
  const homeTitle = "Ali Hamza | Full Stack Developer (MERN, AWS & Web3)"
  const canonical = absoluteUrl("/")

  const verification: Metadata["verification"] = {}
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? process.env.GOOGLE_SITE_VERIFICATION
  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? process.env.BING_SITE_VERIFICATION
  if (google) verification.google = google
  if (bing) verification.other = { "msvalidate.01": bing }

  return {
    title: {
      default: homeTitle,
      template: `%s | ${siteConfig.name}`,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical,
      languages: {
        en: canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: `${homeTitle} | ${siteConfig.name}`,
      description: siteConfig.description,
      siteName: `${siteConfig.name} — Portfolio`,
      locale: "en_US",
      images: [og],
    },
    twitter: {
      card: "summary_large_image",
      title: `${homeTitle} | ${siteConfig.name}`,
      description: siteConfig.description,
      images: [og.url],
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
    authors: [{ name: siteConfig.name, url: absoluteUrl() }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "technology",
    applicationName: `${siteConfig.name} Portfolio`,
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icon", type: "image/png", sizes: "32x32" },
      ],
      apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
    },
    manifest: "/manifest.webmanifest",
    other: {
      "geo.region": "PK-PB",
      "geo.placename": "Lahore",
    },
  }
}
