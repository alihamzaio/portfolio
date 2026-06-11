import { HomeHero } from "@/components/home/home-hero"
import dynamic from "next/dynamic"
import { SectionSkeleton } from "@/components/ui/section-skeleton"

import { HomePageJsonLd } from "@/components/seo/home-page-json-ld"
import { buildPageMetadata, SEO_KEYWORDS } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

const HomeClientOffer = dynamic(
  () => import("@/components/home/home-client-offer").then((m) => ({ default: m.HomeClientOffer })),
  { loading: () => <SectionSkeleton lines={4} /> }
)
const HomeAbout = dynamic(
  () => import("@/components/home/home-about").then((m) => ({ default: m.HomeAbout })),
  { loading: () => <SectionSkeleton lines={2} /> }
)
const HomeSkills = dynamic(
  () => import("@/components/home/home-skills").then((m) => ({ default: m.HomeSkills })),
  { loading: () => <SectionSkeleton lines={3} /> }
)
const HomeProjects = dynamic(
  () => import("@/components/home/home-projects").then((m) => ({ default: m.HomeProjects })),
  { loading: () => <SectionSkeleton lines={2} /> }
)
const HomeExperience = dynamic(
  () => import("@/components/home/home-experience").then((m) => ({ default: m.HomeExperience })),
  { loading: () => <SectionSkeleton lines={3} /> }
)
const HomeTestimonials = dynamic(
  () => import("@/components/home/home-testimonials").then((m) => ({ default: m.HomeTestimonials })),
  { loading: () => <SectionSkeleton lines={1} /> }
)
const CtaBand = dynamic(
  () => import("@/components/home/cta-band").then((m) => ({ default: m.CtaBand })),
  { loading: () => <SectionSkeleton lines={1} /> }
)
const HomeContact = dynamic(
  () => import("@/components/home/home-contact").then((m) => ({ default: m.HomeContact })),
  { loading: () => <SectionSkeleton lines={2} /> }
)

export const metadata = buildPageMetadata({
  title: "Ali Hamza | Full Stack Developer (MERN, AWS & Web3)",
  description: siteConfig.description,
  path: "/",
  ogImage: "/opengraph-image",
  keywords: [
    ...SEO_KEYWORDS,
    "hire full stack developer",
    "freelance MERN developer Pakistan",
    "Ali Hamza portfolio",
    "blockchain developer Lahore",
  ],
})

export const revalidate = 3600

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
      <HomeTestimonials />
      <CtaBand />
      <HomeContact />
    </>
  )
}
