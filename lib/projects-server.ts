import "server-only"

import projectsData from "./projects.json"
import type { Project } from "./types"
import { applyCaseStudyDefaults } from "./project-case-studies"
import { getStoreJson } from "./store"
import { slugify, normalizeGithub, projects } from "./projects"

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

async function loadProjectsRaw(): Promise<Project[]> {
  const kv = await getStoreJson("projects")
  if (Array.isArray(kv) && kv.length > 0) return kv as Project[]
  return projectsData as Project[]
}

export async function loadProjects() {
  const enriched = enrichProjects(await loadProjectsRaw())
  return enriched.filter((p) => !p.hidden)
}

export async function getProjectBySlugAsync(slug: string) {
  const list = await loadProjects()
  return list.find((p) => p.slug === slug) || projects.find((p) => p.slug === slug)
}

export async function getShowcaseProjectsAsync(limit?: number) {
  const list = await loadProjects()
  const featured = list.filter((p) => p.featured)
  const rest = list.filter((p) => !p.featured)
  const ordered = [...featured, ...rest]
  if (limit === undefined) return ordered
  return ordered.slice(0, limit)
}
