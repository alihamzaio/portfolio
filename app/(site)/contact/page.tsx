import type { Metadata } from "next"
import { ContactContent } from "@/components/pages/contact-content"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name} for MERN + AWS engineering projects.`,
}

export default function ContactPage() {
  return <ContactContent />
}
