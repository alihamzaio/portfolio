import { HomeHero } from "@/components/home/home-hero"
import { HomeClientOffer } from "@/components/home/home-client-offer"
import { HomeAbout } from "@/components/home/home-about"
import { HomeSkills } from "@/components/home/home-skills"
import { HomeProjects } from "@/components/home/home-projects"
import { HomeExperience } from "@/components/home/home-experience"
import { CtaBand } from "@/components/home/cta-band"
import { HomeContact } from "@/components/home/home-contact"
import { HomePageJsonLd } from "@/components/seo/home-page-json-ld"
import { buildPageMetadata, SEO_KEYWORDS } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata = buildPageMetadata({
  title: `${siteConfig.name} — ${siteConfig.title} (MERN, AWS, Web3)`,
  description: `${siteConfig.description} Case studies: Verana, HealOps, UniLabs, Senzi.`,
  path: "/",
  keywords: [
    ...SEO_KEYWORDS,
    "hire full stack developer",
    "freelance MERN developer Pakistan",
    "Ali Hamza portfolio",
  ],
})

export default function HomePage() {
  return (
    <>
      <HomePageJsonLd />
      <HomeHero />
      <HomeClientOffer />
      <HomeAbout />
      <HomeSkills />
      <HomeProjects />
      <HomeExperience />
      <CtaBand />
      <HomeContact />
    </>
  )
}
