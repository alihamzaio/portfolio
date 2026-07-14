import { HomeHero } from "@/components/home/home-hero"
import { HomeAbout } from "@/components/home/home-about"
import { HomeExperience } from "@/components/home/home-experience"
import nextDynamic from "next/dynamic"
import { SectionSkeleton } from "@/components/ui/section-skeleton"
import { HomePageJsonLd } from "@/components/seo/home-page-json-ld"
import { buildPageMetadata, HOME_PAGE_TITLE } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

const HomeClientOffer = nextDynamic(
  () => import("@/components/home/home-client-offer").then((m) => ({ default: m.HomeClientOffer })),
  { loading: () => <SectionSkeleton lines={4} /> }
)
const HomeSkills = nextDynamic(
  () => import("@/components/home/home-skills").then((m) => ({ default: m.HomeSkills })),
  { loading: () => <SectionSkeleton lines={3} /> }
)
const HomeProjects = nextDynamic(
  () => import("@/components/home/home-projects").then((m) => ({ default: m.HomeProjects })),
  { loading: () => <SectionSkeleton lines={2} /> }
)
const HomeTestimonials = nextDynamic(
  () => import("@/components/home/home-testimonials").then((m) => ({ default: m.HomeTestimonials })),
  { loading: () => <SectionSkeleton lines={1} /> }
)
const CtaBand = nextDynamic(
  () => import("@/components/home/cta-band").then((m) => ({ default: m.CtaBand })),
  { loading: () => <SectionSkeleton lines={1} /> }
)
const HomeContact = nextDynamic(
  () => import("@/components/home/home-contact").then((m) => ({ default: m.HomeContact })),
  { loading: () => <SectionSkeleton lines={2} /> }
)

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
      {/* Static imports so crawlers always get real about/experience copy in HTML */}
      <HomeAbout />
      <HomeSkills />
      <HomeProjects />
      <HomeExperience />
      <HomeTestimonials />
      <CtaBand />
      <HomeContact />
    </div>
  )
}
