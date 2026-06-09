import { ExperienceContent } from "@/components/pages/experience-content"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: "Experience",
  description: `${siteConfig.name}'s work history: Full Stack Software Engineer at Birxment, MERN Stack Developer at Exec9, React.js Developer at Explore Logics. 3+ years building APIs, cloud infrastructure, and web applications.`,
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
