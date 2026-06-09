import { AboutContent } from "@/components/pages/about-content"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: "About",
  description: `About ${siteConfig.name}: Full Stack Developer with 3+ years building React, Next.js, Node.js, AWS serverless, and blockchain systems. ${siteConfig.education}. Based in ${siteConfig.location}.`,
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
