import { BlogContent } from "@/components/pages/blog-content"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: "Engineering Blog",
  description: `Technical articles by ${siteConfig.name} on MERN stack, AWS serverless, Next.js, blockchain, and production software engineering.`,
  path: "/blog",
  type: "website",
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
