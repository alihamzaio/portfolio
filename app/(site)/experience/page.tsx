import { ExperienceContent } from "@/components/pages/experience-content"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: "Work Experience",
  description: `${siteConfig.name}'s experience: Full Stack Engineer at Birxment, MERN Developer at Exec9, React Developer at Explore Logics — Lahore, Pakistan.`,
  path: "/experience",
  keywords: [
    "Ali Hamza experience",
    "Birxment developer",
    "Exec9 developer",
    "full stack engineer career",
  ],
})

export default function ExperiencePage() {
  return (
    <>
      <PageBreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Experience", path: "/experience" },
        ]}
      />
      <ExperienceContent />
    </>
  )
}
