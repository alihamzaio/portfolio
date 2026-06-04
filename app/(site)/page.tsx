import type { Metadata } from "next"
import { HomeHero } from "@/components/home/home-hero"
import { HomeAbout } from "@/components/home/home-about"
import { HomeSkills } from "@/components/home/home-skills"
import { HomeProjects } from "@/components/home/home-projects"
import { HomeServices } from "@/components/home/home-services"
import { HomeExperience } from "@/components/home/home-experience"
import { HomeTestimonials } from "@/components/home/home-testimonials"
import { HomeContact } from "@/components/home/home-contact"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "MERN Stack Developer & AI Engineer",
  description: siteConfig.description,
}

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeAbout />
      <HomeSkills />
      <HomeProjects />
      <HomeServices />
      <HomeExperience />
      <HomeTestimonials />
      <HomeContact />
    </>
  )
}
