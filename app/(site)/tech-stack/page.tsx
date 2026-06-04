import { TechStackContent } from "@/components/pages/tech-stack-content"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: "Tech Stack & Skills",
  description: `${siteConfig.name}'s tech stack: React, Next.js, Node.js, TypeScript, AWS Lambda, Docker, PostgreSQL, MongoDB, Solidity, and Moleculer microservices.`,
  path: "/tech-stack",
})

export default function TechStackPage() {
  return (
    <>
      <PageBreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Tech Stack", path: "/tech-stack" },
        ]}
      />
      <TechStackContent />
    </>
  )
}
