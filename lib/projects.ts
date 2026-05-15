import projectsData from "./projects.json"
import type { Project } from "./types"

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const enriched = (projectsData as Project[]).map((project) => ({
  ...project,
  slug: slugify(project.title),
}))

export const projects = enriched

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(limit = 4) {
  return projects.slice(0, limit)
}

export function getProjectSlugs() {
  return projects.map((p) => p.slug)
}
