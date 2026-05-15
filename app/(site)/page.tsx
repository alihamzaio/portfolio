import type { Metadata } from "next"
import { HomeHero } from "@/components/home/home-hero"
import { FeaturedProjects } from "@/components/home/featured-projects"
import { CtaBand } from "@/components/home/cta-band"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
}

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <FeaturedProjects />
      <CtaBand />
    </>
  )
}
