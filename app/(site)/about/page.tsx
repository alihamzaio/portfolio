import type { Metadata } from "next"
import { AboutContent } from "@/components/pages/about-content"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${siteConfig.name} — full stack MERN + AWS engineer building premium digital products.`,
}

export default function AboutPage() {
  return <AboutContent />
}
