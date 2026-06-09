import { ContactContent } from "@/components/pages/contact-content"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: "Contact",
  description: `Contact ${siteConfig.name} for full-time roles and contract work. Full Stack Developer working with MERN stack, Next.js, AWS serverless, and blockchain. ${siteConfig.email}, ${siteConfig.location}.`,
  path: "/contact",
})

export default function ContactPage() {
  return (
    <>
      <PageBreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <ContactContent />
    </>
  )
}
