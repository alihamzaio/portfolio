import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/seo"
import { getProjectSlugs } from "@/lib/projects"

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.9, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.9, changeFrequency: "weekly" },
  { path: "/experience", priority: 0.85, changeFrequency: "monthly" },
  { path: "/tech-stack", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.85, changeFrequency: "yearly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  }))

  const projectEntries = getProjectSlugs().map((slug) => ({
    url: absoluteUrl(`/projects/${slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }))

  return [...staticEntries, ...projectEntries]
}
