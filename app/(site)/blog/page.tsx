import { BlogContent } from "@/components/pages/blog-content"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: "Blog",
  description: `In-depth technical articles by ${siteConfig.name} on Next.js, MERN, AWS serverless, and production engineering — written for developers and hiring teams.`,
  path: "/blog",
  type: "website",
  keywords: [
    "Ali Hamza blog",
    "Next.js tutorials",
    "full stack developer articles",
    "MERN stack guide",
    "AWS serverless",
  ],
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
