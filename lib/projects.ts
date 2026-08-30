import projectsData from "./projects.json"
import type { Project } from "./types"
import { applyCaseStudyDefaults } from "./project-case-studies"

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function normalizeGithub(url?: string): string | undefined {
  if (!url || url === "#" || !/^https?:\/\//i.test(url)) return undefined
  return url
}

const enriched = (projectsData as Project[]).map((project) => {
  const title = project.title.trim()
  const base = {
    ...project,
    title,
    slug: typeof project.slug === "string" && project.slug.length > 0 ? project.slug : slugify(title),
    github: normalizeGithub(project.github),
  }
  return applyCaseStudyDefaults(base) as Project & { slug: string }
})

/** Public portfolio — excludes early clones / practice demos */
export const projects = enriched.filter((p) => !p.hidden)

export const allProjects = enriched

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(limit = 4) {
  const featured = projects.filter((p) => p.featured)
  if (featured.length > 0) return featured.slice(0, limit)
  return projects.slice(0, limit)
}

export function getShowcaseProjects(limit?: number) {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)
  const ordered = [...featured, ...rest]
  if (limit === undefined) return ordered
  return ordered.slice(0, limit)
}

export function getProjectSlugs() {
  return projects.map((p) => p.slug).filter(Boolean) as string[]
}

export function projectOffsiteUrl(project: { link?: string; github?: string }): string | undefined {
  const link = project.link?.trim()
  if (link && /^https?:\/\//i.test(link) && link !== "#") return link
  return project.github
}
