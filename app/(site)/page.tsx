import { HomeHero } from "@/components/home/home-hero"
import { HomeClientOffer } from "@/components/home/home-client-offer"
import { HomeAbout } from "@/components/home/home-about"
import { HomeSeoProse } from "@/components/home/home-seo-prose"
import { HomeSkills } from "@/components/home/home-skills"
import { HomeProjects } from "@/components/home/home-projects"
import { HomeExperience } from "@/components/home/home-experience"
import { HomeTestimonials } from "@/components/home/home-testimonials"
import { CtaBand } from "@/components/home/cta-band"
import { HomeContact } from "@/components/home/home-contact"
import { HomePageJsonLd } from "@/components/seo/home-page-json-ld"
import { buildPageMetadata, HOME_PAGE_TITLE } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const dynamic = "force-static"
export const revalidate = 3600

export const metadata = buildPageMetadata({
  title: HOME_PAGE_TITLE,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
})

export default function HomePage() {
  return (
    <div className="pb-24 lg:pb-0">
      <HomePageJsonLd />
      <HomeHero />
      <HomeClientOffer />
      <HomeAbout />
      <HomeSeoProse />
      <HomeSkills />
      <HomeProjects />
      <HomeExperience />
      <HomeTestimonials />
      <CtaBand />
      <HomeContact />
    </div>
  )
}
