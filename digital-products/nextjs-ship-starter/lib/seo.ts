import type { Metadata } from "next"
import { site } from "@/lib/site"

export function absoluteUrl(path = "") {
  const base = site.url.replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return path ? `${base}${p}` : base
}

export function buildMetadata({
  title,
  description,
  path = "",
}: {
  title: string
  description: string
  path?: string
}): Metadata {
  const url = absoluteUrl(path)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type: "website",
    },
  }
}
