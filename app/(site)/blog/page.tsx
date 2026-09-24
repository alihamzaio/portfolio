import { BlogContent } from "@/components/pages/blog-content"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: "Blog",
  description: `Latest posts by ${siteConfig.name} on freelancing, side projects, AI tools, and building on the web. Updated as new pieces publish.`,
  path: "/blog",
  type: "website",
  keywords: [
    "Ali Hamza blog",
    "freelance developer blog",
    "side hustle tips",
    "AI tools for freelancers",
    "web development posts",
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
