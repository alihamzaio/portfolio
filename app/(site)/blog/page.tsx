import { BlogContent } from "@/components/pages/blog-content"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: "Blog",
  description: `Technical writing by ${siteConfig.name} on MERN, AWS serverless, Next.js, REST APIs, and blockchain — plus lessons from ${siteConfig.brand.channel}.`,
  path: "/blog",
  type: "website",
})

export default async function BlogPage() {
  return (
    <>
      <PageBreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />
      <BlogContent />
    </>
  )
}
