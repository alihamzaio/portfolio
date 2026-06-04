import { notFound } from "next/navigation"
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects"
import { ProjectDetail } from "@/components/pages/project-detail"
import { ProjectJsonLd } from "@/components/seo/project-json-ld"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return { title: "Project Not Found", robots: { index: false, follow: false } }

  const tagKeywords = (project.tags ?? []).slice(0, 8)
  return buildPageMetadata({
    title: project.title,
    description: `${project.description} — Built by ${siteConfig.name}, ${siteConfig.title}.`,
    path: `/projects/${slug}`,
    keywords: [project.title, ...tagKeywords, siteConfig.name],
    ogImage: project.image
      ? { url: project.image, alt: `${project.title} — ${siteConfig.name}` }
      : undefined,
    type: "article",
  })
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  return (
    <>
      <ProjectJsonLd project={project} />
      <ProjectDetail project={project} />
    </>
  )
}
