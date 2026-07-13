import { BlogContent } from "@/components/pages/blog-content"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: "Blog",
  description: `Technical writing by ${siteConfig.name} on MERN stack development, AWS serverless architecture, Next.js performance, REST APIs, and blockchain indexing.`,
  path: "/blog",
  type: "website",
  noIndex: true,
})

export default function BlogPage() {
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
