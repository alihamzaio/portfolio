import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"
import { getProjectSlugs } from "@/lib/projects"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url
  const now = new Date()

  const staticRoutes = ["", "/about", "/projects", "/experience", "/tech-stack", "/blog", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  )

  const projectRoutes = getProjectSlugs().map((slug) => ({
    url: `${base}/projects/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes]
}
