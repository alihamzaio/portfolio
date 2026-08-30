import { projects, projectOffsiteUrl } from "@/lib/projects"
import type { Project } from "@/lib/types"

export type GalleryProject = {
  id: string
  slug: string
  title: string
  overview: string
  problem: string
  solution: string
  architecture: string[]
  metrics: { label: string; value: string }[]
  techStack: string[]
  image: string
  github?: string
  demo?: string
}

function detailBullets(details: string): string[] {
  const sentences = details
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (sentences.length >= 2) return sentences.slice(0, 4)
  return details.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 4)
}

export function projectToGallery(p: Project): GalleryProject {
  const demo = projectOffsiteUrl(p)
  const problem = p.problem ?? p.description
  const solution = p.solution ?? p.details
  const bullets = p.architecture?.length ? p.architecture : detailBullets(solution || problem)

  return {
    id: String(p.id),
    slug: p.slug || String(p.id),
    title: p.title,
    overview: p.description,
    problem,
    solution,
    architecture: bullets,
    metrics: p.metrics?.length
      ? p.metrics
      : [
          { label: "technologies", value: String(Math.min(p.tags.length, 12)) },
          { label: "featured", value: "Yes" },
        ],
    techStack: p.tags.slice(0, 8),
    image: p.image,
    github: p.github,
    demo,
  }
}

/** Featured projects on the homepage carousel (full set lives on /projects) */
const HOME_GALLERY_LIMIT = 8

export function getGalleryProjects(): GalleryProject[] {
  const featured = projects.filter((p) => p.featured)
  return featured.slice(0, HOME_GALLERY_LIMIT).map(projectToGallery)
}
