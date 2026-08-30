import { ProjectsGrid } from "@/components/pages/projects-grid"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { buildPageMetadata } from "@/lib/seo"
import { getShowcaseProjectsAsync } from "@/lib/projects"
import { siteConfig } from "@/lib/site"

export const revalidate = 60

export const metadata = buildPageMetadata({
  title: "Projects",
  description: `Production projects by ${siteConfig.name}: blockchain indexer (Verana), Adam Store e-commerce, Senzi dropshipping, UniLabs DeFi, KYPI dashboards, and REST API systems.`,
  path: "/projects",
  keywords: [
    "Ali Hamza projects",
    "MERN stack portfolio",
    "blockchain project portfolio",
    "full stack case studies",
  ],
})

export default async function ProjectsPage() {
  const projects = await getShowcaseProjectsAsync()
  return (
    <>
      <PageBreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ]}
      />
      <ProjectsGrid projects={projects} />
    </>
  )
}
