import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects"
import { ProjectDetail } from "@/components/pages/project-detail"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return { title: "Project Not Found" }
  return {
    title: project.title,
    description: project.description,
    openGraph: { images: [{ url: project.image, alt: project.title }] },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()
  return <ProjectDetail project={project} />
}
