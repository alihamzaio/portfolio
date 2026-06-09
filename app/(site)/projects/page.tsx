import { ProjectsGrid } from "@/components/pages/projects-grid"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: "Projects",
  description: `Production projects by ${siteConfig.name}: blockchain indexer (Verana), AWS healthcare platform (HealOps), MERN e-commerce, DeFi Web3 apps, and REST API systems.`,
  path: "/projects",
  keywords: [
    "Ali Hamza projects",
    "MERN stack portfolio",
    "blockchain project portfolio",
    "full stack case studies",
  ],
})

export default function ProjectsPage() {
  return (
    <>
      <PageBreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ]}
      />
      <ProjectsGrid />
    </>
  )
}
