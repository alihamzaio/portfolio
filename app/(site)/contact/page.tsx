import { ContactContent } from "@/components/pages/contact-content"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: "Contact",
  description: `Contact ${siteConfig.name} for full stack engineering roles and projects. Email ${siteConfig.email}, ${siteConfig.location}. Available for remote work.`,
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
