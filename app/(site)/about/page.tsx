import { AboutContent } from "@/components/pages/about-content"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: "About",
  description: `About ${siteConfig.name}, a ${siteConfig.title} in ${siteConfig.location}. ${siteConfig.education}. 3+ years building MERN, AWS serverless, and blockchain production systems.`,
  path: "/about",
})

export default function AboutPage() {
  return (
    <>
      <PageBreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />
      <AboutContent />
    </>
  )
}
