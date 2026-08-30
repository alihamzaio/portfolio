import projectsData from "./projects.json"
import type { Project } from "./types"
import { applyCaseStudyDefaults } from "./project-case-studies"
import { getStoreJson } from "./store"

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

function enrichProjects(raw: Project[]) {
  return raw.map((project) => {
    const title = project.title.trim()
    const base = {
      ...project,
      title,
      slug: typeof project.slug === "string" && project.slug.length > 0 ? project.slug : slugify(title),
      github: normalizeGithub(project.github),
    }
    return applyCaseStudyDefaults(base) as Project & { slug: string }
  })
}

const enrichedStatic = enrichProjects(projectsData as Project[])

/** Build-time fallback — excludes hidden projects */
export const projects = enrichedStatic.filter((p) => !p.hidden)
export const allProjects = enrichedStatic

async function loadProjectsRaw(): Promise<Project[]> {
  const kv = await getStoreJson("projects")
  if (Array.isArray(kv) && kv.length > 0) return kv as Project[]
  return projectsData as Project[]
}

export async function loadProjects() {
  const enriched = enrichProjects(await loadProjectsRaw())
  return enriched.filter((p) => !p.hidden)
}

export async function loadAllProjects() {
  return enrichProjects(await loadProjectsRaw())
}

export async function getProjectBySlugAsync(slug: string) {
  const list = await loadProjects()
  return list.find((p) => p.slug === slug)
}

export async function getProjectSlugsAsync() {
  const list = await loadProjects()
  return list.map((p) => p.slug).filter(Boolean) as string[]
}

export async function getShowcaseProjectsAsync(limit?: number) {
  const list = await loadProjects()
  const featured = list.filter((p) => p.featured)
  const rest = list.filter((p) => !p.featured)
  const ordered = [...featured, ...rest]
  if (limit === undefined) return ordered
  return ordered.slice(0, limit)
}

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
